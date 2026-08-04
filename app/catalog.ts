// كتالوج عطور فالوري — مصدر واحد تقرأ منه الصفحة الرئيسية وصفحات التفاصيل.
// لاحقًا يُستبدل هذا المصفوف باستعلام من موديل Perfume على AWS.
//
// الحقول الاختيارية مقصودة: ما لا نعرفه يبقى فارغًا فتُخفيه الواجهة،
// بدل أن يُملأ بتخمين يُضلّل الزبون. املأها من بيانات منتجاتك الفعلية.

import {
  type Locale,
  type SecondLocale,
  GENDER_TR,
  SEASON_TR,
  T,
  formatNumber,
  trBrand,
  trSize,
} from "./i18n";

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
  /** لغتا الفرع: العربية أولًا ثم لغة زبائنه الثانية */
  locales: [Locale, SecondLocale];
  /** اسم الفرع ومدينته وعملته بلغته الثانية */
  tr: Partial<
    Record<SecondLocale, { name: string; city: string; currency?: string }>
  >;
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
    locales: ["ar", "en"],
    tr: { en: { name: "Qatar Branch", city: "Doha", currency: "QAR" } },
    tint: "rgba(140, 35, 65, 0.26)",
  },
  {
    id: "chad",
    name: "فرع تشاد",
    city: "نجامينا",
    currency: "FCFA",
    locales: ["ar", "fr"],
    tr: { fr: { name: "Succursale du Tchad", city: "N’Djamena" } },
    tint: "rgba(60, 115, 165, 0.26)",
  },
];

/** توفّر العطر في فرعٍ ما — وجود المفتاح وحده يعني أنه معروض هناك */
export type Stock = { price?: number };

export type Perfume = {
  id: string;
  /** الاسم العربي — هو ما يُقرأ أولًا في البطاقة */
  name: string;
  /** الاسم اللاتيني كما هو مطبوع على العبوة */
  latin?: string;
  /** الدار المصنّعة، كما تظهر على الملصق */
  brand?: string;
  /** الحجم نصًّا لا رقمًا: المنتجات تُباع بالمليلتر وبالجرام معًا */
  size?: string;
  /** مدة الثبات على البشرة، مثل: "6 – 8 ساعات" */
  longevity?: string;
  gender?: Gender;
  season?: Season;
  tint: string;
  /** مسار صورة المنتج تحت public، مثل "/products/thaljee.jpg".
   *  ما لم تُملأ، تُرسم قارورةٌ بالـ CSS — فلا تنتظر الصفحةُ اكتمالَ التصوير. */
  image?: string;
  description?: string;
  notes?: { head: string; heart: string; base: string };
  /** ترجمة ما يُترجَم من بيانات العطر.
   *  الاسم يُترك فارغًا حين يكفي `latin` — فاسمُ العطر المطبوع على العبوة
   *  هو اسمُه في كل لغة، ولا يُترجم إلا ما كان وصفًا لا علامةً تجارية. */
  tr?: Partial<
    Record<
      SecondLocale,
      {
        name?: string;
        description?: string;
        longevity?: string;
        notes?: { head: string; heart: string; base: string };
      }
    >
  >;
  /** الفروع التي يُباع فيها العطر وسعره في كلٍّ منها.
   *  احذف الفرع من هنا إن كان العطر غير متوفّر عنده فتختفي بطاقته من قسمه،
   *  والسعر يبقى مستقلًّا لأن كل فرعٍ يُسعّر بعملته. */
  branches: Partial<Record<BranchId, Stock>>;
};

