// لوحة إدخال الأسعار — تُفتح على الجهاز وقت التطوير لا على الموقع المنشور.
// مصدرها وهدفها ملفٌّ واحد: app/catalog.ts، فما يُحفظ هنا يُرفع مع الكود.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BRANCHES, CATALOG } from "../../catalog";
import { PricesForm } from "./prices-form";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "أسعار الكتالوج — فالوري",
};

export default function PricesPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  // فرعٌ لا يُباع فيه شيء لا عمودَ له: عمودٌ فارغٌ يوسّع الجدول ولا يُدخَل فيه رقم.
  const branches = BRANCHES.filter((b) =>
    CATALOG.some((p) => p.branches[b.id])
  ).map((b) => ({
    id: b.id,
    name: b.name,
    currency: b.currency,
  }));

  // كل عطرٍ وأسعارُه في الفروع التي يُباع فيها وحدها — الفرع الغائب لا حقل له.
  const rows = CATALOG.map((p) => ({
    id: p.id,
    name: p.name,
    latin: p.latin ?? "",
    meta: [p.brand, p.size].filter(Boolean).join(" · "),
    image: p.image ?? "",
    prices: Object.fromEntries(
      Object.entries(p.branches).map(([id, stock]) => [id, stock?.price ?? null])
    ) as Record<string, number | null>,
  }));

  return <PricesForm branches={branches} rows={rows} />;
}
