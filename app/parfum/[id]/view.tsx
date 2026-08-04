"use client";

import Link from "next/link";
import {
  CATALOG,
  type Perfume,
  branchCityIn,
  branchNameIn,
  branchesOf,
  metaLine,
  perfumeDescription,
  perfumeName,
  perfumeNotes,
  priceIn,
  specsOf,
} from "../../catalog";
import { T } from "../../i18n";
import { useActive } from "../../prefs";
import { Bottle } from "../../bottle";
import { AddButton } from "../../site-header";

/**
 * جسد صفحة التفاصيل — عميلٌ لأن اللغة اختيارُ الزائر المحفوظ عنده،
 * لا وسمٌ في الرابط. القشرة تبقى على الخادم فتُبنى الصفحات ثابتةً كما كانت.
 */
export function PerfumeView({ perfume }: { perfume: Perfume }) {
  const { locale } = useActive();
  const t = T[locale];

  const others = CATALOG.filter((p) => p.id !== perfume.id).slice(0, 3);
  const specs = specsOf(perfume, locale);
  const notes = perfumeNotes(perfume, locale);
  const description = perfumeDescription(perfume, locale);
  const meta = metaLine(perfume, locale);
  // العطر الواحد قد يُباع في الفرعين بسعرين وعملتين — فالشراء صفٌّ لكل فرع.
  const offers = branchesOf(perfume);

  return (
    <main className="section detail">
      <Link href="/" className="back">
        {t.back}
      </Link>

      <div className="detail-grid">
        <Bottle perfume={perfume} className="detail-bottle" />

        <div className="detail-info">
          <h1>{perfumeName(perfume, locale)}</h1>
          {/* اللاتيني سطرٌ ثانٍ تحت العربي فقط — وإلا كرّر العنوان نفسه */}
          {locale === "ar" && perfume.latin && (
            <p className="latin detail-latin">{perfume.latin}</p>
          )}
          {meta && <p className="notes">{meta}</p>}

          {description && <p className="detail-desc">{description}</p>}

          {notes && (
            <dl className="pyramid detail-pyramid">
              <div>
                <dt>{t.head}</dt>
                <dd>{notes.head}</dd>
              </div>
              <div>
                <dt>{t.heart}</dt>
                <dd>{notes.heart}</dd>
              </div>
              <div>
                <dt>{t.base}</dt>
                <dd>{notes.base}</dd>
              </div>
            </dl>
          )}

          {specs.length > 0 && (
            <dl className="specs">
              {specs.map((s) => (
                <div key={s.k}>
                  <dt>{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="offers">
            <p className="offers-head">{t.availability}</p>

            {offers.length === 0 && <p className="notes">{t.soldNowhere}</p>}

            {offers.map((b) => (
              <div className="offer" key={b.id}>
                <div className="offer-where">
                  <span>{branchNameIn(b, locale)}</span>
                  <small>{branchCityIn(b, locale)}</small>
                </div>
                <span className="price">{priceIn(perfume, b, locale)}</span>
                <AddButton
                  id={perfume.id}
                  branch={b.id}
                  label={t.addToCart}
                  variant="btn"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="also">
        <div className="section-head">
          <div>
            <p className="eyebrow">{t.alsoEyebrow}</p>
            <h2>{t.alsoTitle}</h2>
          </div>
        </div>

        <div className="grid">
          {others.map((p) => (
            <article className="card" key={p.id}>
              <Link href={`/parfum/${p.id}`} className="card-link">
                <Bottle perfume={p} />
                <div className="card-body">
                  <h3>{perfumeName(p, locale)}</h3>
                  {locale === "ar" && p.latin && (
                    <p className="latin">{p.latin}</p>
                  )}
                </div>
              </Link>
              {/* لا سعر هنا: السعر يخصّ فرعًا بعينه، فنكتفي بذكر أين يُباع */}
              <div className="card-foot">
                <span className="at-branches">
                  {branchesOf(p)
                    .map((b) => branchCityIn(b, locale))
                    .join(" · ") || t.unavailable}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
