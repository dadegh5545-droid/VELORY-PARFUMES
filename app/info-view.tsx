"use client";

import Link from "next/link";
import {
  ALL_SCENES,
  BRANCHES,
  branchCityIn,
  branchNameIn,
  scenePlace,
} from "./catalog";
import { T } from "./i18n";
import { useActive } from "./prefs";
import { INFO, type InfoKey } from "./info-content";

/** بطاقاتُ تواصلِ الفروع — من له قناةٌ حقيقية وحده يظهر، ببياناته من الكتالوج */
function BranchContacts() {
  const { locale } = useActive();
  const t = T[locale];
  const reachable = BRANCHES.filter((b) => b.phone || b.whatsapp || b.mapUrl);

  if (!reachable.length) return null;

  return (
    <div className="contact-cards">
      {reachable.map((b) => (
        <div className="contact-card" key={b.id}>
          <h3>{branchNameIn(b, locale)}</h3>
          <p className="contact-city">{branchCityIn(b, locale)}</p>

          <div className="contact-links">
            {b.whatsapp && (
              <a
                className="btn"
                href={`https://wa.me/${b.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                {t.whatsapp}
              </a>
            )}
            {b.phone && (
              <a href={`tel:${b.phone.replace(/\s/g, "")}`} dir="ltr">
                {b.phone}
              </a>
            )}
            {b.mapUrl && (
              <a href={b.mapUrl} target="_blank" rel="noreferrer">
                {t.mapLink}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** إسنادُ صور المشاهد — كلُّها من ALL_SCENES: الموضعُ رابطًا للمصدر، والمصوّرُ ورخصتُه */
function SceneCredits() {
  const { locale } = useActive();

  return (
    <ul className="credits-list">
      {ALL_SCENES.map((s) => (
        <li key={s.image}>
          <a href={s.credit.source} target="_blank" rel="noreferrer">
            {scenePlace(s, locale)}
          </a>
          <span className="credits-by">
            {s.credit.by} · {s.credit.license}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * جسدُ الصفحة التعريفية — عميلٌ لأن لغتَه اختيارُ الزائر المحفوظ، لا وسمٌ
 * في الرابط، على نمط صفحة العطر. القشرةُ (page.tsx) تبقى على الخادم بوسومها
 * العربية، وهذا يعرض المحتوى بلغة الزائر.
 */
export function InfoView({ pageKey }: { pageKey: InfoKey }) {
  const { locale } = useActive();
  const t = T[locale];
  const page = INFO[locale][pageKey];

  return (
    <main id="main" className="section info">
      <Link href="/" className="back">
        {t.back}
      </Link>

      <header className="info-head">
        <h1>{page.title}</h1>
        {page.intro && <p className="info-intro">{page.intro}</p>}
      </header>

      {pageKey === "contact" && <BranchContacts />}

      {page.sections.map((sec, i) => (
        <section className="info-block" key={i}>
          {sec.heading && <h2>{sec.heading}</h2>}
          {sec.body.map((para, j) => (
            <p key={j}>{para}</p>
          ))}
        </section>
      ))}

      {pageKey === "credits" && <SceneCredits />}
    </main>
  );
}
