import type { Perfume } from "./catalog";

/**
 * القارورة في البطاقة وفي صفحة التفاصيل.
 *
 * إن كان للعطر صورة منتجٍ عُرضت، وإلا رُسمت قارورةٌ بالـ CSS بلون العطر.
 * البديل المرسوم ليس زينة: به تبقى كل البطاقات متساوية المظهر
 * ولو لم يُصوَّر إلا بعض المنتجات، فلا تظهر الشبكة نصفَ فارغة.
 *
 * المسرحُ خلف العبوة سوادٌ متدرّج وإضاءةٌ ذهبية بلونها، وتحتها ظلٌّ
 * وانعكاسٌ خافت — لا صورةَ منظرٍ تنازعها.
 */
export function Bottle({
  perfume,
  className = "",
}: {
  perfume: Perfume;
  className?: string;
}) {
  const classes = ["bottle", className].filter(Boolean).join(" ");

  // الصورة تحمل وصفًا للقارئ الآلي، أما الرسمة فزخرفةٌ تُخفى عنه.
  if (perfume.image) {
    return (
      <div
        className={`${classes} has-photo`}
        style={{ ["--tint" as string]: perfume.tint }}
      >
        <div className="bottle-stage">
          <img
            className="bottle-photo"
            src={perfume.image}
            alt={`قارورة عطر ${perfume.name}`}
            loading="lazy"
          />
          {/* الانعكاس نسخةٌ مقلوبةٌ تتلاشى سريعًا — أثرُ سطحٍ صقيل،
              لا صورةٌ ثانية. مخفيٌّ عن القارئ الآلي لأنه لا يضيف خبرًا. */}
          <img
            className="bottle-reflection"
            src={perfume.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
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
