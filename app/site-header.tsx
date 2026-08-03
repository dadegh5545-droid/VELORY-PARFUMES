"use client";

import Link from "next/link";
import { BRANCHES, type BranchId } from "./catalog";
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
        {/* روابط الفروع تُولَّد من BRANCHES — إضافة فرعٍ ثالثٍ لاحقًا
            تُظهره في الترويسة تلقائيًا بلا تعديلٍ هنا */}
        {BRANCHES.map((b) => (
          <Link key={b.id} href={`/#${b.id}`}>
            {b.name}
          </Link>
        ))}
        <Link href="/#maison">الدار</Link>
        <Link href="/#contact">تواصل</Link>
        <Link href={`/#${BRANCHES[0].id}`} className="cart">
          السلة <span>({items.length})</span>
        </Link>
      </nav>
    </header>
  );
}

export function AddButton({
  id,
  branch,
  label = "أضف",
  variant,
}: {
  id: string;
  branch: BranchId;
  label?: string;
  variant?: "btn";
}) {
  const { add } = useCart();

  return (
    <button
      type="button"
      className={variant === "btn" ? "btn" : "add"}
      onClick={() => add(id, branch)}
    >
      {label}
    </button>
  );
}
