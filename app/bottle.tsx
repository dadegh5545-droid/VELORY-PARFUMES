import type { Perfume } from "./catalog";

/**
 * القارورة في البطاقة وفي صفحة التفاصيل.
 *
 * إن كان للعطر صورة منتجٍ عُرضت، وإلا رُسمت قارورةٌ بالـ CSS بلون العطر.
 * البديل المرسوم ليس زينة: به تبقى كل البطاقات متساوية المظهر
 * ولو لم يُصوَّر إلا بعض المنتجات، فلا تظهر الشبكة نصفَ فارغة.
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
        <img
          className="bottle-photo"
          src={perfume.image}
          alt={`قارورة عطر ${perfume.name}`}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={classes}
      style={{ ["--tint" as string]: perfume.tint }}
      aria-hidden="true"
    >
      <div className="bottle-glass" />
    </div>
  );
}
