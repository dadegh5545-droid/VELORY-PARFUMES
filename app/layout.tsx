import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import { CartProvider } from "./cart";
import { CartPanel } from "./cart-panel";
import { PrefsProvider, HtmlLang } from "./prefs";
import { Welcome } from "./welcome";
import { SiteFooter, SiteHeader } from "./site-header";
import { Analytics } from "./analytics";
import { ToastProvider } from "./toast";
import { QuickViewProvider } from "./quick-view";
import { MobileCartBar } from "./mobile-cart-bar";
import { WhatsAppFab } from "./whatsapp-fab";
import {
  LocalBusinessJsonLd,
  OrganizationJsonLd,
} from "./structured-data";
import { SITE_NAME, SITE_NAME_AR, SITE_TITLE, SITE_URL } from "./site-config";
import { homeMetadata } from "./page-meta";
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

// وسومُ التخطيط: ما يشترك فيه الموقعُ كلُّه (الأصلُ والقالبُ والاسم)، ثم
// وسومُ الصفحة الأولى إذ هي صاحبةُ هذا التخطيط مباشرةً.
//
// أمّا canonical وog:url وog:title فتملكها كلُّ صفحةٍ لنفسها عبر
// `pageMetadata` — وكانت هنا وحدها فورثتها الصفحاتُ الثابتةُ كلُّها،
// فأشار og:url في /about و/faq و/terms إلى الجذر.
export const metadata: Metadata = {
  // metadataBase أصلُ الروابط المطلقة في canonical وOpen Graph: بدونه
  // تبقى الصورُ والروابطُ نسبيةً فلا تُقرأ في معاينات المشاركة.
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  ...homeMetadata(),
  // بعدَ النشر لا قبلَه: `homeMetadata` تُرجع عنوانًا نصيًّا للصفحة الأولى،
  // ولو بقي لضاع `template` فلم ترث الصفحاتُ الفرعيةُ ذيلَ «| فالوري».
  title: {
    default: SITE_TITLE,
    // يُدمج مع عنوان كلِّ صفحةٍ فرعية: «اسمُ العطر | فالوري».
    template: `%s | ${SITE_NAME_AR}`,
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
              <QuickViewProvider>
                <SiteHeader />
                {children}
                <SiteFooter />
                {/* اللوحةُ آخرَ الشجرة كي تعلو كلَّ شيءٍ بلا مزايدةٍ في z-index */}
                <CartPanel />
                {/* شريطُ السلة الثابت — للجوال وحده (CSS) */}
                <MobileCartBar />
                {/* واتساب الفرع على كلِّ صفحة — لا في شريط السلة وحده */}
                <WhatsAppFab />
              </QuickViewProvider>
            </ToastProvider>
          </CartProvider>
          <Welcome />
        </PrefsProvider>
        <Analytics />
      </body>
    </html>
  );
}
