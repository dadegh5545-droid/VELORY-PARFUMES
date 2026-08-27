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

  /* أدوات تصفّح المجموعة: بحثٌ وترتيبٌ ومرشِّحات وكشفُ المزيد */
  searchLabel: string;
  searchPlaceholder: string;
  searchNoResults: string;
  sortLabel: string;
  sortDefault: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortName: string;
  filterCategory: string;
  filterHouseAll: string;
  filterSizeAll: string;
  filterPriceMax: string;
  showMore: string;

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
  /** حالةُ التوفّر على بطاقة العرض — العطرُ المعروض في فرعٍ متوفّرٌ فيه */
  inStock: string;
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

  /* لوحة السلة */
  cartEmpty: string;
  cartClear: string;
  /** إتمامُ الطلب على واتساب الفرع — لا رقمَ عامًّا للدار */
  checkoutWhatsapp: string;
  remove: string;
  /** أزرارُ ضبط الكمّية وحذفِ السطر داخل السلة */
  qtyIncrease: string;
  qtyDecrease: string;
  removeItem: string;
  /** يظهر مكان زرّ الإتمام لفرعٍ لم يُملأ رقمُه بعد */
  branchNoContact: string;
  /** صدرُ رسالة الواتساب وسطرُ الفرع فيها */
  orderHello: string;
  orderBranch: string;
  /** المجموعُ الكلي في ذيل الطلب، وحالُ ما لم يُسعَّر بعد */
  orderTotal: string;
  orderSomeOnRequest: string;
  orderAllOnRequest: string;
  /** بياناتُ التوصيل تُطلب داخل واتساب — لا حسابَ في الموقع ولا نموذج */
  orderAsk: string;
  orderName: string;
  orderArea: string;
  orderAddress: string;
  /** ملخّصُ عدد القطع في ذيل الطلب */
  orderItems: (n: number) => string;
  /** سطرٌ يُذيَّل به الطلبُ مرّةً واحدة: من أين جاء ورابطُه */
  orderVia: string;

  heroEyebrow: string;
  /** العنوان مشطورٌ لأن نصفه الثاني يُبرز بخطٍّ ذهبي */
  heroTitle: { lead: string; em: string };
  heroText: string;
  heroCta: string;

  /**
   * واجهةُ فرع تشاد وحدَها.
   *
   * فرعٌ له واجهتُه لأن له بلدَه: العنوانُ يسمّي تشاد، والشريطُ يعِد
   * بتوصيلٍ داخلها وطلبٍ على واتسابها. وقطرُ تبقى على الواجهة العامّة
   * أعلاه حتى تُرسل بياناتُها — فلا يُوعَد زبونٌ بما لا فرعَ له فيه.
   * والعنوانُ سطرٌ واحدٌ لا مشطور: `heroTitle` كُسر إلى نصفين فتكسّر معه.
   */
  heroChad: {
    title: string;
    text: string;
    shop: string;
    featured: string;
    /** ثلاثُ وعودٍ قصيرة أسفل الواجهة — لا رابعَ لها في التخطيط */
    strip: [string, string, string];
  };

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

    searchLabel: "ابحث في المجموعة",
    searchPlaceholder: "ابحث باسم العطر أو الدار…",
    searchNoResults: "لا عطرَ يطابق بحثك — جرّب كلمةً أعمّ أو أزِل مرشِّحًا.",
    sortLabel: "ترتيب العطور",
    sortDefault: "الترتيب الافتراضي",
    sortPriceAsc: "السعر: من الأقل",
    sortPriceDesc: "السعر: من الأعلى",
    sortName: "الاسم: أبجديًّا",
    filterCategory: "التصنيف",
    filterHouseAll: "كل الدور",
    filterSizeAll: "كل الأحجام",
    filterPriceMax: "السعر حتى",
    showMore: "عرض المزيد",

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
    inStock: "متوفّر",
    soldNowhere: "غير متوفّر حاليًا في أيٍّ من الفروع.",
    unavailable: "غير متوفّر",
    alsoEyebrow: "قد يعجبك أيضًا",
    alsoTitle: "عطورٌ أخرى",

    navHouse: "الدار",
    navContact: "تواصل",
    navCart: "السلة",
    cartEmpty: "سلّتك فارغة — اختر عطرًا من مجموعة الفرع.",
    cartClear: "إفراغ السلة",
    checkoutWhatsapp: "إتمام الطلب عبر واتساب",
    remove: "أنقص",
    qtyIncrease: "زد واحدًا",
    qtyDecrease: "أنقص واحدًا",
    removeItem: "احذف من السلة",
    branchNoContact: "رقم هذا الفرع لم يُضَف بعد.",
    orderHello: "السلام عليكم، أودّ طلب هذه العطور من فالوري:",
    orderBranch: "الفرع",
    orderTotal: "المجموع الكلي",
    orderSomeOnRequest: "(بعض الأصناف سعرُها عند الطلب، غير محسوبة في المجموع)",
    orderAllOnRequest: "أسعار هذه الأصناف عند الطلب — أفيدوني بالمجموع من فضلكم.",
    orderAsk: "بياناتي للتوصيل:",
    orderName: "الاسم",
    orderArea: "المنطقة",
    orderAddress: "عنوان التوصيل",
    orderItems: (n) => `عدد القطع: ${n}`,
    orderVia: "طُلب عبر موقع فالوري",
    navChange: "تغيير الفرع واللغة",

    heroEyebrow: "دار عطور",
    heroTitle: { lead: "فنُّ", em: "العِطر" },
    heroText:
      "خلاصاتٌ نادرة، تُمزج يدويًا في دفعاتٍ صغيرة. لكلِّ فرعٍ مجموعتُه وأسعارُه بعملة بلده.",
    heroCta: "تصفّح المجموعة",

    heroChad: {
      title: "عطورٌ تحكي روحَ تشاد",
      text: "اكتشف مجموعةً مختارةً من العطور الفاخرة، بروائحَ تناسب كلَّ لحظة.",
      shop: "تسوّق المجموعة",
      featured: "اكتشف العطر المميّز",
      strip: ["عطورٌ أصلية", "توصيل داخل تشاد", "طلبٌ سريع عبر واتساب"],
    },

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

    searchLabel: "Search the collection",
    searchPlaceholder: "Search by name or house…",
    searchNoResults: "No perfume matches your search — try a broader word or clear a filter.",
    sortLabel: "Sort perfumes",
    sortDefault: "Default order",
    sortPriceAsc: "Price: low to high",
    sortPriceDesc: "Price: high to low",
    sortName: "Name: A–Z",
    filterCategory: "Category",
    filterHouseAll: "All houses",
    filterSizeAll: "All sizes",
    filterPriceMax: "Price up to",
    showMore: "Show more",

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
    inStock: "In stock",
    soldNowhere: "Not currently available at any branch.",
    unavailable: "Unavailable",
    alsoEyebrow: "You may also like",
    alsoTitle: "Other perfumes",

    navHouse: "The house",
    navContact: "Contact",
    navCart: "Cart",
    cartEmpty: "Your cart is empty — pick a perfume from the branch collection.",
    cartClear: "Empty cart",
    checkoutWhatsapp: "Complete order on WhatsApp",
    remove: "Remove one",
    qtyIncrease: "Add one",
    qtyDecrease: "Remove one",
    removeItem: "Remove from cart",
    branchNoContact: "This branch has no number yet.",
    orderHello: "Hello, I would like to order these perfumes from VALORY:",
    orderBranch: "Branch",
    orderTotal: "Total",
    orderSomeOnRequest: "(some items are priced on request and are not in the total)",
    orderAllOnRequest: "These items are priced on request — please send me the total.",
    orderAsk: "My delivery details:",
    orderName: "Name",
    orderArea: "Area",
    orderAddress: "Delivery address",
    orderItems: (n) => `Items: ${n}`,
    orderVia: "Ordered via VALORY's website",
    navChange: "Change branch and language",

    heroEyebrow: "Perfume house",
    heroTitle: { lead: "The Art of", em: "Perfume" },
    heroText:
      "Rare extracts, blended by hand in small batches. Each branch has its own collection and its own prices.",
    heroCta: "Browse the collection",

    heroChad: {
      title: "Fragrances that tell the soul of Chad",
      text: "Discover a curated selection of fine perfumes — a scent for every moment.",
      shop: "Shop the collection",
      featured: "Meet the featured scent",
      strip: [
        "Authentic perfumes",
        "Delivery within Chad",
        "Fast ordering on WhatsApp",
      ],
    },

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

    searchLabel: "Rechercher dans la collection",
    searchPlaceholder: "Rechercher par nom ou maison…",
    searchNoResults: "Aucun parfum ne correspond — essayez un terme plus large ou retirez un filtre.",
    sortLabel: "Trier les parfums",
    sortDefault: "Ordre par défaut",
    sortPriceAsc: "Prix : croissant",
    sortPriceDesc: "Prix : décroissant",
    sortName: "Nom : A–Z",
    filterCategory: "Catégorie",
    filterHouseAll: "Toutes les maisons",
    filterSizeAll: "Toutes les tailles",
    filterPriceMax: "Prix jusqu'à",
    showMore: "Voir plus",

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
    inStock: "En stock",
    soldNowhere: "Actuellement indisponible dans nos succursales.",
    unavailable: "Indisponible",
    alsoEyebrow: "Vous aimerez aussi",
    alsoTitle: "Autres parfums",

    navHouse: "La maison",
    navContact: "Contact",
    navCart: "Panier",
    cartEmpty: "Votre panier est vide — choisissez un parfum de la collection.",
    cartClear: "Vider le panier",
    checkoutWhatsapp: "Finaliser la commande sur WhatsApp",
    remove: "Retirer un",
    qtyIncrease: "Ajouter un",
    qtyDecrease: "Retirer un",
    removeItem: "Retirer du panier",
    branchNoContact: "Le numéro de cette succursale n'est pas encore renseigné.",
    orderHello: "Bonjour, je souhaite commander ces parfums chez VALORY :",
    // « Boutique » et non « Succursale » : le nom de la succursale le porte
    // déjà, et « Succursale : Succursale du Tchad » se répète.
    orderBranch: "Boutique",
    orderTotal: "Total",
    orderSomeOnRequest: "(certains articles sont à prix sur demande, hors total)",
    orderAllOnRequest: "Ces articles sont à prix sur demande — merci de m'indiquer le total.",
    orderAsk: "Mes coordonnées de livraison :",
    orderName: "Nom",
    orderArea: "Quartier",
    orderAddress: "Adresse de livraison",
    orderItems: (n) => `Articles : ${n}`,
    orderVia: "Commande via le site VALORY",
    navChange: "Changer de succursale et de langue",

    heroEyebrow: "Maison de parfums",
    heroTitle: { lead: "L'Art du", em: "Parfum" },
    heroText:
      "Des extraits rares, assemblés à la main en petits lots. Chaque succursale a sa collection et ses prix.",
    heroCta: "Parcourir la collection",

    heroChad: {
      title: "Des parfums qui racontent l'âme du Tchad",
      text: "Découvrez une sélection de parfums d'exception, une fragrance pour chaque instant.",
      shop: "Découvrir la collection",
      featured: "Voir le parfum vedette",
      strip: [
        "Parfums authentiques",
        "Livraison au Tchad",
        "Commande rapide sur WhatsApp",
      ],
    },

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
  "12 مل": { en: "12 ml", fr: "12 ml" },
  "15 مل": { en: "15 ml", fr: "15 ml" },
  "25 مل": { en: "25 ml", fr: "25 ml" },
  "50 مل": { en: "50 ml", fr: "50 ml" },
  "100 مل": { en: "100 ml", fr: "100 ml" },
  "200 مل": { en: "200 ml", fr: "200 ml" },
  "250 مل": { en: "250 ml", fr: "250 ml" },
  "500 مل": { en: "500 ml", fr: "500 ml" },
  "1000 مل": { en: "1000 ml", fr: "1000 ml" },
  "25 جم": { en: "25 g", fr: "25 g" },
  "50 جم": { en: "50 g", fr: "50 g" },
  "100 جم": { en: "100 g", fr: "100 g" },
  "200 جم": { en: "200 g", fr: "200 g" },
  "500 جم": { en: "500 g", fr: "500 g" },
  "1000 جم": { en: "1000 g", fr: "1000 g" },
  "٢٥ جم · رول أون": { en: "25 g · roll-on", fr: "25 g · roll-on" },
};

