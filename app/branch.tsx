"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type Branch,
  countLabel,
  filtersOf,
  metaLine,
  perfumesOf,
  priceIn,
} from "./catalog";
import { AddButton } from "./site-header";

/** شريط معلومات المحل — يعرض ما مُلئ فقط، ويختفي كلّيًا إن لم يُملأ شيء */
function BranchInfo({ branch }: { branch: Branch }) {
  const rows = [
    branch.address ? { k: "العنوان", v: branch.address } : null,
    branch.hours ? { k: "الدوام", v: branch.hours } : null,
  ].filter(Boolean) as { k: string; v: string }[];

  if (!rows.length && !branch.phone && !branch.whatsapp && !branch.mapUrl) {
    return null;
  }

  return (
    <div className="branch-info">
      <dl className="branch-rows">
        {rows.map((r) => (
          <div key={r.k}>
            <dt>{r.k}</dt>
            <dd>{r.v}</dd>
          </div>
        ))}

        {branch.phone && (
          <div>
            <dt>الهاتف</dt>
            {/* dir=ltr على الرقم: بدونه يقفز رمز الدولة إلى آخر السطر في RTL */}
            <dd>
              <a href={`tel:${branch.phone.replace(/\s/g, "")}`} dir="ltr">
                {branch.phone}
              </a>
            </dd>
          </div>
        )}
      </dl>

      {(branch.whatsapp || branch.mapUrl) && (
        <div className="branch-actions">
          {branch.whatsapp && (
            <a
              className="btn"
              href={`https://wa.me/${branch.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              اطلب عبر واتساب
            </a>
          )}
          {branch.mapUrl && (
            <a
              className="branch-map"
              href={branch.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              موقع المحل على الخريطة
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function BranchSection({ branch }: { branch: Branch }) {
  const perfumes = perfumesOf(branch.id);
  const filters = filtersOf(branch.id);
  const [gender, setGender] = useState("الكل");

  const visible =
    gender === "الكل" ? perfumes : perfumes.filter((p) => p.gender === gender);

  return (
    <section
      className="section branch"
      id={branch.id}
      style={{ ["--tint" as string]: branch.tint }}
    >
      <div className="section-head">
        <div>
          <p className="eyebrow">{branch.city}</p>
          <h2>{branch.name}</h2>
        </div>
        <p>
          {countLabel(perfumes.length)} — بأسعار الفرع. اضغط على أيّ عطرٍ
          لتفاصيله الكاملة.
        </p>
      </div>

      <BranchInfo branch={branch} />

      {filters.length > 0 && (
        <div
          className="filters"
          role="group"
          aria-label={`تصفية عطور ${branch.name} حسب النوع`}
        >
          {filters.map((f) => (
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
              <span className="price">{priceIn(p, branch)}</span>
              <AddButton id={p.id} branch={branch.id} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
