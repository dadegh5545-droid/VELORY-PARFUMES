import { LOCALES } from "./i18n";
import { absoluteUrl } from "./site-config";
import { DEFAULT_LOCALE, absoluteLocaleUrl } from "./page-meta";

/**
 * وسومُ hreflang للصفحة الأولى — تُكتب هنا لا عبر `alternates.languages`.
 *
 * Next يحلّ كلَّ رابطٍ في `alternates` إلى كائن URL، ثم:
 *     result.pathname === "/" ? result.origin : result.href
 * (lib/metadata/resolvers/resolve-url.js). فمسارُ الجذر يُختصر إلى الأصل
 * وحده وتسقط معه سلسلةُ الاستعلام — فتخرج لغاتُ الصفحة الأولى الثلاثُ
 * تشير إلى رابطٍ واحد، وهو hreflang متناقضٌ يتجاهله محرّكُ البحث.
 * وبقيّةُ الصفحات لا يمسّها هذا لأن مسارَها ليس «/».
 *
 * فتُكتب وسومُها صراحةً: React يرفع <link> إلى <head> من أيِّ موضعٍ في
 * الشجرة. ولا تُكرَّر مع وسوم Next لأن `homeMetadata` تحذف `languages`.
 */
export function HomeHreflang() {
  return (
    <>
      {LOCALES.map((l) => (
        <link
          key={l}
          rel="alternate"
          hrefLang={l}
          href={absoluteLocaleUrl("/", l)}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={absoluteUrl("/")} />
    </>
  );
}
