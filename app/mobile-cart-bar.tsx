"use client";

import { formatPrice, getBranch, getPerfume } from "./catalog";
import { T } from "./i18n";
import { useCart } from "./cart";
import { useActive } from "./prefs";

// شريطُ سلةٍ ثابتٌ أسفل شاشة الجوال، يظهر حين تحمل سلّةُ الفرع قطعةً فأكثر:
// عددُ القطع، ومجموعُ هذا الفرع بعملته، وزرُّ إتمام الطلب. الضغطُ يفتح لوحةَ
// السلة حيث المراجعةُ ثم الإتمام على واتساب. لا يظهر على الحاسوب (CSS).
export function MobileCartBar() {
  const { itemsOf, countOf, setOpen } = useCart();
  const { branch: branchId, locale } = useActive();
  const t = T[locale];
  const branch = getBranch(branchId);
  const count = countOf(branchId);

  if (!branch || count === 0) return null;

  // مجموعُ المسعّرِ وحده — ما سعرُه «عند الطلب» لا يدخل المجموع.
  const rows = itemsOf(branchId);
  let sum = 0;
  let priced = 0;
  for (const r of rows) {
    const p = getPerfume(r.id);
    const price = p ? p.branches[branch.id]?.price : undefined;
    if (price) {
      sum += price * r.qty;
      priced += 1;
    }
  }

  return (
    <div className="mobile-cart-bar">
      <button
        type="button"
        className="mcb-summary"
        onClick={() => setOpen(true)}
        aria-label={t.navCart}
      >
        <span className="mcb-count" aria-hidden="true">
          {count}
        </span>
        <span className="mcb-total">
          {priced > 0 ? formatPrice(sum, branch, locale) : t.priceOnRequest}
        </span>
      </button>
      <button
        type="button"
        className="btn mcb-checkout"
        onClick={() => setOpen(true)}
      >
        {t.checkoutShort}
      </button>
      {/* واتساب الفرع أيقونةً دائريةً في يسار الشريط — بدل زرٍّ عائمٍ يغطّي
          البطاقات. يظهر ما دام للفرع رقم. */}
      {branch.whatsapp && (
        <a
          className="mcb-wa"
          href={`https://wa.me/${branch.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label={t.whatsapp}
        >
          <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.9 1 1-4.8-.2-.4C5.5 18.4 5 16.7 5 15 5 8.9 9.9 4 16 4s11 4.9 11 11-4.9 10.8-11 10.8zm6.1-8.1c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.1-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.8-1.9-1-2.6c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3z"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
