"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartValue = { items: string[]; add: (id: string) => void };

const CartContext = createContext<CartValue>({ items: [], add: () => {} });

const STORAGE_KEY = "valory.cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  // القراءة بعد التركيب فقط — لأن localStorage غير موجود أثناء التصيير على الخادم،
  // ولأن البدء بمصفوفة فارغة يمنع اختلاف HTML بين الخادم والمتصفح (hydration mismatch).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // تخزين معطّل أو بيانات تالفة — نتجاهله ونبدأ بسلة فارغة.
    }
  }, []);

  const add = (id: string) =>
    setItems((prev) => {
      const next = [...prev, id];
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
