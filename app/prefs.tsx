"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BRANCHES, type BranchId } from "./catalog";
import { DIR, isLocale, type Locale } from "./i18n";

// ما يختاره الزائر في شاشة الترحيب: فرعُه ولغتُه.
// يُحفظ فيُسأل مرّةً واحدة، ويبقى تغييرُه بيده من الترويسة.
export type Prefs = { branch: BranchId; locale: Locale };

type PrefsValue = {
  prefs: Prefs | null;
  /** false حتى تُقرأ الذاكرة — تمنع وميض الترحيب على زائرٍ سبق أن اختار */
  ready: boolean;
  set: (p: Prefs) => void;
  /** يعيد فتح الترحيب بلا مسح الاختيار السابق */
  reopen: () => void;
  asking: boolean;
};

const FALLBACK: Prefs = { branch: BRANCHES[0].id, locale: "ar" };

const PrefsContext = createContext<PrefsValue>({
  prefs: null,
  ready: false,
  set: () => {},
  reopen: () => {},
  asking: false,
});

const STORAGE_KEY = "valory.prefs";

/** معامِلُ اللغة في الرابط — عليه تُبنى وسومُ hreflang في app/page-meta.ts */
const LANG_PARAM = "lang";

/** لغةُ المحتوى الأصل — رابطُها مجرَّدٌ بلا معامِل */
const DEFAULT_LOCALE: Locale = "ar";

/**
 * يزامن `?lang=` مع اللغة المختارة، في الصفحة نفسِها بلا إعادة تحميل.
 *
 * `replaceState` لا `push`: تبديلُ اللغة ليس انتقالًا إلى صفحةٍ أخرى، فلا
 * يُثقَل تاريخُ المتصفّح بخطوةٍ يرجع إليها زرُّ الرجوع. والزائرُ يبقى في
 * موضعه من الصفحة — لا يُقذف إلى أوّلها كما لو أُعيد التحميل.
 */
function syncLangParam(locale: Locale) {
  try {
    const url = new URL(window.location.href);
    if (locale === DEFAULT_LOCALE) url.searchParams.delete(LANG_PARAM);
    else url.searchParams.set(LANG_PARAM, locale);
    window.history.replaceState(null, "", url.toString());
  } catch {
    // لا تاريخَ في بيئةٍ غريبة — الاختيارُ محفوظٌ أصلًا، ولا شيء ينكسر.
  }
}

const isBranchId = (v: unknown): v is BranchId =>
  BRANCHES.some((b) => b.id === v);

/** يتحقّق أن المحفوظ ما زال يطابق الفروع ولغاتها — قد تتغيّر بين زيارتين */
const parse = (raw: string): Prefs | null => {
  try {
    const v = JSON.parse(raw) as Partial<Prefs>;
    if (!isBranchId(v.branch) || !isLocale(v.locale)) return null;
    const branch = BRANCHES.find((b) => b.id === v.branch)!;
    return branch.locales.includes(v.locale)
      ? { branch: v.branch, locale: v.locale }
      : null;
  } catch {
    return null;
  }
};

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [ready, setReady] = useState(false);
  const [reopened, setReopened] = useState(false);

  // القراءة بعد التركيب: localStorage غير موجود على الخادم، والبدء بالفراغ
  // يجعل HTML الخادم والمتصفح متطابقين فلا يقع hydration mismatch.
  //
  // و`?lang=` يعلو على المحفوظ: هو ما تشير إليه وسومُ hreflang وما يُشارَك
  // في رابط. فمن فُتح له الرابطُ الفرنسيّ رأى الفرنسيةَ ولو كان قد اختار
  // العربيةَ في زيارةٍ سابقة — وإلا كان الوسمُ وعدًا لا يفي به الموقع.
  useEffect(() => {
    let saved: Prefs | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) saved = parse(raw);
    } catch {
      // تخزين معطّل (تصفّح خاص) — يُسأل الزائر في كل زيارة، ولا شيء ينكسر.
    }

    const asked = new URLSearchParams(window.location.search).get(LANG_PARAM);
    if (isLocale(asked)) {
      // الفرعُ من المحفوظ إن صحّ، وإلا فالافتراض — واللغةُ من الرابط.
      const branch = saved?.branch ?? FALLBACK.branch;
      const b = BRANCHES.find((x) => x.id === branch);
      if (b?.locales.includes(asked)) saved = { branch, locale: asked };
    }

    if (saved) setPrefs(saved);
    setReady(true);
  }, []);

  const set = useCallback((p: Prefs) => {
    setPrefs(p);
    setReopened(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      // الاختيار يبقى في الذاكرة لهذه الجلسة.
    }
    syncLangParam(p.locale);
  }, []);

  const reopen = useCallback(() => setReopened(true), []);

  return (
    <PrefsContext.Provider
      value={{ prefs, ready, set, reopen, asking: ready && (!prefs || reopened) }}
    >
      {children}
    </PrefsContext.Provider>
  );
}

export const usePrefs = () => useContext(PrefsContext);

/** الاختيار الفعلي للعرض — الافتراضُ قبل أن يختار الزائر */
export const useActive = (): Prefs => usePrefs().prefs ?? FALLBACK;

/** يزامن lang وdir على <html>، وcanonical مع لغة الصفحة المعروضة.
 *
 *  الصفحاتُ ثابتةٌ (مولَّدةٌ وقتَ البناء)، فالـHTML المخدوم واحدٌ لكلِّ
 *  سلاسل الاستعلام — وcanonical المطبوعُ فيه يشير إلى الرابط المجرّد.
 *  فلو تُرك، لقالت نسخةُ `?lang=fr` إنّ أصلَها النسخةُ العربية، وهي
 *  تناقض وسمَ hreflang الذي يعدّها نسخةً قائمةً بذاتها. فيُحدَّث هنا
 *  ليشير كلُّ رابطٍ إلى نفسِه. */
export function HtmlLang() {
  const { locale } = useActive();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = DIR[locale];

    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) return;
    try {
      const here = new URL(window.location.href);
      const canon = new URL(link.href);
      canon.search = "";
      if (locale !== DEFAULT_LOCALE) canon.searchParams.set(LANG_PARAM, locale);
      // المسارُ من canonical المطبوع (هو الصحيحُ للصفحة)، والاستعلامُ من اللغة
      canon.pathname = here.pathname;
      link.href = canon.toString();
    } catch {
      // رابطٌ غيرُ قابلٍ للتحليل — يبقى canonical كما طُبع، ولا شيء ينكسر.
    }
  }, [locale]);

  return null;
}
