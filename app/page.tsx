"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { BRANCHES } from "./catalog";
import { BranchSection } from "./branch";

// الاتصال بـ AWS يبقى مهيّأً — جاهز لربط الكتالوج بموديل Perfume لاحقًا.
Amplify.configure(outputs);

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">دار عطور · فرعا الدوحة ونجامينا</p>
          <h1>
            فنُّ
            <em>العِطر</em>
          </h1>
          <p>
            خلاصاتٌ نادرة، تُمزج يدويًا في دفعاتٍ صغيرة. لكلِّ فرعٍ مجموعتُه
            وأسعارُه بعملة بلده.
          </p>
          <div className="hero-actions">
            {BRANCHES.map((b) => (
              <a key={b.id} href={`#${b.id}`} className="btn">
                {b.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* قسمٌ مستقلٌّ لكل فرع، بترتيب BRANCHES */}
      {BRANCHES.map((b) => (
        <BranchSection key={b.id} branch={b} />
      ))}

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
