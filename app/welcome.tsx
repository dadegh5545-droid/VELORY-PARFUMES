"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BRANCHES, branchCity, branchName } from "./catalog";
import { DIR, LOCALE_NAME, T, type Locale } from "./i18n";
import { usePrefs } from "./prefs";

const LOCALES: Locale[] = ["ar", "en", "fr"];

/** خطوات الترحيب بترتيبها: ترحيبُ الدار، ثم اللغة، ثم الفرع */
type Step = "intro" | "locale" | "branch";

/**
 * شاشة الترحيب — أوّل ما يرى الزائر.
 *
 * ترحيبٌ أوّلًا يُقرأ وحده بلا أزرارٍ تنازعه، ثم اللغة ثم الفرع —
 * لأن اللغة تحصر الفروع المعروضة: العربية تفتح الفرعين، والإنجليزية
 * قطر وحدها، والفرنسية تشاد وحدها. فلا يُعرض على الزائر فرعٌ لا
 * يخاطبه بلغته.
 */
export function Welcome() {
  const { asking, set, prefs } = usePrefs();
  const [step, setStep] = useState<Step>("intro");
  const [locale, setLocale] = useState<Locale | null>(null);
  /** شعارٌ لم يُحمَّل يعود إلى اسم الدار نصًّا — أفضلُ من صورةٍ مكسورة
   *  في أوّل ما يرى الزائر */
  const [logoOk, setLogoOk] = useState(true);
  const panel = useRef<HTMLDivElement>(null);

  // كل فتحةٍ جديدة تبدأ من الصفر — إلا الترحيب: من سبق أن اختار إنما
  // فتح الشاشة ليغيّر، فلا يُحبس خلف تحيةٍ قرأها في زيارته الأولى.
  useEffect(() => {
    if (!asking) return;
    setLocale(null);
    setStep(prefs ? "locale" : "intro");
  }, [asking, prefs]);

  // الخلفية لا تُمرَّر تحت الطبقة: تمريرها يُفقد الحوار معناه.
  useEffect(() => {
    if (!asking) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [asking]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const focusables = useCallback(
    () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ??
          []
      ),
    []
  );

  // أوّل ما يُفتح الحوار يذهب التركيز إلى داخله، وإلا بقي على ما خلف الطبقة
  // فيتنقّل الزائرُ بلوحة المفاتيح في صفحةٍ لا يراها.
  useEffect(() => {
    if (!asking) return;
    const first = focusables()[0];
    first?.focus();
  }, [asking, step, focusables]);

  if (!asking) return null;

  /** حبس التركيز: الحوار يحجب الصفحة بصريًّا، فليحجبها عن Tab كذلك.
   *  و Escape يغلق لمن له اختيارٌ سابق — أوّل زيارةٍ لا مهرب منها. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && prefs) {
      set(prefs);
      return;
    }
    if (e.key !== "Tab") return;

    const items = focusables();
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];
    const here = document.activeElement;

    if (e.shiftKey && (here === first || !panel.current?.contains(here))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && here === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const t = locale ? T[locale] : null;
  const branches = locale
    ? BRANCHES.filter((b) => b.locales.includes(locale))
    : [];

  return (
    <div
      className="welcome"
      role="dialog"
      aria-modal="true"
      aria-label="VALORY PARFUMES"
      lang={locale ?? "ar"}
      dir={locale ? DIR[locale] : "rtl"}
      onKeyDown={onKeyDown}
    >
      <div className="welcome-panel" ref={panel}>
        {/* زائرٌ سبق أن اختار ثم فتح الشاشة ليغيّر — له أن يتراجع.
            أوّلُ عنصرٍ في اللوحة كي يبلغه Tab قبل الخيارات لا بعدها. */}
        {prefs && (
          <button
            type="button"
            className="welcome-dismiss"
            onClick={() => set(prefs)}
            aria-label={T[prefs.locale].close}
          >
            ✕
          </button>
        )}

        {/* الترحيب وحده يحمل الشعار كاملًا — وهي شاشةُ التعريف بالدار.
            وفي خطوتَي اللغة والفرع يتقلّص إلى كلمة: الاختيارُ هو المقصود
            هناك، فلا يزاحمه شعارٌ يملأ نصفَ شاشة الهاتف. */}
        {step === "intro" && logoOk ? (
          <img
            className="welcome-logo"
            src="/valory-logo.png"
            alt="VALORY PARFUMES"
            onError={() => setLogoOk(false)}
          />
        ) : (
          <p className="welcome-mark">
            VALORY<span>Parfumes</span>
          </p>
        )}

        {step === "intro" && (
          <div className="welcome-step">
            {/* ترحيبُ الدار بالعربية وحدها: هي لسانُ الفرعين معًا، وأنأى
                عن أن تُقرأ كصفحةِ ترجمةٍ ثلاثية. ومن لا يقرؤها يبلغ
                اختيار اللغة بضغطةٍ واحدة. */}
            <div className="welcome-intro">
              <p lang="ar" dir="rtl">
                مرحبًا بكم في <b>VALORY PARFUMES</b>
              </p>
              <p lang="ar" dir="rtl">
                وجهتكم لعطورٍ تحكي أناقتكم، وتترك أثرًا لا يُنسى{" "}
                <span aria-hidden="true">✨</span>
              </p>
            </div>

            {/* فعلٌ واحدٌ في الشاشة لا ينازعه ثانٍ. ونصُّه بالثلاث وحده،
                لأنه المعبرُ إلى اختيار اللغة فلا يقف دونه لسان. */}
            <button
              type="button"
              className="btn btn-primary welcome-enter"
              onClick={() => setStep("locale")}
            >
              ادخل · Enter · Entrer
            </button>
          </div>
        )}

        {step === "locale" && (
          <div className="welcome-step">
            <p className="welcome-hello">أهلًا بك · Welcome · Bienvenue</p>
            <h2 className="welcome-title">اختر لغتك</h2>
            <p className="welcome-sub">Choose your language · Choisissez votre langue</p>

            <div className="welcome-grid welcome-grid-3">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  type="button"
                  className="choice"
                  lang={l}
                  dir={DIR[l]}
                  onClick={() => {
                    setLocale(l);
                    setStep("branch");
                  }}
                >
                  <span className="choice-main">{LOCALE_NAME[l]}</span>
                  <span className="choice-sub">
                    {BRANCHES.filter((b) => b.locales.includes(l))
                      .map((b) => branchCity(b, l))
                      .join(" · ")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "branch" && locale && t && (
          <div className="welcome-step">
            <p className="welcome-hello">{t.welcomeGreeting}</p>
            <h2 className="welcome-title">{t.chooseBranch}</h2>
            <p className="welcome-sub">
              {branches.length > 1 ? t.welcomeTagline : t.welcomeSingle}
            </p>

            <div className="welcome-grid">
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="choice"
                  style={{ ["--tint" as string]: b.tint }}
                  onClick={() => set({ branch: b.id, locale })}
                >
                  <span className="choice-main">{branchName(b, locale)}</span>
                  <span className="choice-sub">{branchCity(b, locale)}</span>
                </button>
              ))}
            </div>

            {/* الرجوع إلى اللغة لا إلى الترحيب: التحيةُ تُقرأ مرّةً،
                واللغةُ هي ما قد يُعاد فيه النظر */}
            <button
              type="button"
              className="welcome-back"
              onClick={() => {
                setLocale(null);
                setStep("locale");
              }}
            >
              {t.stepBack}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
