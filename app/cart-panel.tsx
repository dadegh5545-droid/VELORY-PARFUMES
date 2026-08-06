"use client";

import { useEffect, useRef } from "react";
import {
  branchNameIn,
  getBranch,
  getPerfume,
  perfumeName,
  priceIn,
  type Branch,
} from "./catalog";
import { T } from "./i18n";
import { useCart, type CartItem } from "./cart";
import { useActive } from "./prefs";
import type { Locale } from "./i18n";

/** كتلةُ الطلب بلغةٍ واحدة: تحيّةٌ، ثم الفرع، ثم سطرٌ لكل عطر */
function orderBlock(branch: Branch, rows: CartItem[], locale: Locale) {
  const t = T[locale];
  const lines = rows.map((r) => {
    const p = getPerfume(r.id);
    if (!p) return "";
    const qty = r.qty > 1 ? ` ×${r.qty}` : "";
    return `• ${perfumeName(p, locale)}${qty} — ${priceIn(p, branch, locale)}`;
  });

  return [
    t.orderHello,
    `${t.orderBranch}: ${branchNameIn(branch, locale)}`,
    "",
    ...lines.filter(Boolean),
  ].join("\n");
}

/**
 * نصُّ الطلب كما يصل تاجرَ الفرع على واتساب.
 *
 * سطرٌ لكل عطر باسمه وكمّيته وسعره في هذا الفرع — لا في غيره: الفرعُ
 * هو ما يحدّد السعر والعملة، ورسالةٌ بلا فرعٍ رسالةٌ غامضة.
 *
 * وتُذيَّل بنسخةٍ فرنسية حين لا تكون الفرنسيةُ لغةَ الزائر: نجامينا
 * لسانُها فرنسي، فمن يستلم الطلبَ أو يناوله زميلَه يقرؤه بلا ترجمة.
 */
function orderText(branch: Branch, rows: CartItem[], locale: Locale) {
  const blocks = [orderBlock(branch, rows, locale)];
  if (locale !== "fr") blocks.push(orderBlock(branch, rows, "fr"));
  return blocks.join("\n\n— — —\n\n");
}

/**
 * لوحةُ السلة — تنزلق من جهة البداية وتُغلق بـ Escape أو بالنقر خارجها.
 *
 * تعرض **سلّةَ الفرع الذي يقف فيه الزائر وحدها**: من انتقل من نجامينا
 * إلى الدوحة لا تنتقل عطورُه معه، وتبقى سلّتُه هناك كما تركها حتى يعود.
 */
export function CartPanel() {
  const { itemsOf, drop, clear, open, setOpen } = useCart();
  const { branch: activeId, locale } = useActive();
  const t = T[locale];
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape يغلق، والتركيز ينتقل إلى اللوحة عند فتحها فيبلغها قارئُ الشاشة
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  // فرعُ الزائر وحده: رقمُه ورسالتُه وأسعارُه — فلا يذهب طلبُ نجامينا
  // إلى الدوحة ولا العكس.
  const branch = getBranch(activeId);
  const rows = itemsOf(activeId);

  return (
    <div className="cart-veil" onClick={() => setOpen(false)}>
      <div
        className="cart-panel"
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t.navCart}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-head">
          <h2>{t.navCart}</h2>
          <button
            type="button"
            className="cart-close"
            onClick={() => setOpen(false)}
            aria-label={t.close}
          >
            ✕
          </button>
        </div>

        {!branch || rows.length === 0 ? (
          <p className="cart-empty">{t.cartEmpty}</p>
        ) : (
          <>
            <section className="cart-group">
              <h3>{branchNameIn(branch, locale)}</h3>

              <ul className="cart-rows">
                {rows.map((r) => {
                  const p = getPerfume(r.id);
                  if (!p) return null;
                  return (
                    <li key={`${r.branch}-${r.id}`}>
                      <span className="cart-name">
                        {perfumeName(p, locale)}
                        {r.qty > 1 && (
                          <span className="cart-qty" dir="ltr">
                            ×{r.qty}
                          </span>
                        )}
                      </span>
                      {/* السعرُ في هذا الفرع بعملته — لا سعرَ مجرّدٌ للعطر */}
                      <span className="cart-price">
                        {priceIn(p, branch, locale)}
                      </span>
                      <button
                        type="button"
                        className="cart-drop"
                        onClick={() => drop(r.id, r.branch)}
                        aria-label={`${t.remove} ${perfumeName(p, locale)}`}
                      >
                        −
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* زرُّ الإتمام لا يظهر لفرعٍ بلا رقم: زرٌّ لا يفعل شيئًا
                  أسوأ من غيابه، والرقمُ يُملأ في `catalog.ts`. */}
              {branch.whatsapp ? (
                <a
                  className="btn cart-send"
                  href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
                    orderText(branch, rows, locale)
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.checkoutWhatsapp}
                </a>
              ) : (
                <p className="cart-note">{t.branchNoContact}</p>
              )}
            </section>

            {/* التفريغُ لسلّة هذا الفرع وحدها */}
            <button
              type="button"
              className="cart-clear"
              onClick={() => clear(activeId)}
            >
              {t.cartClear}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

