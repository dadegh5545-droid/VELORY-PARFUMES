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
  trLongevity,
  trSize,
} from "./i18n";

export type Gender = "رجالي" | "نسائي" | "للجنسين";
export type Season = "صيفي" | "شتوي" | "لكل الفصول";
export type BranchId = "qatar" | "chad";

/** مشهدٌ من بلد الفرع، يقع خلف المحتوى.
 *  ليس زخرفةً: العطرُ يُشترى من مكانٍ له وجه، والمشهدُ يذكّر بأيّ بلدٍ
 *  يقف الزائر. ولكلِّ مشهدٍ اسمُ موضعه — صورةٌ بلا اسمٍ خلفيةٌ لا مكان. */
export type Scene = {
  /** النسخة العريضة (16:9) — خلف صدر القسم وصفحةِ العطر */
  image: string;
  /** النسخة الطولية (4:5) — خلف بطاقة العطر في الشبكة.
   *  نسختان لا واحدة: بطاقةٌ طوليةٌ تقصّ العريضةَ إلى خيطٍ لا منظرَ فيه. */
  card: string;
  /** اسم الموضع بالعربية — يوقَّع في ركن المشهد */
  place: string;
  /** اسم الموضع في اللغات اللاتينية */
  tr?: Partial<Record<SecondLocale, string>>;
  /** المصوّر ورخصتُه — شرطُ رخص المشاع الإبداعي، ويُعرض في تذييل الصفحة */
  credit: { by: string; license: string; source: string };
};

export type Branch = {
  id: BranchId;
  /** عنوان القسم في الصفحة الرئيسية */
  name: string;
  city: string;
  /** رمز العملة كما يُكتب بعد الرقم */
  currency: string;
  /** لغات الفرع: العربية أوّلًا ثم لغاته اللاتينية.
   *  كلا الفرعين يخاطب بالثلاث — فمن قصده بلسانٍ وجد مجموعته به. */
  locales: Locale[];
  /** اسم الفرع ومدينته وعملته في كلِّ لغةٍ لاتينية يخاطب بها */
  tr: Partial<
    Record<SecondLocale, { name: string; city: string; currency?: string }>
  >;
  tint: string;
  /** مشاهدُ بلد الفرع: أوّلُها خلف قسمه في الصفحة الأولى، وبقيّتُها
   *  تدور على صفحات عطوره — فلكلِّ عطرٍ منظرٌ من بلده لا منظرٌ واحد. */
  scenes?: Scene[];
  address?: string;
  /** الهاتف كما يُعرض للزبون، مثل: +974 5551 2345 */
  phone?: string;
  /** واتساب بصيغة دولية بلا + ولا مسافات، مثل: 97455512345 */
  whatsapp?: string;
  hours?: string;
  /** رابط المحل على خرائط جوجل */
  mapUrl?: string;
  /** معرّفُ عطرِ الواجهة — العطرُ الذي يقف في صدر الصفحة الأولى.
   *  غيّرِ المعرّفَ هنا فيتغيّر بطلُ الواجهة، ولا موضعَ آخرَ يُمسّ.
   *  ولا يُعرض إلا إن كان معروضًا في هذا الفرع وله صورة. */
  featured?: string;
};

