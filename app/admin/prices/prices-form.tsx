"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import s from "./prices.module.css";

type BranchInfo = { id: string; name: string; currency: string };

/** الحقول النصّية التي تُحرَّر هنا — أسماؤها كما في نوع Perfume */
const FIELDS = ["size", "gender", "longevity"] as const;
type Field = (typeof FIELDS)[number];

const GENDERS = ["رجالي", "نسائي", "للجنسين"];

type Row = {
  id: string;
  name: string;
  latin: string;
  meta: string;
  image: string;
  size: string;
  gender: string;
  longevity: string;
  prices: Record<string, number | null>;
};

/** ما يُكتب في الحقول نصًّا: "" يعني «غير محدَّد» فيختفي الحقل من المصدر */
type Draft = Record<string, Record<string, string>>;

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** يقبل ١٢٠٠ و1,200 و«1200 » سواءً — فالسعر يُنقل عن ورقةٍ أو رسالة */
const normalize = (v: string) =>
  v
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)))
    .replace(/[,،\s_]/g, "")
    .trim();

/** null: الحقل فارغ (بلا سعر) — undefined: ما كُتب ليس رقمًا صالحًا */
const parse = (v: string): number | null | undefined => {
  const t = normalize(v);
  if (!t) return null;
  const n = Number(t);
  return Number.isInteger(n) && n > 0 && n <= 10_000_000 ? n : undefined;
};

const asText = (v: number | null) => (v === null ? "" : String(v));

const initialPrices = (rows: Row[]): Draft =>
  Object.fromEntries(
    rows.map((r) => [
      r.id,
      Object.fromEntries(
        Object.entries(r.prices).map(([b, p]) => [b, asText(p)])
      ),
    ])
  );

const initialFields = (rows: Row[]): Draft =>
  Object.fromEntries(
    rows.map((r) => [
      r.id,
      { size: r.size, gender: r.gender, longevity: r.longevity },
    ])
  );

