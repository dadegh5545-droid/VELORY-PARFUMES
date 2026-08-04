import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import { CartProvider } from "./cart";
import { PrefsProvider, HtmlLang } from "./prefs";
import { Welcome } from "./welcome";
import { SiteFooter, SiteHeader } from "./site-header";
import "./app.css";

// أميري: خط نسخي كلاسيكي للعناوين — يقابل رونق Cormorant في اللاتينية.
const display = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

// تجوّال: خط هندسي نظيف للنصوص، يوازن كلاسيكية العناوين.
const sans = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "فالوري | VALORY PARFUMES — فنُّ العِطر",
  description:
    "دار فالوري للعطور الفاخرة، بفرعَي الدوحة ونجامينا. خلاصات نادرة تُمزج يدويًا في دفعات صغيرة.",
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
        <PrefsProvider>
          <HtmlLang />
          <CartProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </CartProvider>
          <Welcome />
        </PrefsProvider>
      </body>
    </html>
  );
}
