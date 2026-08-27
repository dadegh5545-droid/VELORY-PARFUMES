"use client";

import {
  type Branch,
  branchCity,
  branchName,
  branchScene,
  countLabel,
  perfumesOf,
} from "./catalog";
import { T } from "./i18n";
import { useActive } from "./prefs";
import { Scene } from "./scene";
import { Collection } from "./collection";
import type { Locale } from "./i18n";

/** شريط معلومات المحل — يعرض ما مُلئ فقط، ويختفي كلّيًا إن لم يُملأ شيء */
function BranchInfo({ branch, locale }: { branch: Branch; locale: Locale }) {
  const t = T[locale];

  // الدوامُ سطران بلغة الزائر — نصٌّ دقيقٌ من الكتالوج لا يُشتقّ آليًّا.
  const hoursLines = branch.openingHours
    ? branch.openingHours.lines[locale]
    : branch.hours
    ? [branch.hours]
    : null;

  const rows = [
    branch.address ? { k: t.address, v: branch.address } : null,
  ].filter(Boolean) as { k: string; v: string }[];

  if (
    !rows.length &&
    !hoursLines &&
    !branch.phone &&
    !branch.whatsapp &&
    !branch.mapUrl
  ) {
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

        {hoursLines && (
          <div>
            <dt>{t.hours}</dt>
            <dd>
              {hoursLines.map((line, i) => (
                <span key={i} className="hours-line">
                  {line}
                </span>
              ))}
            </dd>
          </div>
        )}

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
          {/* زرٌّ واضحٌ لفتح المحلّ في خرائط جوجل — لا رابطًا خافتًا */}
          {branch.mapUrl && (
            <a
              className="btn"
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
  const t = T[locale];
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

      {/* البحثُ والترتيبُ والتصفيةُ وكشفُ المزيد كلُّها في المجموعة —
          فرعٌ بلا عطورٍ لا شبكةَ له ولا أدوات. */}
      {perfumes.length > 0 && <Collection branch={branch} locale={locale} />}
    </section>
  );
}
