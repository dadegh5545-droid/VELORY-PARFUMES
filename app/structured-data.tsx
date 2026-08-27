// بياناتٌ منظَّمة (JSON-LD) لمحرّكات البحث — تُقرأ كلُّها من مصدرِ الحقيقة
// (BRANCHES وCATALOG) فلا يُخترع فيها اسمٌ ولا رقمٌ ولا سعر. الحقلُ الذي
// لا بياناتَ له يُحذف، لا يُملأ بتخمين.

import { BRANCHES, CATALOG, type Branch, type Perfume } from "./catalog";
import { SITE_NAME, SITE_URL, absoluteUrl } from "./site-config";

/** رمزُ الدولة (ISO 3166-1) لكلِّ فرع — معرفةٌ من المدينة لا مخترعة */
const COUNTRY: Record<string, string> = { qatar: "QA", chad: "TD" };

/** رمزُ العملة (ISO 4217) من رمزها المكتوب — للعروض في بيانات المنتج */
const CURRENCY_ISO: Record<string, string> = {
  FCFA: "XAF", // فرنك وسط أفريقيا
  "ر.ق": "QAR", // ريال قطري
};

/** إحداثيّاتُ المحلّ من رابط الخريطة (q=lat,lng) — أو لا شيء إن غاب */
function geoOf(branch: Branch): { lat: number; lng: number } | null {
  if (!branch.mapUrl) return null;
  const m = branch.mapUrl.match(/q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  return { lat: Number(m[1]), lng: Number(m[2]) };
}

/** وسمُ سكربتٍ واحدٍ يحمل كائنَ JSON-LD */
function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // المحتوى مبنيٌّ من بياناتنا لا من مدخلات زائر، فلا حقنَ هنا.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** الدار نفسها: الاسمُ والعنوانُ والشعار */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/valory-logo.png"),
      }}
    />
  );
}

/** كلُّ فرعٍ قابلٍ للتواصل يصير محلًّا (Store) ببياناته الحقيقية وحدها */
export function LocalBusinessJsonLd() {
  const stores = BRANCHES.filter((b) => b.phone || b.whatsapp || b.mapUrl).map(
    (b) => {
      const geo = geoOf(b);
      const data: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Store",
        name: `${SITE_NAME} — ${b.city}`,
        image: absoluteUrl("/valory-logo.png"),
        url: SITE_URL,
        address: {
          "@type": "PostalAddress",
          addressLocality: b.city,
          addressCountry: COUNTRY[b.id] ?? undefined,
        },
      };
      // لا streetAddress: العنوانُ مدينةٌ وبلدٌ فقط (لا شارعَ حقيقيًّا)،
      // وهو مُمثَّلٌ أصلًا بـ addressLocality وaddressCountry.
      if (b.phone) data.telephone = b.phone.replace(/\s/g, "");
      if (b.mapUrl) data.hasMap = b.mapUrl;
      if (geo) {
        data.geo = {
          "@type": "GeoCoordinates",
          latitude: geo.lat,
          longitude: geo.lng,
        };
      }
      if (b.openingHours) {
        const s = b.openingHours.spec;
        // أيامُ العمل وحدها تُدرج؛ يومُ الإغلاق (الجمعة) يُستنتج بغيابه —
        // وهو العرفُ في schema.org. الأوقاتُ بالتوقيت المحلّي للمنطقة أدناه.
        data.openingHoursSpecification = {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: s.dayOfWeek,
          opens: s.opens,
          closes: s.closes,
        };
        // لا حقلَ منطقةٍ زمنية في OpeningHoursSpecification، فتُدرَج
        // كخاصّيةٍ إضافية صريحة على المحلّ.
        data.additionalProperty = {
          "@type": "PropertyValue",
          name: "timezone",
          value: s.timezone,
        };
      }
      return data;
    }
  );

  if (!stores.length) return null;
  return (
    <>
      {stores.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}

/** بيانات عطرٍ بعينه — تُوضع في صفحته. العروضُ من الفروع المسعّرة وحدها */
export function ProductJsonLd({ perfume }: { perfume: Perfume }) {
  const offers = BRANCHES.filter((b) => perfume.branches[b.id]).map((b) => {
    const price = perfume.branches[b.id]?.price;
    const iso = CURRENCY_ISO[b.currency];
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/parfum/${perfume.id}`),
    };
    // السعر يُدرج حين يُعرف وحده، وبعملةٍ لها رمزٌ دوليّ معروف.
    if (price && iso) {
      offer.price = price;
      offer.priceCurrency = iso;
    }
    return offer;
  });

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: perfume.name,
    brand: perfume.brand
      ? { "@type": "Brand", name: perfume.brand }
      : { "@type": "Brand", name: SITE_NAME },
  };
  if (perfume.latin) data.alternateName = perfume.latin;
  if (perfume.description) data.description = perfume.description;
  if (perfume.image) data.image = absoluteUrl(perfume.image);
  if (offers.length) data.offers = offers;

  return <JsonLd data={data} />;
}

/** كلُّ العطور — للاستفادة منها في خريطة الموقع أو الصفحات مستقبلًا */
export const PRODUCT_COUNT = CATALOG.length;
