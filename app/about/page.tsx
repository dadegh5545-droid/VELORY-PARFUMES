import type { Metadata } from "next";
import { InfoView } from "../info-view";
import { INFO } from "../info-content";

// الوسوم بالعربية (لغة المحتوى الأصل) كما في صفحة العطر؛ والعرضُ بلغة الزائر.
const KEY = "about" as const;

export const metadata: Metadata = {
  title: INFO.ar[KEY].title,
  description: INFO.ar[KEY].intro ?? INFO.ar[KEY].sections[0]?.body[0],
  alternates: { canonical: `/${KEY}` },
};

export default function Page() {
  return <InfoView pageKey={KEY} />;
}
