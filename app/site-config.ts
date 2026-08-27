// إعداداتُ الموقع العامّة — عنوانُه ووسائطُه، تُقرأ من متغيّرات البيئة.
//
// العنوان أصلُ الوسوم كلِّها (canonical وOpen Graph وsitemap)، فيُقرأ من
// NEXT_PUBLIC_SITE_URL وقتَ البناء. وما لم يُضبط يسقط إلى localhost — عنوانٌ
// صالحٌ للتطوير لا يكسر شيئًا، ويُستبدل في الإنتاج من .env. راجع .env.example.

/** عنوانُ الموقع بلا شرطةٍ مائلةٍ في آخره — أساسُ كلِّ رابطٍ مطلق */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/** اسمُ الدار باللاتينية — كما يُكتب في العلامة والوسوم */
export const SITE_NAME = "VALORY PARFUMES";

/** اسمُ الدار بالعربية — لصفحاتٍ ووسومٍ عربية */
export const SITE_NAME_AR = "فالوري بارفوم";

/** رابطٌ مطلقٌ من مسارٍ نسبيّ — يجمع العنوانَ بالمسار بلا شرطتين */
export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** نطاقُ التحليلات (Plausible) إن فُعِّل — بلا قيمةٍ لا يُحمَّل أيُّ سكربت */
export const ANALYTICS_DOMAIN = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || "";
