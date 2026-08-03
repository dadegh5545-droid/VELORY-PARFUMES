import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATALOG,
  branchesOf,
  getPerfume,
  metaLine,
  priceIn,
  specsOf,
} from "../../catalog";
import { AddButton } from "../../site-header";

type Props = { params: { id: string } };

// يولّد صفحة ثابتة لكل عطر وقت البناء بدل تصييرها عند كل طلب.
export function generateStaticParams() {
  return CATALOG.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const perfume = getPerfume(params.id);
  if (!perfume) return { title: "عطر غير موجود | فالوري" };

  const where = branchesOf(perfume)
    .map((b) => b.city)
    .join(" و");

  return {
    title: `${perfume.name} | فالوري`,
    description:
      perfume.description ??
      (where
        ? `${perfume.name} — متوفّر في متجر فالوري بـ${where}.`
        : `${perfume.name} — من مجموعة فالوري للعطور.`),
  };
}

export default function PerfumePage({ params }: Props) {
  const perfume = getPerfume(params.id);
  if (!perfume) notFound();

  const others = CATALOG.filter((p) => p.id !== perfume.id).slice(0, 3);
  const specs = specsOf(perfume);
  // العطر الواحد قد يُباع في الفرعين بسعرين وعملتين — فالشراء صفٌّ لكل فرع،
  // لا سعرًا واحدًا وزرًّا واحدًا كما كان قبل افتتاح الفرع الثاني.
  const offers = branchesOf(perfume);

  return (
    <main className="section detail">
      <Link href="/" className="back">
        العودة إلى المجموعة
      </Link>

      <div className="detail-grid">
        <div
          className="bottle detail-bottle"
          style={{ ["--tint" as string]: perfume.tint }}
          aria-hidden="true"
        >
          <div className="bottle-glass" />
        </div>

        <div className="detail-info">
          <h1>{perfume.name}</h1>
          {metaLine(perfume) && <p className="notes">{metaLine(perfume)}</p>}

          {perfume.description && (
            <p className="detail-desc">{perfume.description}</p>
          )}

          {perfume.notes && (
            <dl className="pyramid detail-pyramid">
              <div>
                <dt>المقدّمة</dt>
                <dd>{perfume.notes.head}</dd>
              </div>
              <div>
                <dt>القلب</dt>
                <dd>{perfume.notes.heart}</dd>
              </div>
              <div>
                <dt>القاعدة</dt>
                <dd>{perfume.notes.base}</dd>
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
            <p className="offers-head">التوفّر والأسعار</p>

            {offers.length === 0 && (
              <p className="notes">غير متوفّر حاليًا في أيٍّ من الفروع.</p>
            )}

            {offers.map((b) => (
              <div className="offer" key={b.id}>
                <div className="offer-where">
                  <span>{b.name}</span>
                  <small>{b.city}</small>
                </div>
                <span className="price">{priceIn(perfume, b)}</span>
                <AddButton
                  id={perfume.id}
                  branch={b.id}
                  label="أضف إلى السلة"
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
            <p className="eyebrow">قد يعجبك أيضًا</p>
            <h2>عطورٌ أخرى</h2>
          </div>
        </div>

        <div className="grid">
          {others.map((p) => (
            <article className="card" key={p.id}>
              <Link href={`/parfum/${p.id}`} className="card-link">
                <div
                  className="bottle"
                  style={{ ["--tint" as string]: p.tint }}
                  aria-hidden="true"
                >
                  <div className="bottle-glass" />
                </div>
                <h3>{p.name}</h3>
                {metaLine(p) && <p className="notes">{metaLine(p)}</p>}
              </Link>
              {/* لا سعر هنا: السعر يخصّ فرعًا بعينه، فنكتفي بذكر أين يُباع */}
              <div className="card-foot">
                <span className="at-branches">
                  {branchesOf(p)
                    .map((b) => b.city)
                    .join(" · ") || "غير متوفّر"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