// مشاهدُ تشاد — مواضعُ حقيقيةٌ بأسمائها، لا صورَ صحراءَ بلا نسب.
// الأوّلُ يفتح قسمَ الفرع، والبقيّةُ تدور على صفحات العطور بالترتيب
// الذي تراه هنا. أضِف مشهدًا فيدخل الدورةَ بلا تعديلٍ في مكانٍ آخر.
const CHAD_SCENES: Scene[] = [
  {
    image: "/scenes/guelta-archei.jpg",
    card: "/scenes/guelta-archei-card.jpg",
    place: "قلة أرشي · إنيدي",
    tr: { fr: "Guelta d’Archei · Ennedi", en: "Guelta d’Archei · Ennedi" },
    credit: {
      by: "anmede",
      license: "CC BY-SA 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Chad._Guelta_de_Archei_-_24930442767.jpg",
    },
  },
  {
    image: "/scenes/ounianga.jpg",
    card: "/scenes/ounianga-card.jpg",
    place: "بحيرات أونيانغا",
    tr: { fr: "Lacs d’Ounianga", en: "Ounianga Lakes" },
    credit: {
      by: "anmede",
      license: "CC BY-SA 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Lake_Yoa_2018_01.jpg",
    },
  },
  {
    image: "/scenes/ennedi-plateau.jpg",
    card: "/scenes/ennedi-plateau-card.jpg",
    place: "هضبة إنيدي",
    tr: { fr: "Plateau de l’Ennedi", en: "Ennedi Plateau" },
    credit: {
      by: "anmede",
      license: "CC BY-SA 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Ennedi_Plateau_(39815457451).jpg",
    },
  },
  {
    image: "/scenes/ennedi-maze.jpg",
    card: "/scenes/ennedi-maze-card.jpg",
    place: "متاهة إنيدي",
    tr: { fr: "Labyrinthe de l’Ennedi", en: "Ennedi Labyrinth" },
    credit: {
      by: "Valerian Guillot",
      license: "CC BY 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Camels_in_the_Labyrinthe_(Maze)_sandstone_area_of_the_Ennedi,_Chad_(42405451704).jpg",
    },
  },
  {
    image: "/scenes/guelta-maya.jpg",
    card: "/scenes/guelta-maya-card.jpg",
    place: "قلة مايا · إنيدي",
    tr: { fr: "Guelta Maya · Ennedi", en: "Guelta Maya · Ennedi" },
    credit: {
      by: "Sven.oehm",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Guelta_Maya,_Ennedi,_Tschad.jpg",
    },
  },
  {
    image: "/scenes/tibesti.jpg",
    card: "/scenes/tibesti-card.jpg",
    place: "جبال تيبستي",
    tr: { fr: "Massif du Tibesti", en: "Tibesti Mountains" },
    credit: {
      by: "Michael Kerling",
      license: "Public domain",
      source: "https://commons.wikimedia.org/wiki/File:Tibesti_east_of_bardai.jpg",
    },
  },
  {
    image: "/scenes/zakouma.jpg",
    card: "/scenes/zakouma-card.jpg",
    place: "حديقة زاكوما",
    tr: { fr: "Parc national de Zakouma", en: "Zakouma National Park" },
    credit: {
      by: "Yacoub Doungous",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Troupeau_de_Girafe_Dikala.jpg",
    },
  },
  {
    image: "/scenes/lake-chad.jpg",
    card: "/scenes/lake-chad-card.jpg",
    place: "بحيرة تشاد",
    tr: { fr: "Lac Tchad", en: "Lake Chad" },
    credit: {
      by: "Coolthoom1",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:An_evergreen_lake_chad_shore_(detilt).jpg",
    },
  },
];

/** كلُّ مشاهد الموقع — لصفحة الإسناد في التذييل */
export const ALL_SCENES = CHAD_SCENES;

