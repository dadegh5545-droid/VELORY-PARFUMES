"use client";

import { useEffect, useRef, useState } from "react";
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

/** بياناتُ التوصيل التي يملؤها الزبون في النموذج الخفيف — كلُّها اختيارية */
export type OrderDetails = {
  name: string;
  phone: string;
  area: string;
  address: string;
  map: string;
};

/**
 * كتلةُ بيانات التوصيل في الرسالة.
 *
 * إن مُلئ النموذجُ صارت البياناتُ سطورًا جاهزة، وإلا بقيت حقولًا فارغةً
 * يكتبها الزبون في واتساب نفسِه — فالنموذجُ خفيفٌ واختياريّ لا شرطَ للطلب.
 * ما لم يُملأ حقلٌ لا يُدرج سطرُه، ولو خلا النموذجُ كلُّه عاد إلى الفراغات.
 */
function askBlock(locale: Locale, details?: OrderDetails) {
  const t = T[locale];
  const blank = [
    t.orderAsk,
    `• ${t.orderName}:`,
    `• ${t.orderArea}:`,
    `• ${t.orderAddress}:`,
  ].join("\n");

  if (!details) return blank;

  const lines = [t.orderAsk];
  if (details.name) lines.push(`• ${t.orderName}: ${details.name}`);
  if (details.phone) lines.push(`• ${t.orderPhone}: ${details.phone}`);
  if (details.area) lines.push(`• ${t.orderArea}: ${details.area}`);
  if (details.address) lines.push(`• ${t.orderAddress}: ${details.address}`);
  if (details.map) lines.push(`• ${t.orderMapLabel}: ${details.map}`);
  return lines.length > 1 ? lines.join("\n") : blank;
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
 * وبيانات التوصيل: تُملأ في النموذج الخفيف فتصل جاهزة، أو تُترك فراغاتٍ
 * يكتبها الزبون في المحادثة إن اختار «الذهاب إلى واتساب مباشرة».
 */
function orderText(
  branch: Branch,
  rows: CartItem[],
  locale: Locale,
  details?: OrderDetails
) {
  const t = T[locale];
  const blocks = [orderBlock(branch, rows, locale)];
  if (locale !== "fr") blocks.push(orderBlock(branch, rows, "fr"));

  const ask = askBlock(locale, details);

  // مصدرُ الطلب مرّةً واحدةً في الذيل: يعرف التاجرُ أنه من الموقع، ورابطُه
  // في متناوله. لا يُكرَّر في الكتلة الفرنسية لأنه رابطٌ لا نصَّ يُترجَم.
  const via = `${t.orderVia}: ${SITE_URL}`;

  return [...blocks, ask, via].join("\n\n— — —\n\n");
}

/** رابطُ واتساب الفرع محمّلًا بنصّ الطلب */
const waLink = (
  branch: Branch,
  rows: CartItem[],
  locale: Locale,
  details?: OrderDetails
) =>
  `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
    orderText(branch, rows, locale, details)
  )}`;

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

  // خطوةُ اللوحة: عرضُ السلة أو نموذجُ بيانات التوصيل الخفيف.
  const [mode, setMode] = useState<"cart" | "form">("cart");
  const [form, setForm] = useState<OrderDetails>({
    name: "",
    phone: "",
    area: "",
    address: "",
    map: "",
  });
  const [locating, setLocating] = useState(false);

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

  // إغلاقُ اللوحة يعيدها إلى خطوة السلة ويصفّر النموذج، فيبدأ فارغًا دائمًا
  // في الفتحة التالية — لا تبقى بياناتُ زبونٍ سابق.
  useEffect(() => {
    if (!open) {
      setMode("cart");
      setForm({ name: "", phone: "", area: "", address: "", map: "" });
    }
  }, [open]);

  // «شارك موقعي»: يملأ حقلَ الخريطة برابط جوجل من إحداثيّات الجهاز، إن أذِن.
  const shareLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((f) => ({
          ...f,
          map: `https://maps.google.com/?q=${latitude},${longitude}`,
        }));
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

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
        ) : mode === "form" && branch.whatsapp ? (
          /* نموذجُ التوصيل الخفيف — كلُّ حقولِه اختيارية، ومنه زرّان:
             إرسالُ الطلب كاملًا، أو الذهابُ إلى واتساب مباشرةً بلا بيانات. */
          <section className="cart-group cart-form">
            <button
              type="button"
              className="cart-back"
              onClick={() => setMode("cart")}
            >
              ← {t.checkoutBack}
            </button>
            <h3>{t.checkoutFormTitle}</h3>
            <p className="cart-note">{t.checkoutFormHint}</p>

            <div className="cart-form-fields">
              <label>
                <span>{t.orderName}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  autoComplete="name"
                />
              </label>
              <label>
                <span>{t.orderPhone}</span>
                <input
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  autoComplete="tel"
                />
              </label>
              <label>
                <span>{t.orderArea}</span>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  placeholder={t.orderAreaPlaceholder}
                />
              </label>
              <label>
                <span>{t.orderAddress}</span>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  autoComplete="street-address"
                />
              </label>
              <label className="cart-form-map">
                <span>{t.orderMapField}</span>
                <div className="map-row">
                  <input
                    type="url"
                    dir="ltr"
                    inputMode="url"
                    value={form.map}
                    onChange={(e) => setForm((f) => ({ ...f, map: e.target.value }))}
                    placeholder="https://maps.google.com/…"
                  />
                  <button
                    type="button"
                    className="map-locate"
                    onClick={shareLocation}
                    disabled={locating}
                  >
                    {t.shareLocation}
                  </button>
                </div>
              </label>
            </div>

            <a
              className="btn cart-send"
              href={waLink(branch, rows, locale, form)}
              target="_blank"
              rel="noreferrer"
            >
              {t.sendOrder}
            </a>
            <a
              className="cart-skip"
              href={waLink(branch, rows, locale)}
              target="_blank"
              rel="noreferrer"
            >
              {t.skipToWhatsapp}
            </a>
          </section>
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

              {/* المتابعةُ إلى نموذج التوصيل الخفيف — لا يظهر لفرعٍ بلا رقم:
                  زرٌّ لا يفعل شيئًا أسوأ من غيابه، والرقمُ يُملأ في `catalog.ts`. */}
              {branch.whatsapp ? (
                <button
                  type="button"
                  className="btn cart-send"
                  onClick={() => setMode("form")}
                >
                  {t.checkoutProceed}
                </button>
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

