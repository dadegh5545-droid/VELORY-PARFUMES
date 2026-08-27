"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { BranchId } from "./catalog";

// السلة تحفظ الفرع مع العطر: نفس العطر قد يُطلب من قطر أو من تشاد،
// بسعرٍ وعملةٍ مختلفين، فالمعرّف وحده لا يكفي لتحديد ما طلبه الزبون.
export type CartItem = { id: string; branch: BranchId; qty: number };

type CartValue = {
  /** كلُّ ما في التخزين — لا يُعرض كما هو، بل يُصفّى بالفرع دائمًا */
  items: CartItem[];
  add: (id: string, branch: BranchId) => void;
  /** إنقاصُ واحدٍ من الكمّية، وحذفُ السطر عند بلوغها صفرًا */
  drop: (id: string, branch: BranchId) => void;
  /** حذفُ السطر كلِّه مهما كانت كمّيتُه — لا إنقاصًا واحدًا واحدًا */
  remove: (id: string, branch: BranchId) => void;
  /** تفريغُ سلّةِ فرعٍ بعينه — سلّةُ الفرع الآخر لا تُمَسّ */
  clear: (branch: BranchId) => void;
  /** سلّةُ فرعٍ بعينه: ما أضافه الزائر وهو فيه، لا ما أضافه في غيره */
  itemsOf: (branch: BranchId) => CartItem[];
  /** عددُ قطع فرعٍ بعينه — هو ما يُعرض في الترويسة */
  countOf: (branch: BranchId) => number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartValue>({
  items: [],
  add: () => {},
  drop: () => {},
  remove: () => {},
  clear: () => {},
  itemsOf: () => [],
  countOf: () => 0,
  open: false,
  setOpen: () => {},
});

const STORAGE_KEY = "valory.cart";

const same = (a: CartItem, id: string, branch: BranchId) =>
  a.id === id && a.branch === branch;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  // القراءة بعد التركيب فقط — لأن localStorage غير موجود أثناء التصيير على الخادم،
  // ولأن البدء بمصفوفة فارغة يمنع اختلاف HTML بين الخادم والمتصفح (hydration mismatch).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      // سلّات محفوظة قبل إضافة الفروع كانت مصفوفة معرّفات نصية، وقبل
      // الكمّيات كانت أسطرًا مكرّرة — نقبل ما له `id` و`branch` ونعطي
      // ما لا كمّيةَ له واحدًا، فلا تضيع سلّةُ زائرٍ قديم.
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return;
      const rows: CartItem[] = [];
      for (const raw of parsed) {
        if (!raw || typeof raw !== "object") continue;
        const it = raw as Partial<CartItem>;
        if (typeof it.id !== "string" || typeof it.branch !== "string") continue;
        const qty = typeof it.qty === "number" && it.qty > 0 ? it.qty : 1;
        const found = rows.find((r) => same(r, it.id!, it.branch as BranchId));
        if (found) found.qty += qty;
        else rows.push({ id: it.id, branch: it.branch as BranchId, qty });
      }
      setItems(rows);
    } catch {
      // تخزين معطّل أو بيانات تالفة — نتجاهله ونبدأ بسلة فارغة.
    }
  }, []);

  const save = (next: CartItem[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // التخزين غير متاح (تصفّح خاص مثلًا) — السلة تبقى في الذاكرة فقط.
    }
    return next;
  };

  const add = (id: string, branch: BranchId) =>
    setItems((prev) => {
      const found = prev.find((i) => same(i, id, branch));
      const next = found
        ? prev.map((i) => (same(i, id, branch) ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { id, branch, qty: 1 }];
      return save(next);
    });

  const drop = (id: string, branch: BranchId) =>
    setItems((prev) =>
      save(
        prev
          .map((i) => (same(i, id, branch) ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0)
      )
    );

  // الحذفُ يُسقط السطرَ كلَّه دفعةً — لمن أراد إزالةَ عطرٍ بكمّيته كلِّها
  // بلا نقرٍ متكرّر على «أنقص».
  const remove = (id: string, branch: BranchId) =>
    setItems((prev) => save(prev.filter((i) => !same(i, id, branch))));

  // التفريغُ يمسّ فرعًا واحدًا: زائرٌ يفرغ سلّة نجامينا لا يُفرغ سلّةَ
  // الدوحة معها — ولكلِّ فرعٍ سلّتُه القائمة بذاتها.
  const clear = (branch: BranchId) =>
    setItems((prev) => save(prev.filter((i) => i.branch !== branch)));

  const itemsOf = (branch: BranchId) => items.filter((i) => i.branch === branch);

  const countOf = (branch: BranchId) =>
    items.reduce((n, i) => (i.branch === branch ? n + i.qty : n), 0);

  return (
    <CartContext.Provider
      value={{ items, add, drop, remove, clear, itemsOf, countOf, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
