"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BRANCHES,
  branchCity,
  branchName,
  getBranch,
  type BranchId,
} from "./catalog";
import { LOCALE_SHORT, T } from "./i18n";
import { useCart } from "./cart";
import { useActive, usePrefs } from "./prefs";
import { useToast } from "./toast";
import { INFO, INFO_LINKS } from "./info-content";
import { BRAND_MARK, SITE_NAME } from "./site-config";

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
  // القائمةُ مفتوحةٌ أو مطويّة — على الجوال وحده يظهر زرُّها
  const [menu, setMenu] = useState(false);
  const close = () => setMenu(false);
  const { countOf, setOpen } = useCart();
  const { reopen } = usePrefs();
  const { branch, locale } = useActive();
  const t = T[locale];
  const active = getBranch(branch);
  const solid = useScrolled();

  return (
    <header className={solid ? "header header-solid" : "header"}>
      {/* اسم الدار يبقى باللاتينية — وهو العرف في العلامات الفاخرة.
          وسطران كما هو في شعارها المرسوم: الاسمُ فوق والصفةُ تحته. */}
      <Link href="/" className="wordmark" aria-label={SITE_NAME}>
        {BRAND_MARK.lead}
        <span>{BRAND_MARK.tail}</span>
      </Link>

      {/* أدواتُ الترويسة في غلافٍ واحد. السلةُ أختُ الـnav لا ابنتُه، فتبقى
          ظاهرةً في الترويسة على الجوال بلا إخراجها من لوحٍ مطويّ بالإزاحة. */}
      <div className="header-tools">
        <nav className={menu ? "nav nav-open" : "nav"} id="site-nav">
          <Link href={`/#${branch}`} onClick={close}>
            {active ? branchName(active, locale) : t.navHouse}
          </Link>
          <Link href="/#maison" onClick={close}>
            {t.navHouse}
          </Link>
          <Link href="/#contact" onClick={close}>
            {t.navContact}
          </Link>

          {/* مفتاحٌ واحد يعيد فتح الترحيب: الفرع واللغة اختيارٌ واحدٌ مترابط.
              الزرّ ينطق "نجامينا عربي" — اسمان بلا فعل — وtitle لا يدخل في
              حساب الاسم المتاح، فيُدَسّ الفعلُ نصًّا مخفيًّا عن البصر لا السمع. */}
          <button
            type="button"
            className="switcher"
            onClick={() => {
              close();
              reopen();
            }}
            aria-haspopup="dialog"
          >
            <span className="vh">{t.navChange}</span>
            <span>{active ? branchCity(active, locale) : ""}</span>
            <span className="switcher-lang">{LOCALE_SHORT[locale]}</span>
          </button>
        </nav>

        {/* زرٌّ لا رابط: السلةُ لوحةٌ تُفتح فوق الصفحة، ولا صفحةَ لها.
            على الجوال أيقونةٌ بشارةِ عددٍ، وعلى الحاسوب نصٌّ معها. */}
        <button
          type="button"
          className="cart"
          onClick={() => {
            close();
            setOpen(true);
          }}
          aria-label={`${t.navCart} (${countOf(branch)})`}
        >
          <svg
            className="cart-icon"
            viewBox="0 0 24 24"
            width="19"
            height="19"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 8h12l-1 11H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2"
            />
          </svg>
          <span className="cart-text" aria-hidden="true">
            {t.navCart}
          </span>
          {/* aria-live كي يُعلَن العدد الجديد لمن لا يرى الترويسة عند الإضافة.
              وعدّادُ الفرع الذي يقف فيه الزائر وحده — لكلِّ فرعٍ سلّتُه. */}
          <span className="cart-count" aria-live="polite">
            {countOf(branch)}
          </span>
        </button>

        {/* زرُّ القائمة — للجوال وحده (CSS). يفتح روابطَ التنقّل التي كانت
            تُخفى على الجوال بلا بديلٍ يبلغها. */}
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMenu((v) => !v)}
          aria-expanded={menu}
          aria-controls="site-nav"
        >
          <span className="vh">{t.navMenu}</span>
          <span className="nav-toggle-bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { locale } = useActive();
  const t = T[locale];

  return (
    <footer className="footer" id="contact">
      {/* روابطُ الصفحات التعريفية — عنوانُ كلِّ صفحةٍ بلغة الزائر من INFO */}
      <nav className="footer-nav" aria-label={t.navHouse}>
        {INFO_LINKS.map((l) => (
          <Link key={l.key} href={l.path}>
            {INFO[locale][l.key].title}
          </Link>
        ))}
      </nav>

      <div className="footer-line">
        {/* اسمُ الدار من ثابتٍ واحد (SITE_NAME) لا من جدول اللغات: كان
            التذييلُ ينطق «فالوري بارفوم» بالعربية و«VALORY PARFUMES»
            باللاتينية، فيختلف عن الترويسة ذاتِها في الصفحة الواحدة. */}
        <span>© 2026 {SITE_NAME}</span>
        <span>{BRANCHES.map((b) => branchCity(b, locale)).join(" · ")}</span>
      </div>

      {/* إسنادُ صور المشاهد انتقل إلى صفحة الحقوق /credits — يبقى هنا رابطُها
          وحده، فلا يزدحم التذييلُ بقائمةٍ طويلةٍ من المصوّرين والرخص. */}
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
  const { show } = useToast();

  return (
    <button
      type="button"
      className={variant === "btn" ? "btn" : "add"}
      // الإضافةُ يتبعها إشعارٌ فاخرٌ يؤكّد الفعل — طمأنينةٌ بلا فتحِ اللوحة.
      onClick={() => {
        add(id, branch);
        show(T[locale].addedToCart);
      }}
    >
      {label ?? T[locale].add}
    </button>
  );
}
