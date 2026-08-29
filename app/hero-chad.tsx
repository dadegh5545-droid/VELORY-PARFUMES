"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { type Branch, perfumeName, slidesOf } from "./catalog";
import { T, trBrand } from "./i18n";
import type { Locale } from "./i18n";

// كل ٤٫٥ ثانية ينتقل السلايدر — ضمن ٤–٥ ثوانٍ المطلوبة، ووقتٌ يكفي لقراءة
// اسم العطر قبل أن يخلفه غيرُه.
const INTERVAL = 4500;

/**
 * واجهةُ فرع تشاد — سلايدرُ عطورٍ حقيقية في صدر الصفحة الأولى.
 *
 * ثلاثةٌ إلى خمسةٌ من عطور الفرع بصورها الأصلية (لا تُقصّ العبوة)، تنتقل
 * تلاشيًا ذهبيًّا هادئًا كل ٤٫٥ ثانية على هالةٍ ذهبية. يتوقّف عند تفاعل
 * الزائر (مرور، لمس، تركيز) وعند إخفاء التبويب، ويحترم `reduced-motion`
 * فلا يتحرّك من تلقائه، وتبقى النقاطُ للتنقّل باليد.
 *
 * وقطرُ باقيةٌ على الواجهة العامّة: عنوانُها لا يذكر بلدًا، وشريطُ الوعود
 * هنا يعِد بتوصيلٍ داخل تشاد وطلبٍ على واتسابها — ولا واتسابَ لقطرَ بعد.
 */
export function ChadHero({ branch, locale }: { branch: Branch; locale: Locale }) {
  const h = T[locale].heroChad;
  // عطورُ السلايدر بشروطها: معروضةٌ في الفرع ولها صورة. قد تكون واحدةً
  // (يسقط إلى `featured`) أو لا شيءَ (فتبقى الواجهةُ عنوانًا ووعدًا وزرّ تسوّق).
  const slides = slidesOf(branch);
  const n = slides.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (to: number) => {
      if (n === 0) return;
      setIndex(((to % n) + n) % n);
    },
    [n]
  );

  useEffect(() => {
    reduce.current =
      typeof window !== "undefined" && !!window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
  }, []);

  // التشغيلُ التلقائي — يقف عند التفاعل، وعند سكون الحركة، ولعطرٍ واحد.
  useEffect(() => {
    if (n <= 1 || paused || reduce.current) return;
    const id = window.setInterval(() => setIndex((c) => (c + 1) % n), INTERVAL);
    return () => window.clearInterval(id);
  }, [n, paused]);

  // إخفاءُ التبويب يوقف الحركة، فلا تدور الصورُ خلف ظهر الزائر.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    // اتجاهٌ بصريٌّ ثابت للسلايدر: السحبُ لليسار يتقدّم، ولليمين يرجع.
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    setPaused(false);
  };

  // بطلُ الأزرار هو العطرُ المعروض الآن — فزرُّ «العطر المميّز» يتبع السلايدر.
  const star = n > 0 ? slides[index] : undefined;

  return (
    <section className="hero-chad">
      <div className="hero-chad-inner">
        <h1 className="hero-chad-title">{h.title}</h1>
        <p className="hero-chad-text">{h.text}</p>

        {n > 0 && (
          <div
            className="hero-chad-stage"
            role="group"
            aria-roledescription="carousel"
            aria-label={h.title}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* الهالةُ والنقشُ زخرفةٌ ثابتةٌ خلف السلايدر، تُخفى عن القارئ الآلي */}
            <span className="hero-chad-halo" aria-hidden="true" />
            <span className="hero-chad-naqsh" aria-hidden="true" />

            <div className="hero-carousel">
              {slides.map((p, idx) => (
                <div
                  key={p.id}
                  className={idx === index ? "hero-slide is-active" : "hero-slide"}
                  aria-hidden={idx === index ? undefined : true}
                >
                  {/* الصورةُ الأصلية كاملةً بلا قص (object-fit: contain في CSS) */}
                  {/* كلُّ شرائح السلايدر تُحمَّل مسبقًا (لا تأجيل): خمسُ صورٍ
                      فوق الطيّة، فلا يظهر إطارٌ غيرُ محمّلٍ عند الانتقال. */}
                  <img
                    className="hero-chad-photo"
                    src={p.image}
                    alt={perfumeName(p, locale)}
                    fetchPriority={idx === 0 ? "high" : undefined}
                    decoding="async"
                    draggable={false}
                  />
                  <p className="hero-chad-name">
                    {perfumeName(p, locale)}
                    {p.brand && <span>{trBrand(p.brand, locale)}</span>}
                  </p>
                </div>
              ))}
            </div>

            {n > 1 && (
              <div className="hero-dots" role="tablist" aria-label={h.title}>
                {slides.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === index}
                    aria-label={perfumeName(p, locale)}
                    className={idx === index ? "hero-dot is-active" : "hero-dot"}
                    onClick={() => go(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="hero-chad-actions">
          {/* التسوّقُ نزولٌ إلى قسم الفرع في الصفحة نفسِها، لا انتقالُ صفحة */}
          <a href={`#${branch.id}`} className="btn btn-primary">
            {h.shop}
          </a>
          {star && (
            <Link href={`/parfum/${star.id}`} className="btn">
              {h.featured}
            </Link>
          )}
        </div>

        <ul className="hero-chad-strip">
          {h.strip.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
