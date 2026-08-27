import type { MetadataRoute } from "next";
import { CATALOG } from "./catalog";
import { SITE_URL } from "./site-config";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
  ];

  const info: MetadataRoute.Sitemap = INFO_PATHS.map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const perfumes: MetadataRoute.Sitemap = CATALOG.map((p) => ({
    url: `${SITE_URL}/parfum/${p.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...home, ...info, ...perfumes];
}
