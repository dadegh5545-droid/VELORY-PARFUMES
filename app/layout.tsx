import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import { CartProvider } from "./cart";
import { CartPanel } from "./cart-panel";
import { PrefsProvider, HtmlLang } from "./prefs";
import { Welcome } from "./welcome";
import { SiteFooter, SiteHeader } from "./site-header";
import { Analytics } from "./analytics";
import { ToastProvider } from "./toast";
import { MobileCartBar } from "./mobile-cart-bar";
import {
  LocalBusinessJsonLd,
  OrganizationJsonLd,
} from "./structured-data";
import { SITE_NAME, SITE_URL } from "./site-config";
import "./app.css";

// أميري: خط نسخي كلاسيكي للعناوين — يقابل رونق Cormorant في اللاتينية.
// display: "swap" كي يظهر النصُّ بخطٍّ بديلٍ فورًا ولا يبقى غير مرئيّ
// حتى يصل الخطّ — أسرعُ ظهورًا للمحتوى، وهو ما يقيسه محرّك الأداء.
const display = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

// تجوّال: خط هندسي نظيف للنصوص، يوازن كلاسيكية العناوين.
const sans = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const description =
  "دار فالوري للعطور الفاخرة، بفرعَي الدوحة ونجامينا. خلاصات نادرة تُمزج يدويًا في دفعات صغيرة.";

export const metadata: Metadata = {
  // metadataBase أصلُ الروابط المطلقة في canonical وOpen Graph: بدونه
  // تبقى الصورُ والروابطُ نسبيةً فلا تُقرأ في معاينات المشاركة.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "فالوري | VALORY PARFUMES — فنُّ العِطر",
    // يُدمج مع عنوان كلِّ صفحةٍ فرعية: «اسمُ العطر | فالوري».
    template: "%s | فالوري",
  },
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "فالوري | VALORY PARFUMES — فنُّ العِطر",
    description,
    url: "/",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "فالوري | VALORY PARFUMES — فنُّ العِطر",
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // العربية هي حال الصفحة قبل أن يختار الزائر، ثم يزامنها HtmlLang.
    <html lang="ar" dir="rtl" className={`${display.variable} ${sans.variable}`}>
      <body>
        {/* رابطُ التخطّي: أوّلُ ما يبلغه Tab، يقفز إلى المحتوى فلا يُجبَر
            مستخدمُ لوحة المفاتيح على المرور بالترويسة في كل صفحة. */}
        <a href="#main" className="skip-link">
          تخطَّ إلى المحتوى
        </a>
        {/* بياناتٌ منظَّمةٌ للدار ومحلّاتها — تُقرأ من مصدر الحقيقة وحده */}
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
        <PrefsProvider>
          <HtmlLang />
          <CartProvider>
            <ToastProvider>
              <SiteHeader />
              {children}
              <SiteFooter />
              {/* اللوحةُ آخرَ الشجرة كي تعلو كلَّ شيءٍ بلا مزايدةٍ في z-index */}
              <CartPanel />
              {/* شريطُ السلة الثابت — للجوال وحده (CSS)، وفيه أيقونةُ واتساب */}
              <MobileCartBar />
            </ToastProvider>
          </CartProvider>
          <Welcome />
        </PrefsProvider>
        <Analytics />
      </body>
    </html>
  );
}
