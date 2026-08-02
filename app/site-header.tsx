"use client";

import Link from "next/link";
import { useCart } from "./cart";

export function SiteHeader() {
  const { items } = useCart();

  return (
    <header className="header">
      {/* اسم الدار يبقى باللاتينية — وهو العرف في العلامات الفاخرة */}
      <Link href="/" className="wordmark">
        VALORY<span>.</span>
      </Link>
      <nav className="nav">
        <Link href="/#collection">المجموعة</Link>
        <Link href="/#maison">الدار</Link>
        <Link href="/#contact">تواصل</Link>
        <Link href="/#collection" className="cart">
          السلة <span>({items.length})</span>
        </Link>
      </nav>
    </header>
  );
}

export function AddButton({
  id,
  label = "أضف",
  variant,
}: {
  id: string;
  label?: string;
  variant?: "btn";
}) {
  const { add } = useCart();

  return (
    <button
      type="button"
      className={variant === "btn" ? "btn" : "add"}
      onClick={() => add(id)}
    >
      {label}
    </button>
  );
}
