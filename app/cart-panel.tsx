"use client";

import { useEffect, useRef } from "react";
import {
  branchNameIn,
  formatPrice,
  getBranch,
  getPerfume,
  perfumeName,
  priceIn,
  type Branch,
} from "./catalog";
import { T } from "./i18n";
import { useCart, type CartItem } from "./cart";
import { useActive } from "./prefs";
import { SITE_URL } from "./site-config";
import type { Locale } from "./i18n";

/**
 * مجموعُ الطلب في هذا الفرع.
 *
 * ما لم يُسعَّر بعدُ لا يدخل المجموع ولا يُفترض له سعر — بل يُعدّ، ليُقال
 * للزبون صراحةً إن بعض أصنافه سعرُها عند الطلب. مجموعٌ يبتلع المجهولَ
 * صامتًا أسوأ من غياب المجموع.
 */
function orderTotals(branch: Branch, rows: CartItem[]) {
  let sum = 0;
  let priced = 0;
  let unpriced = 0;

  for (const r of rows) {
    const p = getPerfume(r.id);
    if (!p) continue;
    const price = p.branches[branch.id]?.price;
    if (price) {
      sum += price * r.qty;
      priced += 1;
    } else {
      unpriced += 1;
    }
  }

  return { sum, priced, unpriced };
}

/** كتلةُ الطلب بلغةٍ واحدة: تحيّةٌ، ثم الفرع، ثم سطرٌ لكل عطر، ثم المجموع */
function orderBlock(branch: Branch, rows: CartItem[], locale: Locale) {
  const t = T[locale];
  const lines = rows.map((r) => {
    const p = getPerfume(r.id);
    if (!p) return "";
    const qty = r.qty > 1 ? ` ×${r.qty}` : "";
    const unit = p.branches[branch.id]?.price;

    // مع الكمّية يُكتب إجماليُّ السطر لا سعرُ الواحدة، وتُبيَّن الوحدةُ
    // بين قوسين: «12,500» بجانب «×2» تُقرأ خطأً على أنها ثمنُ الاثنين.
    const money =
      unit && r.qty > 1
        ? `${formatPrice(unit * r.qty, branch, locale)} (${formatPrice(
            unit,
            branch,
            locale
          )} × ${r.qty})`
        : priceIn(p, branch, locale);

    return `• ${perfumeName(p, locale)}${qty} — ${money}`;
  });

  const { sum, priced, unpriced } = orderTotals(branch, rows);
  const pieces = rows.reduce((n, r) => n + r.qty, 0);
  const tail: string[] = ["", t.orderItems(pieces)];

  if (priced > 0) {
    tail.push(`${t.orderTotal}: ${formatPrice(sum, branch, locale)}`);
    if (unpriced > 0) tail.push(t.orderSomeOnRequest);
  } else {
    // لا صنفَ مسعَّرًا بعد: يُقال ذلك بدل أن يُكتب «المجموع: 0»
    tail.push(t.orderAllOnRequest);
  }

  return [
    t.orderHello,
    `${t.orderBranch}: ${branchNameIn(branch, locale)}`,
    "",
    ...lines.filter(Boolean),
    ...tail,
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
 *
 * وتنتهي بطلبِ بيانات التوصيل داخل واتساب — لا حسابَ يُنشأ ولا نموذجَ
 * يُملأ في الموقع: الزبونُ يكتب اسمَه ومنطقتَه وعنوانَه في المحادثة نفسِها.
 */
function orderText(branch: Branch, rows: CartItem[], locale: Locale) {
  const t = T[locale];
  const blocks = [orderBlock(branch, rows, locale)];
  if (locale !== "fr") blocks.push(orderBlock(branch, rows, "fr"));

  const ask = [
    t.orderAsk,
    `• ${t.orderName}:`,
    `• ${t.orderArea}:`,
    `• ${t.orderAddress}:`,
  ].join("\n");

  // مصدرُ الطلب مرّةً واحدةً في الذيل: يعرف التاجرُ أنه من الموقع، ورابطُه
  // في متناوله. لا يُكرَّر في الكتلة الفرنسية لأنه رابطٌ لا نصَّ يُترجَم.
  const via = `${t.orderVia}: ${SITE_URL}`;

  return [...blocks, ask, via].join("\n\n— — —\n\n");
}

/**
 * لوحةُ السلة — تنزلق من جهة البداية وتُغلق بـ Escape أو بالنقر خارجها.
 *
 * تعرض **سلّةَ الفرع الذي يقف فيه الزائر وحدها**: من انتقل من نجامينا
 * إلى الدوحة لا تنتقل عطورُه معه، وتبقى سلّتُه هناك كما تركها حتى يعود.
 */
export function CartPanel() {
  const { itemsOf, add, drop, remove, clear, open, setOpen } = useCart();
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
                  const name = perfumeName(p, locale);
                  return (
                    <li key={`${r.branch}-${r.id}`}>
                      <div className="cart-line">
                        <span className="cart-name">{name}</span>
                        {/* السعرُ في هذا الفرع بعملته — لا سعرَ مجرّدٌ للعطر */}
                        <span className="cart-price">
                          {priceIn(p, branch, locale)}
                        </span>
                      </div>

                      <div className="cart-controls">
                        {/* مِعدادُ الكمّية: أنقص · العدد · زد — كلٌّ بوصفٍ
                            للقارئ الآلي يذكر اسمَ العطر، والعددُ يُعلَن حيًّا */}
                        <div className="qty" role="group" aria-label={name}>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => drop(r.id, r.branch)}
                            aria-label={`${t.qtyDecrease} — ${name}`}
                          >
                            −
                          </button>
                          <span className="qty-num" aria-live="polite" dir="ltr">
                            {r.qty}
                          </span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => add(r.id, r.branch)}
                            aria-label={`${t.qtyIncrease} — ${name}`}
                          >
                            +
                          </button>
                        </div>

                        {/* حذفُ السطر كلِّه — لا إنقاصًا واحدًا واحدًا */}
                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => remove(r.id, r.branch)}
                          aria-label={`${t.removeItem} — ${name}`}
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* المجموعُ يُرى قبل الإرسال لا بعده: ما يذهب في الرسالة
                  هو نفسُه ما تقرؤه العين هنا. */}
              {(() => {
                const { sum, priced, unpriced } = orderTotals(branch, rows);
                if (priced === 0) {
                  return <p className="cart-note">{t.orderAllOnRequest}</p>;
                }
                return (
                  <div className="cart-total">
                    <span>{t.orderTotal}</span>
                    <strong>{formatPrice(sum, branch, locale)}</strong>
                    {unpriced > 0 && (
                      <small>{t.orderSomeOnRequest}</small>
                    )}
                  </div>
                );
              })()}

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

