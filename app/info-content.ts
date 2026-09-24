// محتوى الصفحات التعريفية — بالثلاث لغات، ومصدرُه حقائقُ الموقع نفسِه:
// لا سعرَ توصيلٍ مخترع، ولا سياسةَ إرجاعٍ بأرقامٍ لم يقرّها صاحبُ المحل،
// ولا رقمَ هاتفٍ هنا (الأرقام في catalog.ts وحده). ما لا يُعرف يُحال إلى
// واتساب الفرع بدل أن يُملأ بتخمين.

import type { Locale } from "./i18n";

export type InfoKey =
  | "about"
  | "contact"
  | "delivery"
  | "returns"
  | "privacy"
  | "terms"
  | "faq"
  | "credits";

export type InfoSection = { heading?: string; body: string[] };
export type InfoContent = { title: string; intro?: string; sections: InfoSection[] };

/** روابطُ التذييل بترتيبها — مسارٌ لكلِّ مفتاح، وعنوانُه يُقرأ من INFO */
export const INFO_LINKS: { key: InfoKey; path: string }[] = [
  { key: "about", path: "/about" },
  { key: "contact", path: "/contact" },
  { key: "delivery", path: "/delivery" },
  { key: "returns", path: "/returns" },
  { key: "faq", path: "/faq" },
  { key: "privacy", path: "/privacy" },
  { key: "terms", path: "/terms" },
  { key: "credits", path: "/credits" },
];

