"use client";

import Link from "next/link";
import { type Branch, featuredOf, perfumeName } from "./catalog";
import { T, trBrand } from "./i18n";
import type { Locale } from "./i18n";

/**
 * واجهةُ فرع تشاد في صدر الصفحة الأولى.
 *
 * قامت مقامَ الواجهة العامّة (`.hero`) لهذا الفرع وحدَه: تلك عنوانُها
 * مشطورٌ إلى سطرين وقدُّه سبعُ ريمات، فيتكسّر على الشاشة الضيّقة، وتملأ
 * الشاشةَ كلَّها فلا يظهر تحتها عطر. وهذه سطرٌ واحدٌ يسمّي البلد، وتحته
 * عبوةٌ واحدةٌ على هالةٍ ذهبية، وفعلان وشريطُ وعود.
 *
 * وقطرُ باقيةٌ على الواجهة العامّة: عنوانُها لا يذكر بلدًا، وشريطُ الوعود
 * هنا يعِد بتوصيلٍ داخل تشاد وطلبٍ على واتسابها — ولا واتسابَ لقطرَ بعد.
 *
 * ولا صورةَ منظرٍ خلف هذا كلِّه: طلبَ المستخدمُ سوادًا وذهبًا لا خلفيةً
 * مزدحمة. ومشهدُ تشاد باقٍ في صدر قسم الفرع أسفلَ الصفحة كما كان.
 */
export function ChadHero({
  branch,
  locale,
}: {
  branch: Branch;
  locale: Locale;
}) {
  const h = T[locale].heroChad;
  // قد لا يكون ثمّة عطرُ واجهة (حُذف من الفرع أو لا صورةَ له) — فتبقى
  // الواجهةُ عنوانًا ووعدًا وزرَّ تسوّق، ولا تنكسر ولا تترك فجوة.
  const star = featuredOf(branch);

  return (
    <section className="hero-chad">
      <div className="hero-chad-inner">
        <h1 className="hero-chad-title">{h.title}</h1>
        <p className="hero-chad-text">{h.text}</p>

        {star && (
          <div className="hero-chad-stage">
            {/* الهالةُ والنقشُ زخرفةٌ خالصة، فيُخفيان عن القارئ الآلي */}
            <span className="hero-chad-halo" aria-hidden="true" />
            <span className="hero-chad-naqsh" aria-hidden="true" />
            <img
              className="hero-chad-photo"
              src={star.image}
              alt={perfumeName(star, locale)}
              /* بطلُ أوّلِ شاشةٍ لا يُؤجَّل تحميلُه: التأجيلُ هنا يُظهر
                 الواجهةَ فارغةً في أوّل لحظةٍ يراها الزائر. */
              fetchPriority="high"
              decoding="async"
            />
            <p className="hero-chad-name">
              {perfumeName(star, locale)}
              {/* الدارُ بحروف لغة الزائر: `نسيم` خامًا تحت عنوانٍ فرنسيّ
                  تقرأ سطرًا غريبًا، و`trBrand` تنقلها كما تنقلها صفحةُ
                  العطر — فاسمُ الدار واحدٌ في موضعَيه. */}
              {star.brand && <span>{trBrand(star.brand, locale)}</span>}
            </p>
          </div>
        )}

        <div className="hero-chad-actions">
          {/* التسوّقُ نزولٌ إلى قسم الفرع في الصفحة نفسِها، لا انتقالُ صفحة */}
          <a href={`#${branch.id}`} className="btn btn-primary">
            {h.shop}
          </a>
          {star && (
            <Link href={`/parfum/${star.id}`} className="btn">
              {h.featured}
            </Link>
          )}
        </div>

        <ul className="hero-chad-strip">
          {h.strip.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
