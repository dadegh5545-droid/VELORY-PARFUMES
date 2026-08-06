// لغات الموقع — كل فرعٍ يخاطب زبائنه بلغتهم:
// الدوحة بالعربية والإنجليزية، ونجامينا بالعربية والفرنسية.
//
// العربية أصلُ المحتوى: ما لم يُترجم في الكتالوج يعود إليها بدل أن يظهر فارغًا،
// فلا تنكسر البطاقة لأن حقلًا لم يُملأ بعد.

import type { Gender, Season } from "./catalog";

export type Locale = "ar" | "en" | "fr";

/** اللغة الثانية لكل فرع — العربية مشتركة بين الفرعين */
export type SecondLocale = Exclude<Locale, "ar">;

export const isLocale = (v: unknown): v is Locale =>
  v === "ar" || v === "en" || v === "fr";

export const DIR: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
  fr: "ltr",
};

/** الاسم الكامل للغة — بلغتها هي، كما هو العرف في مبدّلات اللغة */
export const LOCALE_NAME: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  fr: "Français",
};

/** ما يُكتب على زر المبدّل — "عربي" لا "ع"، فحرفٌ وحده
 *  لا يعرفه قارئٌ لا يقرأ العربية، وهو أوّل من يحتاج المبدّل. */
export const LOCALE_SHORT: Record<Locale, string> = {
  ar: "عربي",
  en: "EN",
  fr: "FR",
};

