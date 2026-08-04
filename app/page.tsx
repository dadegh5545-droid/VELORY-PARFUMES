"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { branchCity, getBranch } from "./catalog";
import { T } from "./i18n";
import { useActive } from "./prefs";
import { BranchSection } from "./branch";

// الاتصال بـ AWS يبقى مهيّأً — جاهز لربط الكتالوج بموديل Perfume لاحقًا.
Amplify.configure(outputs);

export default function Home() {
  // بعد الترحيب يرى الزائر فرعَه وحده — لا يُطالَع بمجموعةٍ لا يشتري منها.
  const { branch, locale } = useActive();
  const t = T[locale];
  const active = getBranch(branch);

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">
            {t.heroEyebrow}
            {active && ` · ${branchCity(active, locale)}`}
          </p>
          <h1>
            {t.heroTitle.lead}
            <em>{t.heroTitle.em}</em>
          </h1>
          <p className="hero-text">{t.heroText}</p>
          <div className="hero-actions">
            <a href={`#${branch}`} className="btn btn-primary">
              {t.heroCta}
            </a>
          </div>
        </div>
        <div className="hero-scroll" aria-hidden="true" />
      </section>

      {active && <BranchSection branch={active} />}

      <section className="quote" id="maison">
        <blockquote>
          {t.quote[0]}
          <br />
          {t.quote[1]}
          <cite>{t.quoteCite}</cite>
        </blockquote>
      </section>
    </main>
  );
}
