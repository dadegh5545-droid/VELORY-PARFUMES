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
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setPrefs(parse(saved));
    } catch {
      // تخزين معطّل (تصفّح خاص) — يُسأل الزائر في كل زيارة، ولا شيء ينكسر.
    }
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

/** يزامن lang و dir على <html> — الصفحة كلّها بلغةٍ واحدة بعد الاختيار */
export function HtmlLang() {
  const { locale } = useActive();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = DIR[locale];
  }, [locale]);

  return null;
}