// ترتيب الفروع هنا هو ترتيب ظهور الأقسام في الصفحة.
// املأ العنوان والهاتف والدوام: كل حقلٍ يُملأ يظهر سطرًا في بطاقة المحل،
// وما يبقى فارغًا لا يظهر أصلًا — فلا تُعرض على الزبون بيانات ناقصة.
export const BRANCHES: Branch[] = [
  {
    id: "qatar",
    name: "فرع قطر",
    city: "الدوحة",
    currency: "ر.ق",
    locales: ["ar", "en", "fr"],
    tr: {
      en: { name: "Qatar Branch", city: "Doha", currency: "QAR" },
      fr: { name: "Succursale du Qatar", city: "Doha", currency: "QAR" },
    },
    tint: "rgba(140, 35, 65, 0.26)",
  },
  {
    id: "chad",
    name: "فرع تشاد",
    city: "نجامينا",
    currency: "FCFA",
    locales: ["ar", "fr", "en"],
    tr: {
      fr: { name: "Succursale du Tchad", city: "N’Djamena" },
      en: { name: "Chad Branch", city: "N’Djamena" },
    },
    tint: "rgba(60, 115, 165, 0.26)",
    scenes: CHAD_SCENES,
    // تواصلُ نجامينا وحدها: طلبُ فرعٍ يذهب إلى هاتف ذلك الفرع لا غيره.
    // قطرُ بلا رقمٍ بعد، فتبقى بطاقةُ محلّها مخفيّةً حتى يُملأ.
    phone: "+235 66 78 59 03",
    whatsapp: "23566785903",
    // دبّوسُ المحلّ بإحداثيّاته لا باسمه: الاسمُ قد لا يكون مسجَّلًا في جوجل،
    // والإحداثيّةُ تصل إلى الباب. ولا `hl=` في الرابط — فرضُ لغةٍ على الخريطة
    // يفتحها بالعربية في يد زبونٍ فرنسيّ اللسان، وتركُها يتبع لغةَ جهازه.
    mapUrl: "https://www.google.com/maps?q=12.1142871,15.0559209&z=17",
    featured: "thaljee",
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
    branches: { chad: { price: 1200 } },
  },
  {
    id: "bushra",
    name: "بشرى",
    latin: "Bushra 53",
    brand: "نسيم",
    size: "100 مل",
    tint: "rgba(160, 190, 110, 0.24)",
    image: "/products/bushra.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "be-sugar",
    name: "بي شوقر",
    latin: "Be Sugar",
    brand: "نسيم",
    size: "100 مل",
    tint: "rgba(215, 140, 80, 0.24)",
    image: "/products/be-sugar.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "baccarat-rouge",
    name: "بكارات روج ٥٤٠",
    latin: "Baccarat Rouge 540",
    brand: "الماس",
    tint: "rgba(200, 55, 60, 0.28)",
    image: "/products/baccarat-rouge.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "black-opum",
    name: "بلاك أوبيوم",
    latin: "Black Opum",
    brand: "الماس",
    size: "100 جم",
    tint: "rgba(160, 110, 95, 0.26)",
    image: "/products/black-opum.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "pares",
    name: "باريس",
    latin: "Pares",
    brand: "الماس",
    tint: "rgba(150, 90, 160, 0.24)",
    image: "/products/pares.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "moon-paris",
    name: "مون باريس",
    latin: "Moon Paris",
    brand: "الشندغة",
    size: "100 مل",
    tint: "rgba(215, 175, 80, 0.28)",
    image: "/products/moon-paris.jpg",
    branches: { chad: { price: 1600 } },
  },
  {
    id: "sahrawi",
    name: "سحراوي",
    latin: "Sahrawi",
    size: "100 مل",
    tint: "rgba(190, 150, 110, 0.24)",
    image: "/products/sahrawi.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "hawaas",
    name: "حواس",
    latin: "Hawaas",
    brand: "الكوثر",
    size: "100 جم",
    tint: "rgba(170, 175, 180, 0.22)",
    image: "/products/hawaas.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "ehsaas-al-arabia",
    name: "إحساس العربية",
    latin: "Ehsaas Al Arabia",
    brand: "الكوثر",
    tint: "rgba(140, 120, 70, 0.26)",
    image: "/products/ehsaas-al-arabia.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "djohara",
    name: "جوهرة",
    latin: "Djohara",
    brand: "كندل للعطور",
    tint: "rgba(165, 170, 175, 0.22)",
    image: "/products/djohara.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "oud-bouquet",
    name: "عود بوكيه",
    latin: "Oud Bouquet",
    brand: "كندل للعطور",
    tint: "rgba(200, 60, 140, 0.26)",
    image: "/products/oud-bouquet.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "jawhara",
    name: "جواهر",
    latin: "Jawhara",
    size: "100 مل",
    tint: "rgba(220, 110, 90, 0.26)",
    image: "/products/jawhara.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "chamar",
    name: "شمار",
    latin: "Chamar",
    brand: "هريرة ٧",
    size: "100 جم",
    tint: "rgba(190, 150, 70, 0.28)",
    image: "/products/chamar.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "jagvar-gold",
    name: "جاكوار ذهب",
    latin: "Jagvar Gold",
    brand: "هريرة ٧",
    size: "٢٥ جم · رول أون",
    tint: "rgba(205, 165, 60, 0.30)",
    image: "/products/jagvar-gold.jpg",
    branches: { chad: { price: 3000 } },
  },
  {
    id: "jedare",
    name: "جيدار",
    latin: "Jedare",
    brand: "بيرفكت تريدنغ",
    size: "100 جم",
    tint: "rgba(200, 80, 60, 0.24)",
    image: "/products/jedare.jpg",
    branches: { chad: { price: 800 } },
  },
  {
    id: "yaqoot-sandal",
    name: "ياقوت صندل",
    latin: "Yaqoot Sandal",
    brand: "زارا ٧",
    size: "100 جم",
    tint: "rgba(205, 65, 55, 0.26)",
    image: "/products/yaqoot-sandal.jpg",
    branches: { chad: { price: 800 } },
  },
  {
    id: "munjaro",
    name: "منجارو",
    latin: "Munjaro",
    brand: "أستانا ميلانو",
    tint: "rgba(200, 60, 50, 0.28)",
    image: "/products/munjaro.jpg",
    branches: { chad: { price: 800 } },
  },
  {
    id: "sandaliyah",
    name: "صندلية",
    latin: "Sandaliyah",
    size: "100 مل",
    tint: "rgba(160, 45, 90, 0.28)",
    image: "/products/sandaliyah.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "zam-sandaliyah",
    name: "صندلية زمزم",
    latin: "Zam Sandaliyah",
    brand: "زمزم للعطور",
    size: "500 مل",
    tint: "rgba(70, 150, 80, 0.26)",
    image: "/products/zam-sandaliyah.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "anoud-sandaliyah",
    name: "صندلية العنود",
    latin: "Al Anoud Sandaliyah",
    brand: "عطورات العنود",
    tint: "rgba(215, 120, 160, 0.24)",
    image: "/products/anoud-sandaliyah.jpg",
    branches: { chad: { price: 4500 } },
  },
  {
    id: "sandal-zafran",
    name: "صندل زعفران",
    latin: "Sandal Zafran",
    tint: "rgba(200, 150, 90, 0.24)",
    image: "/products/sandal-zafran.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "al-mataf-oud",
    name: "عود المطاف",
    latin: "Al-Mataf Oud",
    tint: "rgba(175, 130, 95, 0.26)",
    image: "/products/al-mataf-oud.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "oud-chips",
    name: "عود خام",
    latin: "Oud Chips",
    // وصفٌ لا علامةٌ تجارية، فيُترجم
    tr: { fr: { name: "Copeaux d'oud brut" } },
    tint: "rgba(150, 110, 70, 0.26)",
    image: "/products/oud-chips.jpg",
    branches: { chad: { price: 800 } },
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
    branches: { chad: { price: 600 } },
  },

  /* ــــــــ دفعةُ نجامينا الثانية ــــــــ
     كولونيات ومركّزات وبخور من رفوف فرع تشاد. البيانات هنا مقروءةٌ من
     الملصق في الصورة ولا شيء غيرها: ما لم يُطبع على العبوة يبقى فارغًا. */
  {
    id: "barakat",
    name: "بركات",
    latin: "Barakat",
    size: "1100 مل",
    tint: "rgba(210, 172, 35, 0.26)",
    image: "/products/barakat.jpg",
    branches: { chad: { price: 400 } },
  },
  {
    id: "al-zuhur",
    name: "زهرة الأقصى",
    latin: "Al Zuhur",
    brand: "شركة زهرة الأقصى للعطور",
    size: "1000 مل",
    tint: "rgba(55, 105, 195, 0.26)",
    image: "/products/al-zuhur.jpg",
    branches: { chad: { price: 1000 } },
  },
  {
    id: "de-amour",
    name: "دأمور",
    latin: "De Amour",
    size: "1000 مل",
    tint: "rgba(210, 179, 140, 0.26)",
    image: "/products/de-amour.jpg",
    branches: { chad: { price: 1000 } },
  },
  {
    id: "noor-iman",
    name: "نور إيمان",
    latin: "Noor Iman",
    size: "500 مل",
    tint: "rgba(210, 109, 48, 0.26)",
    image: "/products/noor-iman.jpg",
    branches: { chad: { price: 400 } },
  },
  {
    id: "soir-de-paris",
    name: "سوار دو باري",
    latin: "Soir de Paris",
    size: "100 مل",
    tint: "rgba(50, 80, 190, 0.26)",
    image: "/products/soir-de-paris.jpg",
    branches: { chad: { price: 1000 } },
  },
  {
    id: "reve-dore",
    name: "ريف دوريه",
    latin: "Rêve Doré",
    tint: "rgba(210, 204, 153, 0.26)",
    image: "/products/reve-dore.jpg",
    branches: { chad: { price: 400 } },
  },
  {
    id: "reva-dor-70",
    name: "ريفا دور ٧٠",
    latin: "Rêva d'or 70",
    brand: "L.T. Piver",
    size: "423 مل",
    tint: "rgba(45, 75, 185, 0.26)",
    image: "/products/reva-dor-70.jpg",
    branches: { chad: { price: 1000 } },
  },
  {
    id: "ramage",
    name: "راماج",
    latin: "Ramage",
    brand: "Bonjours",
    tint: "rgba(150, 195, 210, 0.26)",
    image: "/products/ramage.jpg",
    branches: { chad: { price: 1000 } },
  },
  {
    id: "fleurs-damour",
    name: "فلور دامور",
    latin: "Fleurs d'Amour",
    brand: "R.G Paris",
    tint: "rgba(180, 60, 70, 0.26)",
    image: "/products/fleurs-damour.jpg",
    branches: { chad: { price: 3000 } },
  },
  {
    id: "drabel-concentrate",
    name: "درابيل",
    latin: "Drabel",
    // «Perfume Concentrate» على الملصق — وصفٌ لا علامة، فيُترجم
    tr: { fr: { name: "Drabel — concentré de parfum" } },
    tint: "rgba(200, 195, 190, 0.26)",
    image: "/products/drabel-concentrate.jpg",
    branches: { chad: { price: 9500 } },
  },
  {
    id: "chance-concentrate",
    name: "شانس",
    latin: "Chance",
    tint: "rgba(205, 190, 185, 0.26)",
    image: "/products/chance-concentrate.jpg",
    branches: { chad: { price: 21000 } },
  },
  {
    id: "hemani-sandal-powder",
    name: "بخور الصندل مسحوق",
    latin: "Sandal Bakhour Powder",
    brand: "هيماني",
    tr: { fr: { name: "Bakhour de santal en poudre" } },
    tint: "rgba(210, 154, 71, 0.26)",
    image: "/products/hemani-sandal-powder.jpg",
    branches: { chad: { price: 300 } },
  },
  {
    id: "rayhan-sandal-bakhour",
    name: "ريحان — بخور صندل",
    latin: "Rayhan Sandal Bakhour Powder",
    brand: "شركة ناصر علي للتجارة العامة",
    size: "200 جم",
    tint: "rgba(210, 166, 102, 0.26)",
    image: "/products/rayhan-sandal-bakhour.jpg",
    branches: { chad: { price: 200 } },
  },
  {
    id: "mysoor-sandalwood",
    name: "صندل ميسور",
    latin: "Mysoor Sandalwood",
    size: "1 كجم",
    tint: "rgba(214, 171, 137, 0.26)",
    image: "/products/mysoor-sandalwood.jpg",
    branches: { chad: { price: 1400 } },
  },
  {
    id: "sandal-red-wood",
    name: "صندل أحمر",
    latin: "Sandal Red Wood",
    brand: "Krishna Perfume Roll's",
    tr: { fr: { name: "Bois de santal rouge" } },
    tint: "rgba(190, 85, 80, 0.26)",
    image: "/products/sandal-red-wood.jpg",
    branches: { chad: { price: 4000 } },
  },
  {
    id: "white-musk",
    // الكيس بلا ملصق، والاسمُ من صاحب المحل لا من العبوة.
    name: "مسك أبيض",
    latin: "White Musk",
    tr: { fr: { name: "Musc blanc" } },
    tint: "rgba(208, 210, 202, 0.26)",
    image: "/products/white-musk.jpg",
    branches: { chad: { price: 2500 } },
  },
  {
    id: "hemani-wood-chips",
    name: "قشرة صندل — علبة",
    latin: "Sandal Oil Wood Chips",
    brand: "هيماني",
    tr: { fr: { name: "Copeaux de bois de santal — coffret" } },
    tint: "rgba(70, 165, 85, 0.26)",
    image: "/products/hemani-wood-chips.jpg",
    branches: { chad: { price: 1200 } },
  },

  /* ــــــــ دفعةُ نجامينا الثالثة ــــــــ
     الأسماءُ والدُّورُ منقولةٌ عمّا هو مطبوعٌ على العبوة في الصورة،
     وما لم يُقرأ من حجمٍ أو غيره تُرك فارغًا فلا تعرضه الواجهة. */
  {
    id: "way",
    name: "وواي",
    latin: "Way",
    brand: "سوماتي",
    tint: "rgba(205, 180, 75, 0.26)",
    image: "/products/way.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "jawharat-sandal",
    name: "جوهرة صندل",
    latin: "Jawharat Sandal",
    brand: "أستانا ميلانو",
    tint: "rgba(195, 75, 60, 0.26)",
    image: "/products/jawharat-sandal.jpg",
    branches: { chad: { price: 600 } },
  },
  {
    id: "sumati-arabia",
    name: "العربية",
    latin: "Arabia",
    brand: "سوماتي",
    tint: "rgba(200, 185, 95, 0.24)",
    image: "/products/sumati-arabia.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "oud-chips-bag",
    name: "عود خام — كيس",
    latin: "Oud Chips",
    // وصفٌ لا علامةٌ تجارية، فيُترجم
    tr: { fr: { name: "Copeaux d'oud brut — sachet" } },
    tint: "rgba(150, 105, 60, 0.28)",
    image: "/products/oud-chips-bag.jpg",
    branches: { chad: { price: 15000 } },
  },
  {
    id: "kashmiri-oudh",
    name: "عود كشميري",
    latin: "Kashmiri Oudh",
    brand: "النعيم",
    size: "100 جم",
    tint: "rgba(180, 130, 50, 0.28)",
    image: "/products/kashmiri-oudh.jpg",
    branches: { chad: { price: 1000 } },
  },
  {
    id: "sandal-arais",
    name: "صندل العرايس",
    latin: "Sandal Arais",
    tint: "rgba(205, 155, 50, 0.28)",
    image: "/products/sandal-arais.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "harera-7",
    name: "هريرة ٧",
    latin: "Harera 7",
    brand: "شمس العربية",
    tint: "rgba(60, 95, 155, 0.26)",
    image: "/products/harera-7.jpg",
    branches: { chad: { price: 1000 } },
  },
  {
    id: "jawhara-mahabba",
    name: "جواهر محبة",
    latin: "Jawhara Mahabba",
    brand: "أستانا أريانا",
    size: "100 مل",
    tint: "rgba(120, 185, 145, 0.24)",
    image: "/products/jawhara-mahabba.jpg",
    branches: { chad: { price: 600 } },
  },
  {
    id: "jawhara-harera",
    name: "جوهرة هريرة",
    latin: "Jawhara",
    brand: "هريرة ٧",
    tint: "rgba(200, 180, 130, 0.24)",
    image: "/products/jawhara-harera.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "goosy",
    name: "قوسي",
    latin: "Goosy",
    brand: "سيفكو",
    tint: "rgba(70, 130, 200, 0.26)",
    image: "/products/goosy.jpg",
    branches: { chad: { price: 800 } },
  },
  {
    id: "zafran",
    name: "زعفران",
    latin: "Zafran",
    size: "100 مل",
    tint: "rgba(198, 70, 45, 0.28)",
    image: "/products/zafran.jpg",
    branches: { chad: { price: 800 } },
  },
  {
    id: "wild-fawakeh",
    name: "وايلد فواكه",
    latin: "Wild Fawakeh",
    brand: "الماس",
    tint: "rgba(220, 105, 120, 0.26)",
    image: "/products/wild-fawakeh.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "oud-collection",
    name: "عود كولكشن",
    latin: "Oud Collection",
    brand: "الماس",
    tint: "rgba(172, 45, 55, 0.26)",
    image: "/products/oud-collection.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "farfasha",
    name: "فرفشة",
    latin: "Farfasha",
    brand: "الرحاب",
    tint: "rgba(172, 182, 178, 0.22)",
    image: "/products/farfasha.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "oud-class",
    name: "عود كلاس",
    latin: "Oud Class",
    brand: "الجوهرجي",
    tint: "rgba(125, 80, 165, 0.26)",
    image: "/products/oud-class.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "sandaliyah-5",
    name: "صندلية ٥",
    latin: "Sandaliyah 5",
    brand: "عطورات العنود",
    tint: "rgba(222, 130, 175, 0.26)",
    image: "/products/sandaliyah-5.jpg",
    branches: { chad: { price: 4000 } },
  },
  {
    id: "sandal-rose",
    name: "صندل روز",
    latin: "Sandal Rose",
    brand: "سيفكو",
    tint: "rgba(215, 140, 150, 0.24)",
    image: "/products/sandal-rose.jpg",
    branches: { chad: { price: 1500 } },
  },
  {
    id: "meraj",
    name: "معراج",
    latin: "Meraj",
    brand: "أستانا لاكجري",
    size: "100 مل",
    tint: "rgba(165, 40, 60, 0.24)",
    image: "/products/meraj.jpg",
    branches: { chad: { price: 1200 } },
  },
  {
    id: "kasar-al-sreer",
    name: "كسر السرير",
    latin: "Kasar Al Sreer",
    brand: "شرفان",
    tint: "rgba(185, 160, 90, 0.24)",
    image: "/products/kasar-al-sreer.jpg",
    branches: { chad: { price: 2000 } },
  },
  {
    id: "attar-sandal-faiza",
    name: "عطر صندل فايزة",
    latin: "Attar Sandal Faiza 6",
    brand: "فايزة",
    tint: "rgba(152, 35, 45, 0.26)",
    image: "/products/attar-sandal-faiza.jpg",
    branches: { chad: { price: 4000 } },
  },
  {
    id: "najdiya",
    name: "نجدية",
    latin: "Najdiya",
    size: "100 مل",
    tint: "rgba(168, 155, 140, 0.26)",
    image: "/products/najdiya.jpg",
    branches: { chad: { price: 1500 } },
  },
];

