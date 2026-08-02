"use client";

import { useState } from "react";
import Link from "next/link";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import {
  CATALOG,
  FILTERS,
  collectionTitle,
  formatPrice,
  metaLine,
} from "./catalog";
import { AddButton } from "./site-header";

// الاتصال بـ AWS يبقى مهيّأً — جاهز لربط الكتالوج بموديل Perfume لاحقًا.
Amplify.configure(outputs);

export default function Home() {
  const [gender, setGender] = useState("الكل");

  const visible =
    gender === "الكل" ? CATALOG : CATALOG.filter((p) => p.gender === gender);

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">دار عطور · منذ 2026</p>
          <h1>
            فنُّ
            <em>العِطر</em>
          </h1>
          <p>
            خلاصاتٌ نادرة، تُمزج يدويًا في دفعاتٍ صغيرة. كلُّ قارورةٍ تحمل توقيع
            حرفةٍ لا تستعجل.
          </p>
          <a href="#collection" className="btn">
            اكتشف المجموعة
          </a>
        </div>
      </section>

      <section className="section" id="collection">
        <div className="section-head">
          <div>
            <p className="eyebrow">المجموعة</p>
            <h2>{collectionTitle}</h2>
          </div>
          <p>اضغط على أيّ عطرٍ لتفاصيله الكاملة.</p>
        </div>

        {FILTERS.length > 0 && (
          <div className="filters" role="group" aria-label="تصفية حسب النوع">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className="filter"
                aria-pressed={gender === f}
                onClick={() => setGender(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-2">
          {visible.map((p) => (
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

                {p.notes && (
                  <dl className="pyramid">
                    <div>
                      <dt>المقدّمة</dt>
                      <dd>{p.notes.head}</dd>
                    </div>
                    <div>
                      <dt>القلب</dt>
                      <dd>{p.notes.heart}</dd>
                    </div>
                    <div>
                      <dt>القاعدة</dt>
                      <dd>{p.notes.base}</dd>
                    </div>
                  </dl>
                )}

                {p.longevity && (
                  <p className="spec">
                    <span>الثبات</span>
                    {p.longevity}
                  </p>
                )}
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

      <section className="quote" id="maison">
        <blockquote>
          «العِطرُ ليس زينة.
          <br />
          إنه ذاكرةٌ تُلبَس.»
          <cite>فالوري — دار عطور</cite>
        </blockquote>
      </section>
    </main>
  );
}
