"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BRANCHES, branchCity, branchName } from "./catalog";
import { DIR, LOCALE_NAME, T, type Locale } from "./i18n";
import { usePrefs } from "./prefs";

const LOCALES: Locale[] = ["ar", "en", "fr"];

/**
 * شاشة الترحيب — أوّل ما يرى الزائر.
 *
 * اللغة أوّلًا ثم الفرع، لأن اللغة تحصر الفروع المعروضة:
 * العربية تفتح الفرعين، والإنجليزية قطر وحدها، والفرنسية تشاد وحدها.
 * فلا يُعرض على الزائر فرعٌ لا يخاطبه بلغته.
 */
export function Welcome() {
  const { asking, set, prefs } = usePrefs();
  const [locale, setLocale] = useState<Locale | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  // كل فتحةٍ جديدة تبدأ من الصفر — ولو كان للزائر اختيارٌ سابق.
  useEffect(() => {
    if (asking) setLocale(null);
  }, [asking]);

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
  }, [asking, locale, focusables]);

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

        <p className="welcome-mark">
          VALORY<span>.</span>
        </p>

        {!locale && (
          <div className="welcome-step">
            {/* لا لغة بعد، فالتحية بالثلاث — ولا يُفترض على الزائر لسان */}
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
                  onClick={() => setLocale(l)}
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

        {locale && t && (
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

            <button
              type="button"
              className="welcome-back"
              onClick={() => setLocale(null)}
            >
              {t.stepBack}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
