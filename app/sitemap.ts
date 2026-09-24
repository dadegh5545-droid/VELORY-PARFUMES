import type { MetadataRoute } from "next";
import { CATALOG } from "./catalog";
import { SITE_URL } from "./site-config";
import { LOCALES } from "./i18n";
import { absoluteLocaleUrl } from "./page-meta";

// sitemap.xml يُولَّد آليًّا من الكتالوج والصفحات الثابتة، فلا يُنسى رابطٌ
// جديدٌ إذا أُضيف عطرٌ أو صفحة. لا تُدرَج مساراتُ الإدارة ولا واجهاتُ البرمجة.

/** الصفحاتُ التعريفية الثابتة — مساراتُها ثابتةٌ لا تُشتقّ من بيانات */
const INFO_PATHS = [
  "/about",
  "/contact",
  "/delivery",
  "/returns",
  "/privacy",
  "/terms",
  "/faq",
  "/credits",
];

/** نسخُ الصفحة بلغاتها — تُذكر مع كلِّ رابطٍ كما تُذكر في وسوم hreflang،
 *  فيعرف محرّكُ البحث أنّ الثلاثَ ترجماتٌ لصفحةٍ واحدة لا صفحاتٍ متكرّرة. */
const languagesOf = (path: string) => {
  const map: Record<string, string> = {};
  for (const l of LOCALES) map[l] = absoluteLocaleUrl(path, l);
  return map;
};

/** مدخلٌ واحدٌ في الخريطة، بلغاته الثلاث */
const entry = (
  path: string,
  changeFrequency: "weekly" | "monthly",
  priority: number
): MetadataRoute.Sitemap[number] => ({
  url: `${SITE_URL}${path}`,
  changeFrequency,
  priority,
  alternates: { languages: languagesOf(path) },
});

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/", "weekly", 1),
    ...INFO_PATHS.map((p) => entry(p, "monthly", 0.5)),
    ...CATALOG.map((p) => entry(`/parfum/${p.id}`, "monthly", 0.7)),
  ];
}
