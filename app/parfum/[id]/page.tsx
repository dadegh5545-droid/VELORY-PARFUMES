import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG, branchesOf, getPerfume } from "../../catalog";
import { ProductJsonLd } from "../../structured-data";
import { pageMetadata } from "../../page-meta";
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

  // «في نجامينا» لا «بـنجامينا»: الباءُ تلتصق بالاسم فتُقرأ كلمةً واحدة.
  const description =
    perfume.description ??
    (where
      ? `${perfume.name} — متوفّر في متجر فالوري في ${where}.`
      : `${perfume.name} — من مجموعة فالوري للعطور.`);

  return pageMetadata({
    path: `/parfum/${perfume.id}`,
    title: perfume.name,
    description,
    // صورةُ العبوة إن وُجدت، وإلا فصورةُ المشاركة الافتراضية.
    image: perfume.image,
  });
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
