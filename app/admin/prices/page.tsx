// لوحة إدخال بيانات الكتالوج — تُفتح على الجهاز وقت التطوير لا على الموقع المنشور.
// مصدرها وهدفها ملفٌّ واحد: app/catalog.ts، فما يُحفظ هنا يُرفع مع الكود.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BRANCHES, CATALOG } from "../../catalog";
import { LONGEVITY_OPTIONS, SIZE_OPTIONS } from "../../i18n";
import { PricesForm } from "./prices-form";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "بيانات الكتالوج — فالوري",
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
    // الدارُ وحدها في السطر الصغير: الحجم صار حقلًا يُحرَّر فلا يُكرَّر تحت الاسم.
    meta: p.brand ?? "",
    image: p.image ?? "",
    size: p.size ?? "",
    gender: p.gender ?? "",
    longevity: p.longevity ?? "",
    prices: Object.fromEntries(
      Object.entries(p.branches).map(([id, stock]) => [id, stock?.price ?? null])
    ) as Record<string, number | null>,
  }));

  return (
    <PricesForm
      branches={branches}
      rows={rows}
      sizes={SIZE_OPTIONS}
      longevities={LONGEVITY_OPTIONS}
    />
  );
}
