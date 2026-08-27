"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  type Branch,
  type Gender,
  type Perfume,
  countLabel,
  metaLine,
  perfumeName,
  perfumeNotes,
  perfumesOf,
  priceIn,
} from "./catalog";
import { GENDER_TR, T, trBrand, trSize, type Locale } from "./i18n";
import { Bottle } from "./bottle";
import { AddButton } from "./site-header";

// كم عطرًا يظهر في الدفعة الواحدة — الشبكة تبدأ بهذا العدد، ويكشف زرُّ
// «عرض المزيد» دفعةً مثلَه في كلِّ ضغطة، فلا تُحمَّل الصفحة بستّين بطاقةً دفعةً.
const PAGE = 12;

/** ترتيبُ العرض — الافتراضُ ترتيبُ الكتالوج، ثم السعرُ صعودًا ونزولًا، ثم الاسم */
type Sort = "default" | "price-asc" | "price-desc" | "name";

/**
 * تطبيعُ نصٍّ عربيّ للبحث: يُسقط التشكيلَ والتطويل، ويوحّد صورَ الألف
 * والياء والتاء المربوطة — كي يجد «إحساس» من كتب «احساس»، و«جوهره» من
 * كتب «جوهرة». وللاتينيّ خفضُ الحالة وحده يكفي.
 */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ً-ْ]/g, "")
    .replace(/ـ/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");

/** قائمةٌ مرتّبةٌ بلا مكرَّر من قيمةٍ اختيارية عبر العطور */
function uniq<T>(values: (T | undefined)[]): T[] {
  const out: T[] = [];
  for (const v of values) {
    if (v && out.indexOf(v) === -1) out.push(v);
  }
  return out;
}

export function Collection({ branch, locale }: { branch: Branch; locale: Locale }) {
  const t = T[locale];
  const all = perfumesOf(branch.id);

  // ما يظهر في المصفّيات مشتقٌّ من عطور الفرع وحدها: لا تُعرض دارٌ ولا
  // حجمٌ ولا نوعٌ لا وجودَ له بينها، فلا يصطدم الزائرُ بمرشِّحٍ لا يردّ شيئًا.
  const brands = useMemo(() => uniq(all.map((p) => p.brand)), [all]);
  const sizes = useMemo(() => uniq(all.map((p) => p.size)), [all]);
  const genders = useMemo(
    () => uniq(all.map((p) => p.gender)) as Gender[],
    [all]
  );
  const categories = useMemo(() => uniq(all.map((p) => p.category)), [all]);

  // مدى الأسعار في هذا الفرع بعملته — لأصناف مُسعّرةٍ وحدها، فما سعرُه
  // «عند الطلب» لا يدخل الحساب ولا يُخفى بمنزلقِ السعر.
  const prices = useMemo(
    () =>
      all
        .map((p) => p.branches[branch.id]?.price)
        .filter((v): v is number => typeof v === "number"),
    [all, branch.id]
  );
  const minPrice = prices.length ? Math.min.apply(null, prices) : 0;
  const maxPrice = prices.length ? Math.max.apply(null, prices) : 0;
  const hasPriceRange = maxPrice > minPrice;

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [cap, setCap] = useState(maxPrice);
  const [sort, setSort] = useState<Sort>("default");
  const [shown, setShown] = useState(PAGE);

  // منزلقُ السعر يبدأ عند أقصى سعرٍ (لا حجب) — ويُعاد ضبطُه إن تبدّل المدى.
  useEffect(() => setCap(maxPrice), [maxPrice]);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    let list = all.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (size && p.size !== size) return false;
      if (category && p.category !== category) return false;
      if (gender && p.gender !== gender) return false;
      if (hasPriceRange && cap < maxPrice) {
        const price = p.branches[branch.id]?.price;
        // ما لا سعرَ له يبقى ظاهرًا: المنزلقُ يحدّ المسعّرَ، لا يُخفي المجهول.
        if (typeof price === "number" && price > cap) return false;
      }
      if (q) {
        const hay = norm(
          [p.name, p.latin ?? "", p.brand ? trBrand(p.brand, locale) : ""].join(
            " "
          )
        );
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (sort === "name") {
      list = list
        .slice()
        .sort((a, b) => perfumeName(a, locale).localeCompare(perfumeName(b, locale), locale));
    } else if (sort === "price-asc" || sort === "price-desc") {
      const priceOf = (p: Perfume) =>
        p.branches[branch.id]?.price ?? Number.POSITIVE_INFINITY;
      list = list.slice().sort((a, b) => {
        const d = priceOf(a) - priceOf(b);
        return sort === "price-asc" ? d : -d;
      });
    }

    return list;
  }, [
    all,
    brand,
    size,
    category,
    gender,
    cap,
    maxPrice,
    hasPriceRange,
    query,
    sort,
    locale,
    branch.id,
  ]);

  // كلَّما تبدّل المصفَّى نعود إلى الدفعة الأولى: زائرٌ بحث عن كلمةٍ لا
  // يُفتح له الكشفُ على «المزيد» من نتيجةٍ سابقة.
  useEffect(() => setShown(PAGE), [query, brand, size, category, gender, cap, sort]);

  const visible = filtered.slice(0, shown);
  const hasFilters =
    brands.length > 1 ||
    sizes.length > 1 ||
    genders.length > 1 ||
    categories.length > 1 ||
    hasPriceRange;

  return (
    <>
      {(hasFilters || all.length > PAGE) && (
        <div className="collection-tools" role="search">
          <div className="tool-row">
            <label className="tool search">
              <span className="vh">{t.searchLabel}</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoComplete="off"
              />
            </label>

            <label className="tool">
              <span className="vh">{t.sortLabel}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="default">{t.sortDefault}</option>
                <option value="price-asc">{t.sortPriceAsc}</option>
                <option value="price-desc">{t.sortPriceDesc}</option>
                <option value="name">{t.sortName}</option>
              </select>
            </label>
          </div>

          {(brands.length > 1 ||
            sizes.length > 1 ||
            categories.length > 1 ||
            genders.length > 1 ||
            hasPriceRange) && (
            <div className="tool-row">
              {categories.length > 1 && (
                <label className="tool">
                  <span className="vh">{t.filterCategory}</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">{t.filterCategory}</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {brands.length > 1 && (
                <label className="tool">
                  <span className="vh">{t.house}</span>
                  <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                    <option value="">{t.filterHouseAll}</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>
                        {trBrand(b, locale)}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {sizes.length > 1 && (
                <label className="tool">
                  <span className="vh">{t.size}</span>
                  <select value={size} onChange={(e) => setSize(e.target.value)}>
                    <option value="">{t.filterSizeAll}</option>
                    {sizes.map((s) => (
                      <option key={s} value={s}>
                        {trSize(s, locale)}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {/* النوعُ يظهر حين يُعرف نوعان مختلفان بين عطور الفرع فأكثر —
                  وإلا فمرشِّحٌ بخيارٍ واحدٍ لا معنى له */}
              {genders.length > 1 && (
                <label className="tool">
                  <span className="vh">{t.gender}</span>
                  <select
                    value={gender ?? ""}
                    onChange={(e) =>
                      setGender((e.target.value || null) as Gender | null)
                    }
                  >
                    <option value="">{t.filterAll}</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {GENDER_TR[g][locale]}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {hasPriceRange && (
                <label className="tool price-tool">
                  <span>
                    {t.filterPriceMax}: {priceCap(cap, branch, locale)}
                  </span>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={priceStep(minPrice, maxPrice)}
                    value={cap}
                    onChange={(e) => setCap(Number(e.target.value))}
                  />
                </label>
              )}
            </div>
          )}

          {/* عددُ النتائج يُعلَن آليًّا: من صفّى بلوحة المفاتيح يسمع كم بقي */}
          <p className="collection-count" aria-live="polite">
            {countLabel(filtered.length, locale)}
          </p>
        </div>
      )}

      {visible.length > 0 ? (
        <div className="grid">
          {visible.map((p) => {
            const notes = perfumeNotes(p, locale);
            const meta = metaLine(p, locale);

            return (
              <article className="card" key={p.id}>
                <Link href={`/parfum/${p.id}`} className="card-link">
                  <Bottle perfume={p} />
                  <div className="card-body">
                    <h3>{perfumeName(p, locale)}</h3>
                    {locale === "ar" && p.latin && <p className="latin">{p.latin}</p>}
                    {meta && <p className="notes">{meta}</p>}

                    {notes && (
                      <dl className="pyramid">
                        <div>
                          <dt>{t.head}</dt>
                          <dd>{notes.head}</dd>
                        </div>
                        <div>
                          <dt>{t.heart}</dt>
                          <dd>{notes.heart}</dd>
                        </div>
                        <div>
                          <dt>{t.base}</dt>
                          <dd>{notes.base}</dd>
                        </div>
                      </dl>
                    )}
                  </div>
                </Link>

                <div className="card-foot">
                  <span className="price">{priceIn(p, branch, locale)}</span>
                  <AddButton id={p.id} branch={branch.id} label={t.add} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="collection-empty">{t.searchNoResults}</p>
      )}

      {filtered.length > shown && (
        <div className="collection-more">
          <button
            type="button"
            className="btn"
            onClick={() => setShown((n) => n + PAGE)}
          >
            {t.showMore}
          </button>
        </div>
      )}
    </>
  );
}

/** خطوةُ المنزلق: جزءٌ من المئة من المدى، مقرّبٌ فلا يقفز قفزاتٍ غريبة */
function priceStep(min: number, max: number) {
  const span = max - min;
  if (span <= 0) return 1;
  const raw = span / 100;
  return Math.max(1, Math.round(raw));
}

/** سعرُ سقف المنزلق منسّقًا بعملة الفرع */
function priceCap(value: number, branch: Branch, locale: Locale) {
  // نستعير التنسيق نفسَه من priceIn عبر صنفٍ مسعّرٍ افتراضيّ بسيط.
  return `${new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(
    value
  )} ${branchCurrencyOf(branch, locale)}`;
}

/** رمزُ عملة الفرع بلغة الزائر — نسخةٌ محلّيةٌ صغيرةٌ تُغني عن تصدير أوسع */
function branchCurrencyOf(branch: Branch, locale: Locale) {
  if (locale === "ar") return branch.currency;
  const tr = branch.tr[locale as Exclude<Locale, "ar">];
  return (tr && tr.currency) || branch.currency;
}