// مددُ الثبات المعروضة في لوحة الإدخال — تُترجَم تلقائيًا فلا يكتبها
// صاحبُ المحل ثلاثَ مرّات. وما كُتب بيدٍ خارجَها يُعرض كما هو.
const LONGEVITY_TR: Record<string, Record<SecondLocale, string>> = {
  "2 – 4 ساعات": { en: "2 – 4 hours", fr: "2 – 4 heures" },
  "4 – 6 ساعات": { en: "4 – 6 hours", fr: "4 – 6 heures" },
  "6 – 8 ساعات": { en: "6 – 8 hours", fr: "6 – 8 heures" },
  "8 – 12 ساعة": { en: "8 – 12 hours", fr: "8 – 12 heures" },
  "أكثر من 12 ساعة": { en: "12+ hours", fr: "Plus de 12 heures" },
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
  سوماتي: "Sumati",
  النعيم: "Al-Nuaim",
  "شمس العربية": "Shams Arabia",
  "أستانا أريانا": "Astana Aryana",
  سيفكو: "Sifco",
  الرحاب: "Al Rehab",
  الجوهرجي: "Al Jawharji",
  "أستانا لاكجري": "Astana Luxury",
  شرفان: "Shurfan",
  فايزة: "Faiza",
};

export const trSize = (size: string, locale: Locale) =>
  locale === "ar" ? size : SIZE_TR[size]?.[locale] ?? size;

export const trLongevity = (longevity: string, locale: Locale) =>
  locale === "ar" ? longevity : LONGEVITY_TR[longevity]?.[locale] ?? longevity;

/** خياراتُ لوحة الإدخال — مصدرُها الجدولُ نفسه فلا يفترقان */
export const LONGEVITY_OPTIONS = Object.keys(LONGEVITY_TR);
export const SIZE_OPTIONS = Object.keys(SIZE_TR);

export const trBrand = (brand: string, locale: Locale) =>
  locale === "ar" ? brand : BRAND_TR[brand] ?? brand;

// فاصل الآلاف: فاصلةٌ في العربية والإنجليزية، ومسافةٌ في الفرنسية كما هو عرفها.
// النقطة ممنوعة: "1.180" تُقرأ خطأً على أنها 1.18.
export const formatNumber = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(value);
