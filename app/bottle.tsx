"use client";

import { useCallback, useState } from "react";
import type { Perfume } from "./catalog";

/**
 * القارورة في البطاقة وفي صفحة التفاصيل.
 *
 * إن كان للعطر صورة منتجٍ عُرضت، وإلا رُسمت قارورةٌ بالـ CSS بلون العطر.
 * البديل المرسوم ليس زينة: به تبقى كل البطاقات متساوية المظهر
 * ولو لم يُصوَّر إلا بعض المنتجات، فلا تظهر الشبكة نصفَ فارغة.
 *
 * المسرحُ خلف العبوة سوادٌ متدرّج وإضاءةٌ ذهبية بلونها، وتحتها ظلٌّ
 * وانعكاسٌ خافت — لا صورةَ منظرٍ تنازعها. وقبل أن تصل الصورةُ يظهر هيكلٌ
 * ذهبيٌّ ناعم (skeleton) بدل الفراغ، فتتلاشى الصورةُ فوقه حين تجهز.
 */
export function Bottle({
  perfume,
  className = "",
}: {
  perfume: Perfume;
  className?: string;
}) {
  const classes = ["bottle", className].filter(Boolean).join(" ");
  const [loaded, setLoaded] = useState(false);

  // الصورةُ المخزَّنةُ مسبقًا قد تكتمل قبل ربط onLoad، فنفحص `complete`
  // عند التركيب كي لا يبقى الهيكلُ فوق صورةٍ حاضرة.
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  // الصورة تحمل وصفًا للقارئ الآلي، أما الرسمة فزخرفةٌ تُخفى عنه.
  if (perfume.image) {
    return (
      <div
        className={`${classes} has-photo`}
        style={{ ["--tint" as string]: perfume.tint }}
      >
        <div className="bottle-stage">
          {/* هيكلُ التحميل: وميضٌ ذهبيٌّ خافتٌ يُخفى فورَ جهوز الصورة */}
          {!loaded && <span className="bottle-skeleton" aria-hidden="true" />}
          <img
            ref={imgRef}
            className="bottle-photo"
            src={perfume.image}
            alt={`قارورة عطر ${perfume.name}`}
            loading="lazy"
            decoding="async"
            data-loaded={loaded ? "true" : "false"}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
          {/* الانعكاس نسخةٌ مقلوبةٌ تتلاشى سريعًا — أثرُ سطحٍ صقيل،
              لا صورةٌ ثانية. مخفيٌّ عن القارئ الآلي لأنه لا يضيف خبرًا. */}
          <img
            className="bottle-reflection"
            src={perfume.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={classes} style={{ ["--tint" as string]: perfume.tint }}>
      <div className="bottle-stage">
        <div className="bottle-glass" aria-hidden="true" />
      </div>
    </div>
  );
}
