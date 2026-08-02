import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATALOG,
  formatPrice,
  getPerfume,
  metaLine,
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

  return {
    title: `${perfume.name} | فالوري`,
    description:
      perfume.description ?? `${perfume.name} — متوفّر في متجر فالوري للعطور.`,
  };
}

export default function PerfumePage({ params }: Props) {
  const perfume = getPerfume(params.id);
  if (!perfume) notFound();

  const others = CATALOG.filter((p) => p.id !== perfume.id).slice(0, 3);
  const specs = specsOf(perfume);

  return (
    <main className="section detail">
      <Link href="/#collection" className="back">
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

          <div className="detail-buy">
            <span className="price detail-price">
              {perfume.price
                ? `${formatPrice(perfume.price)} درهم`
                : "السعر عند الطلب"}
            </span>
            <AddButton id={perfume.id} label="أضف إلى السلة" variant="btn" />
          </div>
        </div>
      </div>

      <section className="also">
        <div className="section-head">
          <div>
            <p className="eyebrow">قد يعجبك أيضًا</p>
            <h2>من المجموعة نفسها</h2>
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
              <div className="card-foot">
                <span className="price">
                  {p.price ? `${formatPrice(p.price)} درهم` : "السعر عند الطلب"}
                </span>
                <AddButton id={p.id} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
