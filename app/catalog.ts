// كتالوج عطور فالوري — مصدر واحد تقرأ منه الصفحة الرئيسية وصفحات التفاصيل.
// لاحقًا يُستبدل هذا المصفوف باستعلام من موديل Perfume على AWS.
//
// الحقول الاختيارية مقصودة: ما لا نعرفه يبقى فارغًا فتُخفيه الواجهة،
// بدل أن يُملأ بتخمين يُضلّل الزبون. املأها من بيانات منتجاتك الفعلية.

export type Gender = "رجالي" | "نسائي" | "للجنسين";
export type Season = "صيفي" | "شتوي" | "لكل الفصول";

export type Perfume = {
  id: string;
  name: string;
  price?: number;
  /** حجم القارورة بالمليلتر */
  sizeMl?: number;
  /** مدة الثبات على البشرة، مثل: "6 – 8 ساعات" */
  longevity?: string;
  gender?: Gender;
  season?: Season;
  tint: string;
  description?: string;
  notes?: { head: string; heart: string; base: string };
};

export const CATALOG: Perfume[] = [
  {
    id: "extravagance",
    name: "Extravagance",
    tint: "rgba(190, 110, 120, 0.26)",
  },
  {
    id: "cool-water",
    name: "Cool Water",
    tint: "rgba(90, 140, 190, 0.28)",
  },
  {
    id: "givenchy",
    name: "Givenchy",
    tint: "rgba(150, 110, 60, 0.30)",
  },
  {
    id: "jean-paul",
    name: "Jean Paul",
    tint: "rgba(120, 140, 95, 0.24)",
  },
  {
    id: "golden",
    name: "Golden",
    tint: "rgba(205, 150, 55, 0.32)",
  },
];

// الفلترة بالنوع تظهر فقط حين يُعرف نوعان مختلفان — وإلا فلا معنى لها.
const knownGenders = Array.from(
  new Set(CATALOG.map((p) => p.gender).filter(Boolean) as Gender[])
);

export const FILTERS = knownGenders.length >= 2 ? ["الكل", ...knownGenders] : [];

// العدد بصيغة عربية سليمة: من ٣ إلى ١٠ جمعٌ، وما فوقها مفردٌ منصوب.
const COUNT_WORDS = [
  "",
  "عطر واحد",
  "عطران",
  "ثلاثة عطور",
  "أربعة عطور",
  "خمسة عطور",
  "ستة عطور",
  "سبعة عطور",
  "ثمانية عطور",
  "تسعة عطور",
  "عشرة عطور",
];

export const collectionTitle =
  CATALOG.length <= 10 ? COUNT_WORDS[CATALOG.length] : `${CATALOG.length} عطرًا`;

export const getPerfume = (id: string) => CATALOG.find((p) => p.id === id);

// فاصل الآلاف فاصلةٌ لا نقطة: صيغة "ar-MA" تعطي "1.180" فيُقرأ السعر
// خطأً على أنه 1.18 درهم. الفاصلة لا لبس فيها مع الأرقام اللاتينية.
export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

/** سطر "رجالي · شتوي · 100 مل" في البطاقة — يتجاوز ما لم يُملأ بعد */
export const metaLine = (p: Perfume) =>
  [p.gender, p.season, p.sizeMl ? `${p.sizeMl} مل` : null]
    .filter(Boolean)
    .join(" · ");

/** مواصفات صفحة التفاصيل، بلا الحقول الفارغة */
export const specsOf = (p: Perfume) =>
  (
    [
      p.longevity ? { k: "الثبات", v: p.longevity } : null,
      p.gender ? { k: "النوع", v: p.gender } : null,
      p.season ? { k: "الموسم", v: p.season } : null,
      p.sizeMl ? { k: "الحجم", v: `${p.sizeMl} مل` } : null,
    ] as ({ k: string; v: string } | null)[]
  ).filter(Boolean) as { k: string; v: string }[];
