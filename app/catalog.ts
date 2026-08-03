// كتالوج عطور فالوري — مصدر واحد تقرأ منه الصفحة الرئيسية وصفحات التفاصيل.
// لاحقًا يُستبدل هذا المصفوف باستعلام من موديل Perfume على AWS.
//
// الحقول الاختيارية مقصودة: ما لا نعرفه يبقى فارغًا فتُخفيه الواجهة،
// بدل أن يُملأ بتخمين يُضلّل الزبون. املأها من بيانات منتجاتك الفعلية.

export type Gender = "رجالي" | "نسائي" | "للجنسين";
export type Season = "صيفي" | "شتوي" | "لكل الفصول";
export type BranchId = "qatar" | "chad";

export type Branch = {
  id: BranchId;
  /** عنوان القسم في الصفحة الرئيسية */
  name: string;
  city: string;
  /** رمز العملة كما يُكتب بعد الرقم */
  currency: string;
  tint: string;
  address?: string;
  /** الهاتف كما يُعرض للزبون، مثل: +974 5551 2345 */
  phone?: string;
  /** واتساب بصيغة دولية بلا + ولا مسافات، مثل: 97455512345 */
  whatsapp?: string;
  hours?: string;
  /** رابط المحل على خرائط جوجل */
  mapUrl?: string;
};

// ترتيب الفروع هنا هو ترتيب ظهور الأقسام في الصفحة.
// املأ العنوان والهاتف والدوام: كل حقلٍ يُملأ يظهر سطرًا في بطاقة المحل،
// وما يبقى فارغًا لا يظهر أصلًا — فلا تُعرض على الزبون بيانات ناقصة.
export const BRANCHES: Branch[] = [
  {
    id: "qatar",
    name: "فرع قطر",
    city: "الدوحة",
    currency: "ر.ق",
    tint: "rgba(140, 35, 65, 0.26)",
  },
  {
    id: "chad",
    name: "فرع تشاد",
    city: "نجامينا",
    currency: "FCFA",
    tint: "rgba(60, 115, 165, 0.26)",
  },
];

/** توفّر العطر في فرعٍ ما — وجود المفتاح وحده يعني أنه معروض هناك */
export type Stock = { price?: number };

export type Perfume = {
  id: string;
  name: string;
  /** حجم القارورة بالمليلتر */
  sizeMl?: number;
  /** مدة الثبات على البشرة، مثل: "6 – 8 ساعات" */
  longevity?: string;
  gender?: Gender;
  season?: Season;
  tint: string;
  description?: string;
  notes?: { head: string; heart: string; base: string };
  /** الفروع التي يُباع فيها العطر وسعره في كلٍّ منها.
   *  احذف الفرع من هنا إن كان العطر غير متوفّر عنده فتختفي بطاقته من قسمه،
   *  والسعر يبقى مستقلًّا لأن كل فرعٍ يُسعّر بعملته. */
  branches: Partial<Record<BranchId, Stock>>;
};

export const CATALOG: Perfume[] = [
  {
    id: "extravagance",
    name: "Extravagance",
    tint: "rgba(190, 110, 120, 0.26)",
    branches: { qatar: {}, chad: {} },
  },
  {
    id: "cool-water",
    name: "Cool Water",
    tint: "rgba(90, 140, 190, 0.28)",
    branches: { qatar: {}, chad: {} },
  },
  {
    id: "givenchy",
    name: "Givenchy",
    tint: "rgba(150, 110, 60, 0.30)",
    branches: { qatar: {}, chad: {} },
  },
  {
    id: "jean-paul",
    name: "Jean Paul",
    tint: "rgba(120, 140, 95, 0.24)",
    branches: { qatar: {}, chad: {} },
  },
  {
    id: "golden",
    name: "Golden",
    tint: "rgba(205, 150, 55, 0.32)",
    branches: { qatar: {}, chad: {} },
  },
];

export const getBranch = (id: BranchId) => BRANCHES.find((b) => b.id === id);

export const getPerfume = (id: string) => CATALOG.find((p) => p.id === id);

/** عطور فرعٍ بعينه — تقرأ منها شبكة القسم */
export const perfumesOf = (branch: BranchId) =>
  CATALOG.filter((p) => p.branches[branch]);

/** الفروع التي يتوفّر فيها عطرٌ ما — تقرأ منها صفحة التفاصيل */
export const branchesOf = (p: Perfume) =>
  BRANCHES.filter((b) => p.branches[b.id]);

// الفلترة بالنوع تظهر في القسم فقط حين يُعرف نوعان مختلفان بين عطور الفرع.
export const filtersOf = (branch: BranchId) => {
  const known = Array.from(
    new Set(perfumesOf(branch).map((p) => p.gender).filter(Boolean) as Gender[])
  );
  return known.length >= 2 ? ["الكل", ...known] : [];
};

// العدد بصيغة عربية سليمة: من ٣ إلى ١٠ جمعٌ، وما فوقها مفردٌ منصوب.
const COUNT_WORDS = [
  "لا عطور بعد",
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

export const countLabel = (n: number) =>
  n <= 10 ? COUNT_WORDS[n] : `${n} عطرًا`;

// فاصل الآلاف فاصلةٌ لا نقطة: صيغة "ar-MA" تعطي "1.180" فيُقرأ السعر
// خطأً على أنه 1.18 درهم. الفاصلة لا لبس فيها مع الأرقام اللاتينية.
export const formatPrice = (value: number, branch: Branch) =>
  `${new Intl.NumberFormat("en-US").format(value)} ${branch.currency}`;

/** سعر العطر في فرعٍ بعينه — أو "السعر عند الطلب" ما لم يُسعَّر بعد */
export const priceIn = (p: Perfume, branch: Branch) => {
  const price = p.branches[branch.id]?.price;
  return price ? formatPrice(price, branch) : "السعر عند الطلب";
};

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
