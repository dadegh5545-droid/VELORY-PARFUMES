import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import { BRANCHES } from "./catalog";
import { CartProvider } from "./cart";
import { SiteHeader } from "./site-header";
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
    <html lang="ar" dir="rtl" className={`${display.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <footer className="footer" id="contact">
            <span>© 2026 فالوري بارفوم</span>
            <span>{BRANCHES.map((b) => b.city).join(" · ")}</span>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