export const getBranch = (id: BranchId) => BRANCHES.find((b) => b.id === id);

/* ــــــــ المشاهد ــــــــ */

/** اسم موضع المشهد بلغة الزائر — والعربيةُ إن لم يُترجَم */
export const scenePlace = (s: Scene, locale: Locale) =>
  locale === "ar" ? s.place : s.tr?.[locale as SecondLocale] ?? s.place;

/** مشهدُ قسم الفرع في الصفحة الأولى — أوّلُ مشاهده */
export const branchScene = (b: Branch): Scene | undefined => b.scenes?.[0];

/**
 * مشهدُ صفحة العطر.
 *
 * **بلا مستهلكٍ منذ 2026-08-07:** أُزيل المشهدُ من صدر صفحة التفاصيل
 * بطلب المستخدم وحلَّ محلَّه سوادٌ وإضاءةٌ ذهبية، فبقيت الدالةُ هنا
 * ليعود المنظرُ بسطرٍ واحدٍ إن طُلب. لا تبنِ عليها جديدًا قبل أن يُطلَب.
 *
 * يُشتقّ من حروف المعرّف لا من ترتيبه في الكتالوج: العطرُ الواحد يفتح
 * على موضعه نفسِه في كلِّ زيارة، ولا تتبدّل المناظرُ كلُّها لأن عطرًا
 * أُدرج قبله. ويُستثنى الأوّل — هو مشهدُ القسم، فلا يُعاد هنا.
 */
