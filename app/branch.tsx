"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type Branch,
  type Gender,
  branchCity,
  branchName,
  branchScene,
  countLabel,
  filtersOf,
  metaLine,
  perfumeScene,
  perfumeName,
  perfumeNotes,
  perfumesOf,
  priceIn,
} from "./catalog";
import { GENDER_TR, T } from "./i18n";
import { useActive } from "./prefs";
import { Bottle } from "./bottle";
import { Scene } from "./scene";
import { AddButton } from "./site-header";
import type { Locale } from "./i18n";

/** شريط معلومات المحل — يعرض ما مُلئ فقط، ويختفي كلّيًا إن لم يُملأ شيء */
function BranchInfo({ branch, locale }: { branch: Branch; locale: Locale }) {
  const t = T[locale];

  const rows = [
    branch.address ? { k: t.address, v: branch.address } : null,
    branch.hours ? { k: t.hours, v: branch.hours } : null,
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
            <dt>{t.phone}</dt>
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
              {t.whatsapp}
            </a>
          )}
          {branch.mapUrl && (
            <a
              className="branch-map"
              href={branch.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t.mapLink}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function BranchSection({ branch }: { branch: Branch }) {
  // اللغة اختيارُ الزائر في الترحيب، لا اختيارُ كل قسمٍ على حدة.
  const { locale } = useActive();
  const perfumes = perfumesOf(branch.id);
  const genders = filtersOf(branch.id);
  const [gender, setGender] = useState<Gender | null>(null);

  const t = T[locale];
  const visible = gender ? perfumes.filter((p) => p.gender === gender) : perfumes;
  const scene = branchScene(branch);

  return (
    <section
      className={scene ? "section branch has-scene" : "section branch"}
      id={branch.id}
      style={{ ["--tint" as string]: branch.tint }}
    >
      {scene && <Scene scene={scene} locale={locale} />}

      <div className="section-head">
        <div>
          <p className="eyebrow">{branchCity(branch, locale)}</p>
          <h2>{branchName(branch, locale)}</h2>
        </div>
        {/* فرعٌ بلا عطور لا يُقال له "اضغط على أيّ عطر" — الجملة تفترض وجودها */}
        <p>
          {countLabel(perfumes.length, locale)}{" "}
          {perfumes.length ? t.sectionLead : t.sectionEmpty}
        </p>
      </div>

      <BranchInfo branch={branch} locale={locale} />

      {genders.length > 0 && (
        <div
          className="filters"
          role="group"
          aria-label={t.filterGroup(branchName(branch, locale))}
        >
          <button
            type="button"
            className="filter"
            aria-pressed={gender === null}
            onClick={() => setGender(null)}
          >
            {t.filterAll}
          </button>
          {genders.map((g) => (
            <button
              key={g}
              type="button"
              className="filter"
              aria-pressed={gender === g}
              onClick={() => setGender(g)}
            >
              {GENDER_TR[g][locale]}
            </button>
          ))}
        </div>
      )}

      {/* الشبكة الفارغة إطارٌ مرسومٌ حول لا شيء، فتُحذف بدل أن تُعرض خاوية */}
      {visible.length > 0 && (
        <div className="grid">
          {visible.map((p) => {
            const notes = perfumeNotes(p, locale);
            const meta = metaLine(p, locale);

            return (
              <article className="card" key={p.id}>
                <Link href={`/parfum/${p.id}`} className="card-link">
                  {/* لكلِّ عطرٍ مشهدُه من بلد الفرع خلف عبوته — مشتقٌّ من
                      حروف معرّفه فلا يتبدّل بين زيارةٍ وأخرى */}
                  <Bottle perfume={p} scene={perfumeScene(p)} />

                  <div className="card-body">
                    <h3>{perfumeName(p, locale)}</h3>
                    {/* الاسم اللاتيني سطرٌ ثانٍ تحت العربي فقط —
                        في الإنجليزية والفرنسية هو العنوانُ نفسه، فلا يُكرَّر */}
                    {locale === "ar" && p.latin && (
                      <p className="latin">{p.latin}</p>
                    )}
                    {meta && <p className="notes">{meta}</p>}

                    {notes && (
                      <dl className="pyramid">
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
                  </div>
                </Link>

                <div className="card-foot">
                  <span className="price">{priceIn(p, branch, locale)}</span>
                  <AddButton id={p.id} branch={branch.id} label={t.add} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
