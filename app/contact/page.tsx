import type { Metadata } from "next";
import { InfoView } from "../info-view";
import { INFO } from "../info-content";
import { pageMetadata } from "../page-meta";

// الوسوم بالعربية (لغة المحتوى الأصل) كما في صفحة العطر؛ والعرضُ بلغة الزائر.
const KEY = "contact" as const;

// عنوانُ الصفحة ووصفُها هما نفسُهما ما يذهب إلى Open Graph وtwitter،
// وog:url يشير إلى /contact لا إلى الجذر.
export const metadata: Metadata = pageMetadata({
  path: `/${KEY}`,
  title: INFO.ar[KEY].title,
  description: INFO.ar[KEY].intro ?? INFO.ar[KEY].sections[0]?.body[0] ?? "",
});

export default function Page() {
  return <InfoView pageKey={KEY} />;
}