export const perfumeScene = (p: Perfume): Scene | undefined => {
  const scenes = branchesOf(p).flatMap((b) => b.scenes ?? []);
  if (!scenes.length) return undefined;

  const rest = scenes.length > 1 ? scenes.slice(1) : scenes;
  // حلقةٌ لا نشرٌ للنصّ: النشرُ يطلب downlevelIteration وهدفُ البناء دونه.
  // ومجموعُ الحروف وحده يكدّس المعرّفاتِ المتقاربة في مشهدٍ واحد، فيُخلط
  // بضربٍ في عددٍ أوّليّ: توزيعٌ أعدلُ على المشاهد، وثباتٌ لكلِّ معرّف.
  let h = 0;
  for (let i = 0; i < p.id.length; i++) {
    h = (h * 31 + p.id.charCodeAt(i)) >>> 0;
  }
  return rest[h % rest.length];
};

export const getPerfume = (id: string) => CATALOG.find((p) => p.id === id);

/**
 * عطرُ واجهة الفرع.
 *
 * ثلاثةُ شروطٍ لا واحد: أن يكون المعرّف مملوءًا، وأن يكون العطرُ معروضًا
 * في هذا الفرع، وأن تكون له صورة. فلو حُذف العطرُ من الفرع أو أُخرج من
 * الكتالوج سقطت الواجهةُ إلى صورتها المجرّدة ولم تُعرض عبوةُ عطرٍ لا
 * يُباع هناك — ولا تُعرض القارورةُ المرسومة بديلًا، فبطلُ الواجهة صورة.
 */
export const featuredOf = (b: Branch): Perfume | undefined => {
  if (!b.featured) return undefined;
  const p = getPerfume(b.featured);
  return p && p.image && p.branches[b.id] ? p : undefined;
};

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
 *  صار الفرعان يخاطبان بالثلاث، فلا يقع السقوط اليوم — ويبقى حارسًا
 *  لفرعٍ يُضاف غدًا بألسنةٍ أقلّ. والعربيةُ ملجؤه: هي أصلُ المحتوى. */
const spoken = (b: Branch, locale: Locale): Locale =>
  b.locales.includes(locale) ? locale : "ar";

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

/** الثبات: المترجَمُ يدًا أولًا، وإلا فمقابلُ المدّة المعروفة، وإلا فالعربيّ كما كُتب */
const perfumeLongevity = (p: Perfume, locale: Locale) =>
  locale === "ar"
    ? p.longevity
    : p.tr?.[locale as SecondLocale]?.longevity ??
      (p.longevity && trLongevity(p.longevity, locale));

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
