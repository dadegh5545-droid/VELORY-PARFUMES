// بناءُ وسومِ صفحةٍ واحدةٍ — مصدرٌ واحدٌ تقرأ منه كلُّ صفحة.
//
// قبلَه كانت كلُّ صفحةٍ ثابتةٍ ترث Open Graph من التخطيط، فيشير `og:url`
// في /about و/faq و/terms إلى الصفحة الأولى، وينطق `og:title` باسم الموقع
// لا باسم الصفحة. فكانت مشاركةُ أيِّ رابطٍ تُظهر بطاقةَ الصفحة الأولى.
//
// هنا تُبنى الوسومُ من عنوان الصفحة ووصفها هي، ويشير `og:url` وcanonical
// إلى مسارها نفسه. والعنوانُ المطلق أصلُه SITE_URL وحده، فنقلُ الموقع إلى
// نطاقٍ خاصٍّ تغييرُ متغيّرِ بيئةٍ واحد لا تفتيشٌ في الملفّات.

import type { Metadata } from "next";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_AR,
  SITE_TITLE,
  absoluteUrl,
} from "./site-config";
import { LOCALES, OG_LOCALE, type Locale } from "./i18n";

/** لغةُ المحتوى الأصل — وهي المعروضة قبل أن يختار الزائر */
export const DEFAULT_LOCALE: Locale = "ar";

/** رابطُ الصفحة بلغةٍ بعينها. العربيةُ هي الرابطُ المجرّد (لا `?lang=`)
 *  كي تبقى الروابطُ المنشورةُ سابقًا كما هي، وتُضاف اللغاتُ الأخرى كمعامل. */
export const localeUrl = (path: string, locale: Locale) =>
  locale === DEFAULT_LOCALE ? path : `${path}?lang=${locale}`;

/** الرابطُ المطلق لصفحةٍ بلغة — لخريطة الموقع */
export const absoluteLocaleUrl = (path: string, locale: Locale) =>
  absoluteUrl(localeUrl(path, locale));

/** جدولُ hreflang لصفحةٍ: نسخةٌ لكلِّ لغة، وx-default إلى العربية.
 *  يُخبر محرّكَ البحث أنّ الصفحاتِ الثلاثَ ترجماتٌ لا نسخٌ مكرّرة. */
const languagesOf = (path: string) => {
  const map: Record<string, string> = {};
  for (const l of LOCALES) map[l] = localeUrl(path, l);
  map["x-default"] = path;
  return map;
};

type PageMetaInput = {
  /** مسارُ الصفحة من الجذر، مثل "/about" — و"/" للصفحة الأولى */
  path: string;
  /** عنوانُ الصفحة كما يظهر في التبويب (بلا اسم الدار — القالبُ يضيفه) */
  title: string;
  /** وصفُ الصفحة — هو نفسُه يذهب إلى og:description وtwitter:description */
  description: string;
  /** صورةُ المشاركة إن كانت للصفحة صورتُها (صفحةُ عطرٍ مثلًا) */
  image?: string;
  /** العنوانُ الكاملُ في بطاقة المشاركة — للصفحة الأولى وحدها إذ لا قالبَ لها */
  absoluteTitle?: string;
};

/**
 * وسومُ صفحةٍ كاملةً: canonical وhreflang وOpen Graph وtwitter.
 *
 * `og:title` و`twitter:title` يأخذان عنوانَ الصفحة نفسَه مذيَّلًا باسم
 * الدار — لا عنوانَ الموقع العامّ — فتُقرأ البطاقةُ وحدها بلا فتحِ الرابط.
 */
export function pageMetadata({
  path,
  title,
  description,
  image,
  absoluteTitle,
}: PageMetaInput): Metadata {
  const shareTitle = absoluteTitle ?? `${title} | ${SITE_NAME_AR}`;
  const images = [
    { url: image ?? OG_IMAGE, width: 1200, height: 630, alt: shareTitle },
  ];

  return {
    title,
    description,
    alternates: {
      // كلُّ صفحةٍ تشير إلى نفسها — لا إلى الجذر كما كان.
      canonical: path,
      languages: languagesOf(path),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url: path,
      images,
      locale: OG_LOCALE[DEFAULT_LOCALE],
      // النسخُ الأخرى من الصفحة نفسِها — وسمُ Open Graph المخصّص لهذا،
      // فلا تُعدّ الصفحاتُ الثلاثُ ثلاثَ صفحاتٍ لا صلةَ بينها.
      alternateLocale: LOCALES.filter((l) => l !== DEFAULT_LOCALE).map(
        (l) => OG_LOCALE[l]
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}

/** وسومُ الصفحة الأولى — لها عنوانُها المطلق إذ لا يُضاف إليها القالب */
export const homeMetadata = (): Metadata =>
  pageMetadata({
    path: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    absoluteTitle: SITE_TITLE,
  });
