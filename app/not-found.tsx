"use client";

import Link from "next/link";
import { T } from "./i18n";
import { useActive } from "./prefs";

// صفحةُ 404 بأسلوب الدار — لا صفحةَ Next الرماديةَ الافتراضية.
//
// «عميل» لأنها تنطق بلغة الزائر المحفوظة كبقيّة الصفحات: رابطٌ مكسورٌ
// يقع عليه زبونٌ فرنسيُّ اللسان لا يُردّ بالعربية. والخروجُ منها بابان:
// المجموعةُ (قسمُ الفرع في الصفحة الأولى) والصفحةُ الأولى نفسُها.

export default function NotFound() {
  const { locale, branch } = useActive();
  const t = T[locale];

  return (
    <main id="main" className="section info not-found">
      <header className="info-head">
        <p className="eyebrow">404</p>
        <h1>{t.notFoundTitle}</h1>
        <p className="info-intro">{t.notFoundText}</p>
      </header>

      <div className="hero-actions">
        {/* إلى قسم الفرع مباشرةً: من ضلّ عن عطرٍ يريد المجموعةَ لا الواجهة */}
        <Link href={`/#${branch}`} className="btn btn-primary">
          {t.notFoundCta}
        </Link>
        <Link href="/" className="btn">
          {t.notFoundHome}
        </Link>
      </div>
    </main>
  );
}