// الألوان مأخوذة من صورة كل منتج، فيتناغم وهج البطاقة مع عبوته.
// كل المنتجات معروضة في الفرعين مبدئيًا — احذف الفرع من `branches`
// لأي منتجٍ غير متوفّرٍ عنده، فتختفي بطاقته من قسم ذلك الفرع وحده.
export const CATALOG: Perfume[] = [
  {
    id: "thaljee",
    name: "ثلجي",
    latin: "Thaljee 53",
    brand: "نسيم",
    size: "100 مل",
    tint: "rgba(190, 155, 60, 0.28)",
    image: "/products/thaljee.jpg",
    branches: { chad: {} },
  },
  {
    id: "bushra",
    name: "بشرى",
    latin: "Bushra 53",
    brand: "نسيم",
    size: "100 مل",
    tint: "rgba(160, 190, 110, 0.24)",
    image: "/products/bushra.jpg",
    branches: { chad: {} },
  },
  {
    id: "be-sugar",
    name: "بي شوقر",
    latin: "Be Sugar",
    brand: "نسيم",
    size: "100 مل",
    tint: "rgba(215, 140, 80, 0.24)",
    image: "/products/be-sugar.jpg",
    branches: { chad: {} },
  },
  {
    id: "baccarat-rouge",
    name: "بكارات روج ٥٤٠",
    latin: "Baccarat Rouge 540",
    brand: "الماس",
    tint: "rgba(200, 55, 60, 0.28)",
    image: "/products/baccarat-rouge.jpg",
    branches: { chad: {} },
  },
  {
    id: "black-opum",
    name: "بلاك أوبيوم",
    latin: "Black Opum",
    brand: "الماس",
    size: "100 جم",
    tint: "rgba(160, 110, 95, 0.26)",
    image: "/products/black-opum.jpg",
    branches: { chad: {} },
  },
  {
    id: "pares",
    name: "باريس",
    latin: "Pares",
    brand: "الماس",
    tint: "rgba(150, 90, 160, 0.24)",
    image: "/products/pares.jpg",
    branches: { chad: {} },
  },
  {
    id: "moon-paris",
    name: "مون باريس",
    latin: "Moon Paris",
    brand: "الشندغة",
    size: "100 مل",
    tint: "rgba(215, 175, 80, 0.28)",
    image: "/products/moon-paris.jpg",
    branches: { chad: {} },
  },
  {
    id: "sahrawi",
    name: "سحراوي",
    latin: "Sahrawi",
    size: "100 مل",
    tint: "rgba(190, 150, 110, 0.24)",
    image: "/products/sahrawi.jpg",
    branches: { chad: {} },
  },
  {
    id: "hawaas",
    name: "حواس",
    latin: "Hawaas",
    brand: "الكوثر",
    size: "100 جم",
    tint: "rgba(170, 175, 180, 0.22)",
    image: "/products/hawaas.jpg",
    branches: { chad: {} },
  },
  {
    id: "ehsaas-al-arabia",
    name: "إحساس العربية",
    latin: "Ehsaas Al Arabia",
    brand: "الكوثر",
    tint: "rgba(140, 120, 70, 0.26)",
    image: "/products/ehsaas-al-arabia.jpg",
    branches: { chad: {} },
  },
  {
    id: "djohara",
    name: "جوهرة",
    latin: "Djohara",
    brand: "كندل للعطور",
    tint: "rgba(165, 170, 175, 0.22)",
    image: "/products/djohara.jpg",
    branches: { chad: {} },
  },
  {
    id: "oud-bouquet",
    name: "عود بوكيه",
    latin: "Oud Bouquet",
    brand: "كندل للعطور",
    tint: "rgba(200, 60, 140, 0.26)",
    image: "/products/oud-bouquet.jpg",
    branches: { chad: {} },
  },
  {
    id: "jawhara",
    name: "جواهر",
    latin: "Jawhara",
    size: "100 مل",
    tint: "rgba(220, 110, 90, 0.26)",
    image: "/products/jawhara.jpg",
    branches: { chad: {} },
  },
  {
    id: "chamar",
    name: "شمار",
    latin: "Chamar",
    brand: "هريرة ٧",
    size: "100 جم",
    tint: "rgba(190, 150, 70, 0.28)",
    image: "/products/chamar.jpg",
    branches: { chad: {} },
  },
  {
    id: "jagvar-gold",
    name: "جاكوار ذهب",
    latin: "Jagvar Gold",
    brand: "هريرة ٧",
    size: "٢٥ جم · رول أون",
    tint: "rgba(205, 165, 60, 0.30)",
    image: "/products/jagvar-gold.jpg",
    branches: { chad: {} },
  },
  {
    id: "jedare",
    name: "جيدار",
    latin: "Jedare",
    brand: "بيرفكت تريدنغ",
    size: "100 جم",
    tint: "rgba(200, 80, 60, 0.24)",
    image: "/products/jedare.jpg",
    branches: { chad: {} },
  },
  {
    id: "yaqoot-sandal",
    name: "ياقوت صندل",
    latin: "Yaqoot Sandal",
    brand: "زارا ٧",
    size: "100 جم",
    tint: "rgba(205, 65, 55, 0.26)",
    image: "/products/yaqoot-sandal.jpg",
    branches: { chad: {} },
  },
  {
    id: "munjaro",
    name: "منجارو",
    latin: "Munjaro",
    brand: "أستانا ميلانو",
    tint: "rgba(200, 60, 50, 0.28)",
    image: "/products/munjaro.jpg",
    branches: { chad: {} },
  },
  {
    id: "sandaliyah",
    name: "صندلية",
    latin: "Sandaliyah",
    size: "100 مل",
    tint: "rgba(160, 45, 90, 0.28)",
    image: "/products/sandaliyah.jpg",
    branches: { chad: {} },
  },
  {
    id: "zam-sandaliyah",
    name: "صندلية زمزم",
    latin: "Zam Sandaliyah",
    brand: "زمزم للعطور",
    size: "500 مل",
    tint: "rgba(70, 150, 80, 0.26)",
    image: "/products/zam-sandaliyah.jpg",
    branches: { chad: {} },
  },
  {
    id: "anoud-sandaliyah",
    name: "صندلية العنود",
    latin: "Al Anoud Sandaliyah",
    brand: "عطورات العنود",
    tint: "rgba(215, 120, 160, 0.24)",
    image: "/products/anoud-sandaliyah.jpg",
    branches: { chad: {} },
  },
  {
    id: "sandal-zafran",
    name: "صندل زعفران",
    latin: "Sandal Zafran",
    tint: "rgba(200, 150, 90, 0.24)",
    image: "/products/sandal-zafran.jpg",
    branches: { chad: {} },
  },
  {
    id: "al-mataf-oud",
    name: "عود المطاف",
    latin: "Al-Mataf Oud",
    tint: "rgba(175, 130, 95, 0.26)",
    image: "/products/al-mataf-oud.jpg",
    branches: { chad: {} },
  },
  {
    id: "oud-chips",
    name: "عود خام",
    latin: "Oud Chips",
    // وصفٌ لا علامةٌ تجارية، فيُترجم
    tr: { fr: { name: "Copeaux d'oud brut" } },
    tint: "rgba(150, 110, 70, 0.26)",
    image: "/products/oud-chips.jpg",
    branches: { chad: {} },
  },
  {
    id: "hemani-sandal",
    name: "قشرة صندل",
    latin: "Sandal Wood Chips",
    brand: "هيماني",
    tr: { fr: { name: "Copeaux de bois de santal" } },
    size: "500 جم",
    tint: "rgba(80, 160, 90, 0.24)",
    image: "/products/hemani-sandal.jpg",
    branches: { chad: {} },
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
export const filtersOf = (branch: BranchId): Gender[] => {
  const known = Array.from(
    new Set(perfumesOf(branch).map((p) => p.gender).filter(Boolean) as Gender[])
  );
  return known.length >= 2 ? known : [];
};

/* ــــــــ ما يُقرأ بلغة الزائر ــــــــ
   كل دالةٍ هنا تأخذ اللغة وتعيد العربيةَ إن لم تُترجَم بعد:
   النقصُ يظهر بالعربية، لا فراغًا في مكان الاسم أو السعر. */

export const branchName = (b: Branch, locale: Locale) =>
  locale === "ar" ? b.name : b.tr[locale as SecondLocale]?.name ?? b.name;

export const branchCity = (b: Branch, locale: Locale) =>
  locale === "ar" ? b.city : b.tr[locale as SecondLocale]?.city ?? b.city;

/** اسم الفرع في صفحةٍ قد تكون بلغةٍ لا يتكلّمها هذا الفرع.
 *  صفحةُ التفاصيل تعرض الفرعين معًا، فلو قُرئت بالفرنسية ظهر فرع قطر
 *  باسمه الإنجليزي لا العربي: حرفٌ لاتيني في صفحةٍ لاتينية أقرب للقارئ. */
const spoken = (b: Branch, locale: Locale): Locale =>
  b.locales.includes(locale) ? locale : locale === "ar" ? "ar" : b.locales[1];

export const branchNameIn = (b: Branch, locale: Locale) =>
  branchName(b, spoken(b, locale));

export const branchCityIn = (b: Branch, locale: Locale) =>
  branchCity(b, spoken(b, locale));

const branchCurrency = (b: Branch, locale: Locale) =>
  locale === "ar"
    ? b.currency
    : b.tr[locale as SecondLocale]?.currency ?? b.currency;

/** اسم العطر: العربيُّ أصلًا، وإلا فالمترجَم، وإلا فالمطبوع على العبوة */
export const perfumeName = (p: Perfume, locale: Locale) =>
  locale === "ar"
    ? p.name
    : p.tr?.[locale as SecondLocale]?.name ?? p.latin ?? p.name;

export const perfumeDescription = (p: Perfume, locale: Locale) =>
  locale === "ar"
    ? p.description
    : p.tr?.[locale as SecondLocale]?.description ?? p.description;

export const perfumeNotes = (p: Perfume, locale: Locale) =>
  locale === "ar"
    ? p.notes
    : p.tr?.[locale as SecondLocale]?.notes ?? p.notes;

const perfumeLongevity = (p: Perfume, locale: Locale) =>
  locale === "ar"
    ? p.longevity
    : p.tr?.[locale as SecondLocale]?.longevity ?? p.longevity;

export const countLabel = (n: number, locale: Locale) => T[locale].count(n);

export const formatPrice = (value: number, branch: Branch, locale: Locale) =>
  `${formatNumber(value, locale)} ${branchCurrency(branch, locale)}`;

/** سعر العطر في فرعٍ بعينه — أو "السعر عند الطلب" ما لم يُسعَّر بعد */
export const priceIn = (p: Perfume, branch: Branch, locale: Locale) => {
  const price = p.branches[branch.id]?.price;
  return price ? formatPrice(price, branch, locale) : T[locale].priceOnRequest;
};

/** سطر "نسيم · 100 مل" تحت اسم العطر — يتجاوز ما لم يُملأ بعد */
export const metaLine = (p: Perfume, locale: Locale) =>
  [
    p.brand && trBrand(p.brand, locale),
    p.gender && GENDER_TR[p.gender][locale],
    p.season && SEASON_TR[p.season][locale],
    p.size && trSize(p.size, locale),
  ]
    .filter(Boolean)
    .join(" · ");

/** مواصفات صفحة التفاصيل، بلا الحقول الفارغة */
export const specsOf = (p: Perfume, locale: Locale) => {
  const t = T[locale];
  const longevity = perfumeLongevity(p, locale);

  return (
    [
      p.brand ? { k: t.house, v: trBrand(p.brand, locale) } : null,
      p.size ? { k: t.size, v: trSize(p.size, locale) } : null,
      longevity ? { k: t.longevity, v: longevity } : null,
      p.gender ? { k: t.gender, v: GENDER_TR[p.gender][locale] } : null,
      p.season ? { k: t.season, v: SEASON_TR[p.season][locale] } : null,
    ] as ({ k: string; v: string } | null)[]
  ).filter(Boolean) as { k: string; v: string }[];
};
