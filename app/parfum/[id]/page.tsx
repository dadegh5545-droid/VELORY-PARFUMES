import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG, branchesOf, getPerfume } from "../../catalog";
import { ProductJsonLd } from "../../structured-data";
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
  if (!perfume) return { title: "عطر غير موجود" };

  const where = branchesOf(perfume)
    .map((b) => b.city)
    .join(" و");

  const description =
    perfume.description ??
    (where
      ? `${perfume.name} — متوفّر في متجر فالوري بـ${where}.`
      : `${perfume.name} — من مجموعة فالوري للعطور.`);

  const path = `/parfum/${perfume.id}`;

  return {
    title: perfume.name,
    description,
    // كلُّ صفحةٍ تشير إلى نفسها canonical فلا تُحسب نسخًا مكرّرة.
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${perfume.name} | فالوري`,
      description,
      url: path,
      // صورةُ العبوة إن وُجدت — تُحلّ إلى رابطٍ مطلقٍ عبر metadataBase.
      images: perfume.image ? [{ url: perfume.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${perfume.name} | فالوري`,
      description,
      images: perfume.image ? [perfume.image] : undefined,
    },
  };
}

export default function PerfumePage({ params }: Props) {
  const perfume = getPerfume(params.id);
  if (!perfume) notFound();

  return (
    <>
      <ProductJsonLd perfume={perfume} />
      <PerfumeView perfume={perfume} />
    </>
  );
}
