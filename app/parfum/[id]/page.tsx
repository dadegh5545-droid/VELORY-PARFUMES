import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG, branchesOf, getPerfume } from "../../catalog";
import { PerfumeView } from "./view";

type Props = { params: { id: string } };

// يولّد صفحة ثابتة لكل عطر وقت البناء بدل تصييرها عند كل طلب.
export function generateStaticParams() {
  return CATALOG.map((p) => ({ id: p.id }));
}

// الوسوم بالعربية: هي لغة المحتوى الأصل، وما يقرؤه محرّك البحث ومعاينةُ
// الرابط قبل أن يصل الزائر إلى الصفحة فيُطبَّق اختيارُه المحفوظ.
export function generateMetadata({ params }: Props): Metadata {
  const perfume = getPerfume(params.id);
  if (!perfume) return { title: "عطر غير موجود | فالوري" };

  const where = branchesOf(perfume)
    .map((b) => b.city)
    .join(" و");

  return {
    title: `${perfume.name} | فالوري`,
    description:
      perfume.description ??
      (where
        ? `${perfume.name} — متوفّر في متجر فالوري بـ${where}.`
        : `${perfume.name} — من مجموعة فالوري للعطور.`),
  };
}

export default function PerfumePage({ params }: Props) {
  const perfume = getPerfume(params.id);
  if (!perfume) notFound();

  return <PerfumeView perfume={perfume} />;
}
