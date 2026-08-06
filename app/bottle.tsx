import type { Perfume, Scene } from "./catalog";

/**
 * القارورة في البطاقة وفي صفحة التفاصيل.
 *
 * إن كان للعطر صورة منتجٍ عُرضت، وإلا رُسمت قارورةٌ بالـ CSS بلون العطر.
 * البديل المرسوم ليس زينة: به تبقى كل البطاقات متساوية المظهر
 * ولو لم يُصوَّر إلا بعض المنتجات، فلا تظهر الشبكة نصفَ فارغة.
 *
 * وخلف المنتج مشهدٌ من بلد فرعه حين يُمرَّر: نسخةُ البطاقة الطولية (4:5)
 * لا العريضة، ويعلوها حجابٌ داكن يبقي العبوةَ هي المقروءة أوّلًا.
 */
export function Bottle({
  perfume,
  scene,
  className = "",
}: {
  perfume: Perfume;
  scene?: Scene;
  className?: string;
}) {
  const classes = ["bottle", className, scene ? "has-scene-bg" : ""]
    .filter(Boolean)
    .join(" ");

  // المشهدُ زخرفةٌ خالصة خلف المنتج: اسمُ موضعه مكتوبٌ في مشهد القسم
  // وصفحةِ العطر، فتكرارُه في كل بطاقةٍ ضجيجٌ على القارئ الآلي.
  const backdrop = scene ? (
    <img className="bottle-scene" src={scene.card} alt="" aria-hidden="true" loading="lazy" />
  ) : null;

  // الصورة تحمل وصفًا للقارئ الآلي، أما الرسمة فزخرفةٌ تُخفى عنه.
  if (perfume.image) {
    return (
      <div
        className={`${classes} has-photo`}
        style={{ ["--tint" as string]: perfume.tint }}
      >
        {backdrop}
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
    <div className={classes} style={{ ["--tint" as string]: perfume.tint }}>
      {backdrop}
      <div className="bottle-glass" aria-hidden="true" />
    </div>
  );
}
