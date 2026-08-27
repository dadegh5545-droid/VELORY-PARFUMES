import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

// robots.txt يُولَّد آليًّا. يُسمح بالزحف على المحتوى العامّ، ويُمنع عن
// أدوات الإدارة وواجهات البرمجة — وهي محجوبةٌ أصلًا في الإنتاج (تُعيد 404)،
// لكنّ المنعَ هنا يُبعد عنها الزواحفَ فلا تُفهرَس مساراتُها ولو ظهرت.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