export const INFO: Record<Locale, Record<InfoKey, InfoContent>> = {
  ar: {
    about: {
      title: "عن فالوري",
      intro:
        "فالوري — متجرُ عطورٍ مختارة في نجامينا، نجمع لك أفضلَ العطور الشرقية والعالمية بأسعار الفرع.",
      sections: [
        {
          heading: "متجرٌ في نجامينا",
          body: [
            "متجرُ فالوري في نجامينا بتشاد، وأسعارُه بالفرنك الأفريقي (FCFA).",
            "مجموعتُنا كاملةً معروضةٌ على الموقع، ويصلك الطلبُ عبر واتساب أو من المحلّ مباشرةً.",
          ],
        },
        {
          heading: "اختيارٌ لا خلط",
          body: [
            "نختار ما نعرضه من دُورِ عطورٍ شرقيةٍ وعالمية. وما لا نعرفه عن منتجٍ نتركه فارغًا بدل أن نملأه بتخمين.",
          ],
        },
      ],
    },
    contact: {
      title: "تواصل معنا",
      intro:
        "أقربُ طريقٍ إلينا واتسابُ الفرع — نستقبل طلبك ونرتّب التوصيل في المحادثة نفسِها.",
      sections: [
        {
          heading: "قنواتُ كلِّ فرع",
          body: ["اختر فرعك أدناه للتواصل معه مباشرة."],
        },
      ],
    },
    delivery: {
      title: "التوصيل",
      intro: "نوصّل داخل تشاد انطلاقًا من فرع نجامينا.",
      sections: [
        {
          heading: "كيف يتمّ",
          body: [
            "بعد اختيار عطورك، أتمم الطلب عبر واتساب. نتّفق معك على المنطقة والعنوان وتفاصيل التوصيل داخل المحادثة.",
          ],
        },
        {
          heading: "الرسوم والمدّة",
          body: [
            "تختلف رسومُ التوصيل ومدّتُه باختلاف المنطقة — نبيّنها لك على واتساب قبل أن تؤكّد طلبك.",
          ],
        },
      ],
    },
    returns: {
      title: "الاستبدال والإرجاع",
      intro: "يهمّنا رضاك عن كلِّ طلب.",
      sections: [
        {
          heading: "إن كان في طلبك خطأ",
          body: [
            "إن وصلك صنفٌ خاطئ أو تالف، تواصل معنا عبر واتساب الفرع في أقرب وقتٍ ومعك صورةٌ للمنتج، ونعالج الأمر معك.",
          ],
        },
        {
          heading: "قبل الإرسال",
          body: [
            "لأن العطور منتجاتٌ حسّاسة، نراجع معك تفاصيل طلبك على واتساب قبل الإرسال ليصلك كما تريد.",
          ],
        },
      ],
    },
    privacy: {
      title: "الخصوصية",
      intro: "يجمع هذا الموقع أقلَّ ما يمكن — ولا ينشئ لك حسابًا.",
      sections: [
        {
          heading: "ما يُحفظ في جهازك",
          body: [
            "اختيارُك للفرع واللغة ومحتوى سلّتك يُحفظ في متصفّحك وحده، فلا يُرسل إلى خادمٍ ولا نطّلع عليه. امسح بيانات الموقع في متصفّحك ليُمحى.",
          ],
        },
        {
          heading: "الطلب عبر واتساب",
          body: [
            "حين تُتمّ الطلب تُفتح محادثةُ واتساب وتُرسل رسالتُك عبره وفق سياسة خصوصيته هو. وما تكتبه من اسمٍ وعنوانٍ يصل تاجرَ الفرع لإتمام التوصيل وحده.",
          ],
        },
        {
          heading: "التحليلات",
          body: [
            "إن فُعّلت التحليلات فهي خدمةٌ خفيفةٌ بلا كوكيز ولا تحديدٍ لهويتك، وقد تكون غيرَ مفعّلةٍ أصلًا.",
          ],
        },
      ],
    },
    terms: {
      title: "شروط الاستخدام",
      sections: [
        {
          heading: "الأسعار والتوفّر",
          body: [
            "الأسعارُ والتوفّرُ معروضةٌ لكلِّ فرعٍ بعملته وقد تتغيّر. ونؤكّد الطلبَ وسعرَه النهائيَّ معك على واتساب قبل الإرسال.",
          ],
        },
        {
          heading: "الطلبات",
          body: [
            "إتمامُ الطلب عبر واتساب دعوةٌ للتواصل لا عقدًا مكتملًا؛ يصير الطلبُ نافذًا حين نؤكّده معك.",
          ],
        },
        {
          heading: "الملكية",
          body: [
            "اسمُ فالوري وشعارُها وصورُ المنتجات للدار. أمّا صورُ المشاهد الطبيعية فمن ويكيميديا كومنز بمصوّريها ورخصها — انظر صفحة حقوق الصور.",
          ],
        },
      ],
    },
    faq: {
      title: "أسئلة شائعة",
      sections: [
        {
          heading: "كيف أطلب؟",
          body: [
            "اختر عطورك وأضِفها إلى السلة، ثم أتمم الطلب عبر واتساب الفرع. نرتّب التوصيل والدفع في المحادثة.",
          ],
        },
        {
          heading: "أين متجركم؟",
          body: ["متجرُ فالوري في نجامينا بتشاد، وهو المتجرُ الوحيد حاليًّا."],
        },
        {
          heading: "بأيّ لغةٍ أتصفّح؟",
          body: [
            "العربية والفرنسية والإنجليزية — تختار لغتك من شاشة الترحيب أو من الترويسة.",
          ],
        },
        {
          heading: "هل العطور أصلية؟",
          body: ["نعرض ما نثق بأصالته، وبياناتُ كلِّ منتجٍ مقروءةٌ عن عبوته."],
        },
        {
          heading: "بأيّ عملةٍ الأسعار؟",
          body: ["بعملة كلِّ فرع: الفرنك (FCFA) في نجامينا."],
        },
      ],
    },
    credits: {
      title: "حقوق الصور",
      intro:
        "صورُ المشاهد الطبيعية من ويكيميديا كومنز، ولكلٍّ مصوّرُها ورخصتُها — شرطُ الرخصة لا مجاملة.",
      sections: [],
    },
  },

  en: {
    about: {
      title: "About VALORY",
      intro:
        "VALORY is a curated perfume store in N'Djamena — we bring together the finest Oriental and international fragrances at branch prices.",
      sections: [
        {
          heading: "A store in N'Djamena",
          body: [
            "The VALORY store is in N'Djamena, Chad, and its prices are in Central African francs (FCFA).",
            "Our full collection is shown on this site; your order reaches us on WhatsApp, or you can buy at the store itself.",
          ],
        },
        {
          heading: "Selected, not blended",
          body: [
            "We choose what we offer from Oriental and international perfume houses. What we don't know about a product we leave blank rather than fill with a guess.",
          ],
        },
      ],
    },
    contact: {
      title: "Contact us",
      intro:
        "The quickest way to reach us is the branch's WhatsApp — we take your order and arrange delivery in the same conversation.",
      sections: [
        { heading: "Each branch's channels", body: ["Choose your branch below to reach it directly."] },
      ],
    },
    delivery: {
      title: "Delivery",
      intro: "We deliver within Chad from the N'Djamena branch.",
      sections: [
        {
          heading: "How it works",
          body: [
            "After choosing your perfumes, complete the order on WhatsApp. We agree on the area, address and delivery details right in the chat.",
          ],
        },
        {
          heading: "Fees and timing",
          body: [
            "Delivery fees and timing vary by area — we confirm them with you on WhatsApp before you confirm your order.",
          ],
        },
      ],
    },
    returns: {
      title: "Returns and exchanges",
      intro: "Your satisfaction with every order matters to us.",
      sections: [
        {
          heading: "If something is wrong",
          body: [
            "If you receive a wrong or damaged item, contact the branch on WhatsApp as soon as possible with a photo of the product, and we'll sort it out with you.",
          ],
        },
        {
          heading: "Before we ship",
          body: [
            "Because perfumes are delicate, we review your order details with you on WhatsApp before shipping so it arrives as you want.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy",
      intro: "This site collects as little as possible — and creates no account for you.",
      sections: [
        {
          heading: "What is stored on your device",
          body: [
            "Your branch and language choice and your cart are stored in your browser only; they are not sent to a server and we do not see them. Clear the site's data in your browser to erase them.",
          ],
        },
        {
          heading: "Ordering on WhatsApp",
          body: [
            "When you complete an order, WhatsApp opens and your message is sent through it under its own privacy policy. The name and address you write reach the branch merchant solely to arrange delivery.",
          ],
        },
        {
          heading: "Analytics",
          body: [
            "If analytics is enabled, it is a lightweight service with no cookies and no identification of you — and it may not be enabled at all.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of use",
      sections: [
        {
          heading: "Prices and availability",
          body: [
            "Prices and availability are shown per branch in its currency and may change. We confirm the order and its final price with you on WhatsApp before shipping.",
          ],
        },
        {
          heading: "Orders",
          body: [
            "Completing an order on WhatsApp is an invitation to talk, not a finished contract; the order becomes binding once we confirm it with you.",
          ],
        },
        {
          heading: "Ownership",
          body: [
            "The VALORY name, logo and product images belong to the house. The landscape photos are from Wikimedia Commons with their photographers and licenses — see the image credits page.",
          ],
        },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      sections: [
        {
          heading: "How do I order?",
          body: [
            "Pick your perfumes and add them to the cart, then complete the order on the branch's WhatsApp. We arrange delivery and payment in the chat.",
          ],
        },
        {
          heading: "Where is your store?",
          body: ["The VALORY store is in N'Djamena, Chad — our only store at present."],
        },
        {
          heading: "In which language can I browse?",
          body: ["Arabic, French and English — choose yours on the welcome screen or from the header."],
        },
        {
          heading: "Are the perfumes authentic?",
          body: ["We offer what we trust to be authentic, and each product's data is read from its packaging."],
        },
        {
          heading: "In which currency are prices?",
          body: ["In each branch's currency: the franc (FCFA) in N'Djamena."],
        },
      ],
    },
    credits: {
      title: "Image credits",
      intro:
        "The landscape photos are from Wikimedia Commons, each with its photographer and license — a licence requirement, not a courtesy.",
      sections: [],
    },
  },

  fr: {
    about: {
      title: "À propos de VALORY",
      intro:
        "VALORY est une parfumerie sélective à N'Djamena — nous réunissons pour vous les meilleurs parfums orientaux et internationaux aux prix de la succursale.",
      sections: [
        {
          heading: "Une boutique à N'Djamena",
          body: [
            "La boutique VALORY se trouve à N'Djamena, au Tchad, et ses prix sont en francs CFA (FCFA).",
            "Notre collection complète est présentée sur ce site ; votre commande nous parvient sur WhatsApp, ou vous achetez directement en boutique.",
          ],
        },
        {
          heading: "Une sélection, pas un assemblage",
          body: [
            "Nous choisissons ce que nous proposons auprès de maisons de parfums orientales et internationales. Ce que nous ignorons d'un produit, nous le laissons vide plutôt que de le deviner.",
          ],
        },
      ],
    },
    contact: {
      title: "Nous contacter",
      intro:
        "Le plus court chemin vers nous est le WhatsApp de la succursale — nous recevons votre commande et organisons la livraison dans la même conversation.",
      sections: [
        {
          heading: "Les canaux de chaque succursale",
          body: ["Choisissez votre succursale ci-dessous pour la joindre directement."],
        },
      ],
    },
    delivery: {
      title: "Livraison",
      intro: "Nous livrons au Tchad depuis la succursale de N'Djamena.",
      sections: [
        {
          heading: "Comment ça marche",
          body: [
            "Après avoir choisi vos parfums, finalisez la commande sur WhatsApp. Nous convenons du quartier, de l'adresse et des détails de livraison dans la conversation.",
          ],
        },
        {
          heading: "Frais et délais",
          body: [
            "Les frais et les délais de livraison varient selon le quartier — nous vous les confirmons sur WhatsApp avant que vous ne validiez votre commande.",
          ],
        },
      ],
    },
    returns: {
      title: "Retours et échanges",
      intro: "Votre satisfaction sur chaque commande nous tient à cœur.",
      sections: [
        {
          heading: "En cas d'erreur",
          body: [
            "Si vous recevez un article erroné ou endommagé, contactez la succursale sur WhatsApp dès que possible avec une photo du produit, et nous réglons cela avec vous.",
          ],
        },
        {
          heading: "Avant l'envoi",
          body: [
            "Les parfums étant des produits délicats, nous vérifions avec vous les détails de la commande sur WhatsApp avant l'envoi pour qu'elle vous parvienne telle que voulue.",
          ],
        },
      ],
    },
    privacy: {
      title: "Confidentialité",
      intro: "Ce site collecte le minimum — et ne vous crée aucun compte.",
      sections: [
        {
          heading: "Ce qui est stocké sur votre appareil",
          body: [
            "Votre choix de succursale et de langue ainsi que votre panier sont stockés dans votre navigateur uniquement ; ils ne sont pas envoyés à un serveur et nous ne les voyons pas. Effacez les données du site dans votre navigateur pour les supprimer.",
          ],
        },
        {
          heading: "Commander sur WhatsApp",
          body: [
            "Lorsque vous finalisez une commande, WhatsApp s'ouvre et votre message est envoyé via ce service, selon sa propre politique de confidentialité. Le nom et l'adresse que vous écrivez parviennent au commerçant de la succursale à seule fin d'organiser la livraison.",
          ],
        },
        {
          heading: "Analytique",
          body: [
            "Si l'analytique est activée, il s'agit d'un service léger, sans cookies ni identification — et elle peut n'être pas activée du tout.",
          ],
        },
      ],
    },
    terms: {
      title: "Conditions d'utilisation",
      sections: [
        {
          heading: "Prix et disponibilité",
          body: [
            "Les prix et la disponibilité sont indiqués par succursale, dans sa monnaie, et peuvent changer. Nous confirmons la commande et son prix final avec vous sur WhatsApp avant l'envoi.",
          ],
        },
        {
          heading: "Commandes",
          body: [
            "Finaliser une commande sur WhatsApp est une invitation à échanger, non un contrat abouti ; la commande devient ferme une fois que nous la confirmons avec vous.",
          ],
        },
        {
          heading: "Propriété",
          body: [
            "Le nom VALORY, son logo et les images des produits appartiennent à la maison. Les photos de paysages proviennent de Wikimedia Commons, avec leurs auteurs et licences — voir la page des crédits.",
          ],
        },
      ],
    },
    faq: {
      title: "Questions fréquentes",
      sections: [
        {
          heading: "Comment commander ?",
          body: [
            "Choisissez vos parfums et ajoutez-les au panier, puis finalisez sur le WhatsApp de la succursale. Nous organisons la livraison et le paiement dans la conversation.",
          ],
        },
        {
          heading: "Où se trouve votre boutique ?",
          body: ["La boutique VALORY se trouve à N'Djamena, au Tchad — notre seule boutique à ce jour."],
        },
        {
          heading: "Dans quelle langue naviguer ?",
          body: ["Arabe, français et anglais — choisissez la vôtre sur l'écran d'accueil ou dans l'en-tête."],
        },
        {
          heading: "Les parfums sont-ils authentiques ?",
          body: ["Nous proposons ce dont nous garantissons l'authenticité, et les données de chaque produit sont lues sur son emballage."],
        },
        {
          heading: "Dans quelle monnaie sont les prix ?",
          body: ["Dans la monnaie de chaque succursale : le franc (FCFA) à N'Djamena."],
        },
      ],
    },
    credits: {
      title: "Crédits photo",
      intro:
        "Les photos de paysages proviennent de Wikimedia Commons, chacune avec son auteur et sa licence — une exigence de la licence, non une courtoisie.",
      sections: [],
    },
  },
};
