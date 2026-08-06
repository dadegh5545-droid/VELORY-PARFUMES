"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ALL_SCENES,
  BRANCHES,
  branchCity,
  branchName,
  getBranch,
  scenePlace,
  type BranchId,
} from "./catalog";
import { LOCALE_SHORT, T } from "./i18n";
import { useCart } from "./cart";
import { useActive, usePrefs } from "./prefs";

/** هل نزل الزائر عن أعلى الصفحة؟ — عليه يتوقّف ظهور ستار الترويسة */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const read = () => setScrolled(window.scrollY > 24);
    read(); // الصفحة قد تُفتح على موضعٍ محفوظ، فلا ننتظر أوّل تمرير
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, []);

  return scrolled;
}

export function SiteHeader() {
  const { items } = useCart();
  const { reopen } = usePrefs();
  const { branch, locale } = useActive();
  const t = T[locale];
  const active = getBranch(branch);
  const solid = useScrolled();

  return (
    <header className={solid ? "header header-solid" : "header"}>
      {/* اسم الدار يبقى باللاتينية — وهو العرف في العلامات الفاخرة.
          وسطران كما هو في شعارها المرسوم: الاسمُ فوق والصفةُ تحته. */}
      <Link href="/" className="wordmark">
        VALORY<span>Parfumes</span>
      </Link>

      <nav className="nav">
        <Link href={`/#${branch}`}>
          {active ? branchName(active, locale) : t.navHouse}
        </Link>
        <Link href="/#maison">{t.navHouse}</Link>
        <Link href="/#contact">{t.navContact}</Link>

        <Link href={`/#${branch}`} className="cart">
          {/* aria-live كي يُعلَن العدد الجديد لمن لا يرى الترويسة عند الإضافة */}
          {t.navCart} <span aria-live="polite">({items.length})</span>
        </Link>

        {/* مفتاحٌ واحد يعيد فتح الترحيب: الفرع واللغة اختيارٌ واحدٌ مترابط.
            الزرّ ينطق "نجامينا عربي" — اسمان بلا فعل — وtitle لا يدخل في حساب
            الاسم المتاح، فيُدَسّ الفعلُ نصًّا مخفيًّا عن البصر لا عن السمع. */}
        <button
          type="button"
          className="switcher"
          onClick={reopen}
          aria-haspopup="dialog"
        >
          <span className="vh">{t.navChange}</span>
          <span>{active ? branchCity(active, locale) : ""}</span>
          <span className="switcher-lang">{LOCALE_SHORT[locale]}</span>
        </button>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { locale } = useActive();
  const t = T[locale];

  return (
    <footer className="footer" id="contact">
      <div className="footer-line">
        <span>© 2026 {t.rights}</span>
        <span>{BRANCHES.map((b) => branchCity(b, locale)).join(" · ")}</span>
      </div>

      {/* إسنادُ صور المشاهد — شرطٌ في رخص المشاع الإبداعي لا مجاملة:
          من صوّر المنظرَ يُذكر باسمه ورخصته، والرابط يُثبت المصدر. */}
      <p className="footer-credits">
        <span>{t.photosBy}</span>{" "}
        {ALL_SCENES.map((s, i) => (
          <span key={s.image}>
            {i > 0 && " · "}
            <a href={s.credit.source} target="_blank" rel="noreferrer">
              {scenePlace(s, locale)}
            </a>{" "}
            <span className="footer-by">
              {s.credit.by} ({s.credit.license})
            </span>
          </span>
        ))}
      </p>
    </footer>
  );
}

export function AddButton({
  id,
  branch,
  label,
  variant,
}: {
  id: string;
  branch: BranchId;
  label?: string;
  variant?: "btn";
}) {
  const { add } = useCart();
  const { locale } = useActive();

  return (
    <button
      type="button"
      className={variant === "btn" ? "btn" : "add"}
      onClick={() => add(id, branch)}
    >
      {label ?? T[locale].add}
    </button>
  );
}
