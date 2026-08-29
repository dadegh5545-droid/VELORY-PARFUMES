"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  type Perfume,
  getBranch,
  metaLine,
  perfumeDescription,
  perfumeName,
  priceIn,
} from "./catalog";
import { T } from "./i18n";
import { useActive } from "./prefs";
import { Bottle } from "./bottle";
import { AddButton } from "./site-header";

// العرضُ السريع: نافذةٌ تُفتح من شبكة العطور فتُري صورةَ العطر واسمَه وحجمَه
// وسعرَه في الفرع وزرَّ الإضافة — بلا مغادرة الصفحة. تُغلق بـ Escape أو
// بالنقر خارجها، وتحبس التمرير خلفها. التفاصيلُ الكاملة برابطٍ إلى صفحته.

type QuickViewValue = { open: (p: Perfume) => void };

const QuickViewContext = createContext<QuickViewValue>({ open: () => {} });

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const { branch: activeId, locale } = useActive();
  const t = T[locale];
  const panelRef = useRef<HTMLDivElement>(null);

  const open = useCallback((p: Perfume) => setPerfume(p), []);
  const close = useCallback(() => setPerfume(null), []);

  useEffect(() => {
    if (!perfume) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [perfume, close]);

  const branch = getBranch(activeId);
  const meta = perfume ? metaLine(perfume, locale) : "";
  const description = perfume ? perfumeDescription(perfume, locale) : undefined;

  return (
    <QuickViewContext.Provider value={{ open }}>
      {children}
      {perfume && branch && (
        <div className="qv-veil" onClick={close}>
          <div
            className="qv-modal"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={perfumeName(perfume, locale)}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="qv-close"
              onClick={close}
              aria-label={t.close}
            >
              ✕
            </button>

            <div className="qv-grid">
              <Bottle perfume={perfume} className="qv-bottle" />

              <div className="qv-info">
                <h2>{perfumeName(perfume, locale)}</h2>
                {locale === "ar" && perfume.latin && (
                  <p className="latin qv-latin">{perfume.latin}</p>
                )}
                {meta && <p className="notes">{meta}</p>}
                {/* الوصفُ يظهر عند وجود بياناتٍ حقيقية فقط */}
                {description && <p className="qv-desc">{description}</p>}

                <span className="in-stock">{t.inStock}</span>

                <div className="qv-buy">
                  <span className="price">{priceIn(perfume, branch, locale)}</span>
                  <AddButton
                    id={perfume.id}
                    branch={branch.id}
                    label={t.addToCart}
                    variant="btn"
                  />
                </div>

                <Link
                  href={`/parfum/${perfume.id}`}
                  className="qv-details"
                  onClick={close}
                >
                  {t.fullDetails}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </QuickViewContext.Provider>
  );
}

export const useQuickView = () => useContext(QuickViewContext);