export function PricesForm({
  branches,
  rows,
  sizes,
  longevities,
}: {
  branches: BranchInfo[];
  rows: Row[];
  sizes: string[];
  longevities: string[];
}) {
  // الأصل يأتي من الملف؛ والمسودّة ما تحت اليد. الفرق بينهما هو ما يُحفظ.
  const [saved, setSaved] = useState<Draft>(() => initialPrices(rows));
  const [draft, setDraft] = useState<Draft>(() => initialPrices(rows));
  const [savedF, setSavedF] = useState<Draft>(() => initialFields(rows));
  const [draftF, setDraftF] = useState<Draft>(() => initialFields(rows));

  const [onlyEmpty, setOnlyEmpty] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    { kind: "idle" | "saving" } | { kind: "done" | "error"; text: string }
  >({ kind: "idle" });

  // الصورة تُرفع وحدها فورًا ولا تنتظر زرّ الحفظ: ملفٌّ يُنسخ، لا رقمٌ يُراجَع.
  const [shots, setShots] = useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((r) => [r.id, r.image]))
  );
  const [uploading, setUploading] = useState<string | null>(null);

  // إن أُعيد تحميل الوحدة بعد كتابة الملف، يصير المحفوظُ هو الأصلَ الجديد.
  useEffect(() => {
    setSaved(initialPrices(rows));
    setDraft(initialPrices(rows));
    setSavedF(initialFields(rows));
    setDraftF(initialFields(rows));
    setShots(Object.fromEntries(rows.map((r) => [r.id, r.image])));
  }, [rows]);

  const upload = async (id: string, file: File) => {
    setUploading(id);
    setStatus({ kind: "idle" });
    try {
      const body = new FormData();
      body.append("id", id);
      body.append("file", file);

      const res = await fetch("/api/product-image", { method: "POST", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          kind: "error",
          text: data.error ?? `تعذّر رفع الصورة (${res.status})`,
        });
        return;
      }

      // اسم الملف لا يتغيّر عند الاستبدال، فتلزم بصمةٌ تكسر ذاكرة المتصفّح.
      setShots((m) => ({
        ...m,
        [id]: `${data.url}?v=${file.size}-${file.lastModified}`,
      }));
      setStatus({ kind: "done", text: "رُفعت الصورة وحُفظ مسارها" });
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    } finally {
      setUploading(null);
    }
  };

  const priceEdits = useMemo(() => {
    const out: { id: string; branch: string; value: number | null }[] = [];
    for (const r of rows) {
      for (const b of Object.keys(r.prices)) {
        const now = draft[r.id]?.[b] ?? "";
        if (normalize(now) === normalize(saved[r.id]?.[b] ?? "")) continue;
        const parsed = parse(now);
        if (parsed === undefined) continue;
        out.push({ id: r.id, branch: b, value: parsed });
      }
    }
    return out;
  }, [draft, saved, rows]);

  const fieldEdits = useMemo(() => {
    const out: { id: string; field: Field; value: string }[] = [];
    for (const r of rows) {
      for (const f of FIELDS) {
        const now = (draftF[r.id]?.[f] ?? "").trim();
        if (now === (savedF[r.id]?.[f] ?? "").trim()) continue;
        out.push({ id: r.id, field: f, value: now });
      }
    }
    return out;
  }, [draftF, savedF, rows]);

  const changes = priceEdits.length + fieldEdits.length;

  const invalid = useMemo(() => {
    const bad = new Set<string>();
    for (const r of rows) {
      for (const b of Object.keys(r.prices)) {
        if (parse(draft[r.id]?.[b] ?? "") === undefined) bad.add(`${r.id}:${b}`);
      }
    }
    return bad;
  }, [draft, rows]);

  /** ما ينقص كلَّ عطرٍ في المحفوظ — عليه يقوم العدّاد والفلتر */
  const missingOf = useCallback(
    (r: Row, from: Draft, fromF: Draft) => ({
      price: Object.keys(r.prices).some((b) => !normalize(from[r.id]?.[b] ?? "")),
      size: !(fromF[r.id]?.size ?? "").trim(),
      gender: !(fromF[r.id]?.gender ?? "").trim(),
      longevity: !(fromF[r.id]?.longevity ?? "").trim(),
    }),
    []
  );

  const counts = useMemo(() => {
    let price = 0;
    let size = 0;
    let gender = 0;
    let longevity = 0;
    for (const r of rows) {
      const m = missingOf(r, saved, savedF);
      if (m.price) price++;
      if (m.size) size++;
      if (m.gender) gender++;
      if (m.longevity) longevity++;
    }
    return { price, size, gender, longevity };
  }, [rows, saved, savedF, missingOf]);

  const shown = useMemo(() => {
    const q = query.trim();
    return rows.filter((r) => {
      if (onlyEmpty) {
        const m = missingOf(r, draft, draftF);
        if (!m.price && !m.size && !m.gender && !m.longevity) return false;
      }
      if (!q) return true;
      return `${r.name} ${r.latin} ${r.meta}`.includes(q);
    });
  }, [rows, draft, draftF, onlyEmpty, query, missingOf]);

  const save = useCallback(async () => {
    if (!changes || invalid.size) return;
    setStatus({ kind: "saving" });

    const prices: Record<string, Record<string, number | null>> = {};
    for (const e of priceEdits) {
      (prices[e.id] ??= {})[e.branch] = e.value;
    }
    const fields: Record<string, Record<string, string | null>> = {};
    for (const e of fieldEdits) {
      (fields[e.id] ??= {})[e.field] = e.value === "" ? null : e.value;
    }

    try {
      // كلُّ حفظٍ يغيّر catalog.ts فيعيد Next تجميعَ المسار، وطلبٌ يصل أثناء
      // التجميع يُردّ بـ404. فتُعاد المحاولة قليلًا بدل أن يُتّهم الحفظُ بالفشل.
      let res: Response | null = null;
      let data: { error?: string } = {};
      for (let attempt = 0; attempt < 4; attempt++) {
        res = await fetch("/api/prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prices, fields }),
        });
        data = await res.json().catch(() => ({}));
        if (res.status !== 404) break;
        await new Promise((r) => setTimeout(r, 700));
      }

      if (!res || !res.ok) {
        setStatus({
          kind: "error",
          text: data.error ?? `تعذّر الحفظ (${res?.status ?? "لا ردّ"})`,
        });
        return;
      }

      const count = changes;
      setSaved(draft);
      setSavedF(draftF);
      setStatus({ kind: "done", text: `حُفظ ${count} تغييرًا في catalog.ts` });
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    }
  }, [changes, invalid, priceEdits, fieldEdits, draft, draftF]);

  // Ctrl+S عادةُ من يحرّر ملفًّا — فلتحفظ هنا كما تحفظ هناك.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const setPrice = (id: string, branch: string, value: string) => {
    setDraft((d) => ({ ...d, [id]: { ...d[id], [branch]: value } }));
    setStatus({ kind: "idle" });
  };

  const setField = (id: string, field: Field, value: string) => {
    setDraftF((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));
    setStatus({ kind: "idle" });
  };

  const changedField = (id: string, field: Field) =>
    (draftF[id]?.[field] ?? "").trim() !== (savedF[id]?.[field] ?? "").trim();

  return (
    // `admin-root` علامةٌ عامّةٌ تلتقطها admin.css لتخفي ترويسةَ المحل وتذييله
    <main className={`admin-root ${s.page}`}>
      <header className={s.head}>
        <h1>بيانات الكتالوج</h1>
        <p className={s.note}>
          ما يُحفظ هنا يُكتب في <code>app/catalog.ts</code> مباشرةً، ثم يُرفع مع
          الكود. الحقل المتروك فارغًا لا يظهر للزبون أصلًا.
        </p>
        <p className={s.stat}>
          {rows.length} منتجًا · ناقصها: <strong>{counts.price}</strong> سعرًا ·{" "}
          <strong>{counts.size}</strong> حجمًا · <strong>{counts.gender}</strong>{" "}
          نوعًا · <strong>{counts.longevity}</strong> ثباتًا
        </p>
      </header>

      <div className={s.tools}>
        <input
          type="search"
          className={s.search}
          placeholder="ابحث باسم العطر أو داره…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className={s.check}>
          <input
            type="checkbox"
            checked={onlyEmpty}
            onChange={(e) => setOnlyEmpty(e.target.checked)}
          />
          الناقصة فقط
        </label>
      </div>

      {/* قائمةُ الأحجام المعروفة اقتراحٌ لا قيد: يُكتب غيرها متى لزم */}
      <datalist id="sizes">
        {sizes.map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>

      <div className={s.scroll}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.shotHead}>الصورة</th>
              <th>العطر</th>
              <th className={s.sizeHead}>الحجم</th>
              <th className={s.pickHead}>النوع</th>
              <th className={s.pickHead}>الثبات</th>
              {branches.map((b) => (
                <th key={b.id} className={s.priceHead}>
                  {b.name} <span className={s.currency}>{b.currency}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td className={s.shotCell}>
                  <label className={s.shot} title="اضغط لاختيار صورةٍ بديلة">
                    {shots[r.id] ? (
                      /* صورةٌ من public في لوحةٍ محلّية — لا تمرّ بمحسّن next/image */
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={shots[r.id]} alt={r.name} />
                    ) : (
                      <span className={s.noShot}>لا صورة</span>
                    )}
                    {uploading === r.id && (
                      <span className={s.uploading}>يُرفع…</span>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={uploading !== null}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) void upload(r.id, f);
                      }}
                    />
                  </label>
                </td>

                <th scope="row" className={s.nameCell}>
                  <span className={s.name}>{r.name}</span>
                  {r.meta && <span className={s.meta}>{r.meta}</span>}
                </th>

                <td>
                  <input
                    list="sizes"
                    className={`${s.input} ${changedField(r.id, "size") ? s.changed : ""}`}
                    value={draftF[r.id]?.size ?? ""}
                    onChange={(e) => setField(r.id, "size", e.target.value)}
                    onFocus={(e) => e.target.select()}
                    aria-label={`حجم ${r.name}`}
                    placeholder="—"
                  />
                </td>

                <td>
                  <select
                    className={`${s.select} ${changedField(r.id, "gender") ? s.changed : ""}`}
                    value={draftF[r.id]?.gender ?? ""}
                    onChange={(e) => setField(r.id, "gender", e.target.value)}
                    aria-label={`نوع ${r.name}`}
                  >
                    <option value="">—</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <select
                    className={`${s.select} ${changedField(r.id, "longevity") ? s.changed : ""}`}
                    value={draftF[r.id]?.longevity ?? ""}
                    onChange={(e) => setField(r.id, "longevity", e.target.value)}
                    aria-label={`ثبات ${r.name}`}
                  >
                    <option value="">—</option>
                    {longevities.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </td>

                {branches.map((b) => {
                  const sells = b.id in r.prices;
                  const key = `${r.id}:${b.id}`;
                  const changed = priceEdits.some(
                    (e) => e.id === r.id && e.branch === b.id
                  );
                  return (
                    <td key={b.id} className={s.priceCell}>
                      {sells ? (
                        <input
                          className={[
                            s.input,
                            invalid.has(key) ? s.bad : "",
                            changed ? s.changed : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          inputMode="numeric"
                          dir="ltr"
                          value={draft[r.id]?.[b.id] ?? ""}
                          onChange={(e) => setPrice(r.id, b.id, e.target.value)}
                          onFocus={(e) => e.target.select()}
                          aria-label={`سعر ${r.name} في ${b.name}`}
                          placeholder="—"
                        />
                      ) : (
                        <span className={s.absent} title="غير معروضٍ في هذا الفرع">
                          ·
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {shown.length === 0 && <p className={s.empty}>لا نتائج لهذا البحث.</p>}

      <div className={s.bar}>
        <span className={s.barText}>
          {invalid.size > 0
            ? `${invalid.size} حقلًا فيه رقمٌ غير صالح`
            : changes > 0
              ? `${changes} تغييرًا غير محفوظ`
              : status.kind === "done"
                ? status.text
                : "لا تغييرات"}
          {status.kind === "error" && ` — ${status.text}`}
        </span>
        <button
          type="button"
          className={s.save}
          onClick={() => void save()}
          disabled={!changes || invalid.size > 0 || status.kind === "saving"}
        >
          {status.kind === "saving" ? "يُحفظ…" : "حفظ"}
        </button>
      </div>
    </main>
  );
}