// العدد بصيغة عربية سليمة: من ٣ إلى ١٠ جمعٌ، وما فوقها مفردٌ منصوب.
const AR_COUNT = [
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

export type Dict = {
  /** ما يلي عدد العطور في رأس القسم */
  sectionLead: string;
  /** يحلّ محلّ sectionLead في فرعٍ لم تُضف عطورُه بعد */
  sectionEmpty: string;
  count: (n: number) => string;

  address: string;
  hours: string;
  phone: string;
  whatsapp: string;
  mapLink: string;

  filterAll: string;
  /** وصفٌ للقارئ الآلي فوق أزرار التصفية */
  filterGroup: (branch: string) => string;

  head: string;
  heart: string;
  base: string;

  house: string;
  size: string;
  longevity: string;
  gender: string;
  season: string;

  priceOnRequest: string;
  add: string;
  addToCart: string;

  back: string;
  availability: string;
  soldNowhere: string;
  unavailable: string;
  alsoEyebrow: string;
  alsoTitle: string;

  /* الترويسة والصفحة الأولى */
  navHouse: string;
  navContact: string;
  navCart: string;
  /** يفتح الترحيب من جديد لتغيير الفرع أو اللغة */
  navChange: string;

  heroEyebrow: string;
  /** العنوان مشطورٌ لأن نصفه الثاني يُبرز بخطٍّ ذهبي */
  heroTitle: { lead: string; em: string };
  heroText: string;
  heroCta: string;

  quote: [string, string];
  quoteCite: string;
  rights: string;
  /** صدرُ سطر إسناد صور المشاهد في التذييل */
  photosBy: string;

  /* شاشة الترحيب */
  welcomeGreeting: string;
  welcomeTagline: string;
  /** حين لا يخاطب بهذه اللغة إلا فرعٌ واحد — فلا يُقال له "اختر من فرعَين" */
  welcomeSingle: string;
  chooseBranch: string;
  chooseLocale: string;
  stepBack: string;
  /** إغلاق الترحيب — فعلٌ غير "رجوع"، ولا يظهر إلا لمن سبق أن اختار */
  close: string;
};

export const T: Record<Locale, Dict> = {
  ar: {
    sectionLead: "— بأسعار الفرع. اضغط على أيّ عطرٍ لتفاصيله الكاملة.",
    sectionEmpty: "— مجموعة هذا الفرع قيد التحضير.",
    count: (n) => (n <= 10 ? AR_COUNT[n] : `${n} عطرًا`),

    address: "العنوان",
    hours: "الدوام",
    phone: "الهاتف",
    whatsapp: "اطلب عبر واتساب",
    mapLink: "موقع المحل على الخريطة",

    filterAll: "الكل",
    filterGroup: (branch) => `تصفية عطور ${branch} حسب النوع`,

    head: "المقدّمة",
    heart: "القلب",
    base: "القاعدة",

    house: "الدار",
    size: "الحجم",
    longevity: "الثبات",
    gender: "النوع",
    season: "الموسم",

    priceOnRequest: "السعر عند الطلب",
    add: "أضف",
    addToCart: "أضف إلى السلة",

    back: "العودة إلى المجموعة",
    availability: "التوفّر والأسعار",
    soldNowhere: "غير متوفّر حاليًا في أيٍّ من الفروع.",
    unavailable: "غير متوفّر",
    alsoEyebrow: "قد يعجبك أيضًا",
    alsoTitle: "عطورٌ أخرى",

    navHouse: "الدار",
    navContact: "تواصل",
    navCart: "السلة",
    navChange: "تغيير الفرع واللغة",

    heroEyebrow: "دار عطور",
    heroTitle: { lead: "فنُّ", em: "العِطر" },
    heroText:
      "خلاصاتٌ نادرة، تُمزج يدويًا في دفعاتٍ صغيرة. لكلِّ فرعٍ مجموعتُه وأسعارُه بعملة بلده.",
    heroCta: "تصفّح المجموعة",

    quote: ["العِطرُ ليس زينة.", "إنه ذاكرةٌ تُلبَس."],
    quoteCite: "فالوري — دار عطور",
    rights: "فالوري بارفوم",
    photosBy: "صور المشاهد من ويكيميديا كومنز:",

    welcomeGreeting: "أهلًا بك",
    welcomeTagline: "دارُ عطورٍ بفرعَين — اختر فرعك لنعرض لك مجموعته وأسعاره.",
    welcomeSingle: "الفرعُ الذي يخاطبك بلغتك — ادخل لتصفّح مجموعته وأسعاره.",
    chooseBranch: "اختر فرعك",
    chooseLocale: "اختر لغتك",
    stepBack: "رجوع",
    close: "إغلاق",
  },

  en: {
    sectionLead: "— at branch prices. Tap any perfume for its full details.",
    sectionEmpty: "— this branch's collection is being prepared.",
    count: (n) =>
      n === 0 ? "No perfumes yet" : n === 1 ? "One perfume" : `${n} perfumes`,

    address: "Address",
    hours: "Hours",
    phone: "Phone",
    whatsapp: "Order on WhatsApp",
    mapLink: "Find the shop on the map",

    filterAll: "All",
    filterGroup: (branch) => `Filter ${branch} perfumes by type`,

    head: "Top",
    heart: "Heart",
    base: "Base",

    house: "House",
    size: "Size",
    longevity: "Longevity",
    gender: "Type",
    season: "Season",

    priceOnRequest: "Price on request",
    add: "Add",
    addToCart: "Add to cart",

    back: "Back to the collection",
    availability: "Availability and prices",
    soldNowhere: "Not currently available at any branch.",
    unavailable: "Unavailable",
    alsoEyebrow: "You may also like",
    alsoTitle: "Other perfumes",

    navHouse: "The house",
    navContact: "Contact",
    navCart: "Cart",
    navChange: "Change branch and language",

    heroEyebrow: "Perfume house",
    heroTitle: { lead: "The Art of", em: "Perfume" },
    heroText:
      "Rare extracts, blended by hand in small batches. Each branch has its own collection and its own prices.",
    heroCta: "Browse the collection",

    quote: ["Perfume is no ornament.", "It is a memory you wear."],
    quoteCite: "VALORY — Perfume house",
    rights: "VALORY PARFUMES",
    photosBy: "Scene photography from Wikimedia Commons:",

    welcomeGreeting: "Welcome",
    welcomeTagline:
      "A perfume house with two branches — choose yours and we'll show you its collection and prices.",
    welcomeSingle:
      "The branch that speaks your language — step in for its collection and prices.",
    chooseBranch: "Choose your branch",
    chooseLocale: "Choose your language",
    stepBack: "Back",
    close: "Close",
  },

  fr: {
    sectionLead:
      "— aux prix de la succursale. Touchez un parfum pour tous ses détails.",
    sectionEmpty: "— la collection de cette succursale est en préparation.",
    count: (n) =>
      n === 0 ? "Aucun parfum pour l'instant" : n === 1 ? "Un parfum" : `${n} parfums`,

    address: "Adresse",
    hours: "Horaires",
    phone: "Téléphone",
    whatsapp: "Commander sur WhatsApp",
    mapLink: "Voir la boutique sur la carte",

    filterAll: "Tous",
    filterGroup: (branch) => `Filtrer les parfums de ${branch} par type`,

    head: "Tête",
    heart: "Cœur",
    base: "Fond",

    house: "Maison",
    size: "Contenance",
    longevity: "Tenue",
    gender: "Type",
    season: "Saison",

    priceOnRequest: "Prix sur demande",
    add: "Ajouter",
    addToCart: "Ajouter au panier",

    back: "Retour à la collection",
    availability: "Disponibilité et prix",
    soldNowhere: "Actuellement indisponible dans nos succursales.",
    unavailable: "Indisponible",
    alsoEyebrow: "Vous aimerez aussi",
    alsoTitle: "Autres parfums",

    navHouse: "La maison",
    navContact: "Contact",
    navCart: "Panier",
    navChange: "Changer de succursale et de langue",

    heroEyebrow: "Maison de parfums",
    heroTitle: { lead: "L'Art du", em: "Parfum" },
    heroText:
      "Des extraits rares, assemblés à la main en petits lots. Chaque succursale a sa collection et ses prix.",
    heroCta: "Parcourir la collection",

    quote: ["Le parfum n'est pas un ornement.", "C'est une mémoire que l'on porte."],
    quoteCite: "VALORY — Maison de parfums",
    rights: "VALORY PARFUMES",
    photosBy: "Photographies des paysages via Wikimedia Commons :",

    welcomeGreeting: "Bienvenue",
    welcomeTagline:
      "Une maison de parfums à deux succursales — choisissez la vôtre et nous vous montrerons sa collection et ses prix.",
    welcomeSingle:
      "La succursale qui vous parle dans votre langue — entrez pour découvrir sa collection et ses prix.",
    chooseBranch: "Choisissez votre succursale",
    chooseLocale: "Choisissez votre langue",
    stepBack: "Retour",
    close: "Fermer",
  },
};

export const GENDER_TR: Record<Gender, Record<Locale, string>> = {
  رجالي: { ar: "رجالي", en: "For him", fr: "Homme" },
  نسائي: { ar: "نسائي", en: "For her", fr: "Femme" },
  للجنسين: { ar: "للجنسين", en: "Unisex", fr: "Mixte" },
};

export const SEASON_TR: Record<Season, Record<Locale, string>> = {
  صيفي: { ar: "صيفي", en: "Summer", fr: "Été" },
  شتوي: { ar: "شتوي", en: "Winter", fr: "Hiver" },
  "لكل الفصول": { ar: "لكل الفصول", en: "All seasons", fr: "Toutes saisons" },
};

// الحجم يُكتب في الكتالوج بالعربية، وهذه مقابلاته اللاتينية.
// ما ليس في الجدول يُعرض كما هو — أفضل من إخفائه أو تشويهه.
const SIZE_TR: Record<string, Record<SecondLocale, string>> = {
  "100 مل": { en: "100 ml", fr: "100 ml" },
  "500 مل": { en: "500 ml", fr: "500 ml" },
  "100 جم": { en: "100 g", fr: "100 g" },
  "500 جم": { en: "500 g", fr: "500 g" },
  "٢٥ جم · رول أون": { en: "25 g · roll-on", fr: "25 g · roll-on" },
};

// أسماء الدور كما هي مطبوعةٌ باللاتينية على العبوات نفسها — لا ترجمةً لها،
// فاسم الدار علامةٌ تجارية تُنقل حرفًا بحرف كما اختارت هي أن تُكتب.
const BRAND_TR: Record<string, string> = {
  نسيم: "Naseem",
  الماس: "Almas Perfumes",
  الشندغة: "Al Shindagha",
  الكوثر: "Al Kausar",
  "كندل للعطور": "Kindal Perfume",
  "هريرة ٧": "Harera 7",
  "بيرفكت تريدنغ": "Perfect Trading",
  "زارا ٧": "Zara 7",
  "أستانا ميلانو": "Astana Milano",
  "زمزم للعطور": "Zamzam Perfumes",
  "عطورات العنود": "Al Anoud Perfumes",
  هيماني: "Hemani",
};

export const trSize = (size: string, locale: Locale) =>
  locale === "ar" ? size : SIZE_TR[size]?.[locale] ?? size;

export const trBrand = (brand: string, locale: Locale) =>
  locale === "ar" ? brand : BRAND_TR[brand] ?? brand;

// فاصل الآلاف: فاصلةٌ في العربية والإنجليزية، ومسافةٌ في الفرنسية كما هو عرفها.
// النقطة ممنوعة: "1.180" تُقرأ خطأً على أنها 1.18.
export const formatNumber = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(value);
