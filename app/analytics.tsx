import Script from "next/script";
import { ANALYTICS_DOMAIN } from "./site-config";

// تحليلاتٌ خفيفةٌ خصوصيّة (Plausible) — تُحمَّل فقط إن ضُبط النطاق في البيئة.
// بلا كوكيز ولا جمعِ بياناتٍ شخصية، ولا سكربتَ أصلًا ما لم يُفعَّل، فلا
// يُثقَّل الزائرُ افتراضًا. اضبط NEXT_PUBLIC_ANALYTICS_DOMAIN لتفعيله.
export function Analytics() {
  if (!ANALYTICS_DOMAIN) return null;
  return (
    <Script
      defer
      data-domain={ANALYTICS_DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
