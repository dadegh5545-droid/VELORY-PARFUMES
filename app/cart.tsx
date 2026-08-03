"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { BranchId } from "./catalog";

// السلة تحفظ الفرع مع العطر: نفس العطر قد يُطلب من قطر أو من تشاد،
// بسعرٍ وعملةٍ مختلفين، فالمعرّف وحده لا يكفي لتحديد ما طلبه الزبون.
export type CartItem = { id: string; branch: BranchId };

type CartValue = {
  items: CartItem[];
  add: (id: string, branch: BranchId) => void;
};

const CartContext = createContext<CartValue>({ items: [], add: () => {} });

const STORAGE_KEY = "valory.cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // القراءة بعد التركيب فقط — لأن localStorage غير موجود أثناء التصيير على الخادم،
  // ولأن البدء بمصفوفة فارغة يمنع اختلاف HTML بين الخادم والمتصفح (hydration mismatch).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      // سلّات محفوظة قبل إضافة الفروع كانت مصفوفة معرّفات نصية —
      // نتجاهلها بدل أن نخمّن فرعها، فتبدأ السلة نظيفة مرّةً واحدة.
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.every((i) => typeof i === "object")) {
        setItems(parsed as CartItem[]);
      }
    } catch {
      // تخزين معطّل أو بيانات تالفة — نتجاهله ونبدأ بسلة فارغة.
    }
  }, []);

  const add = (id: string, branch: BranchId) =>
    setItems((prev) => {
      const next = [...prev, { id, branch }];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // التخزين غير متاح (تصفّح خاص مثلًا) — السلة تبقى في الذاكرة فقط.
      }
      return next;
    });

  return (
    <CartContext.Provider value={{ items, add }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
