"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import s from "./prices.module.css";

type BranchInfo = { id: string; name: string; currency: string };

type Row = {
  id: string;
  name: string;
  latin: string;
  meta: string;
  image: string;
  prices: Record<string, number | null>;
};

/** ما يكتبه المستخدم نصًّا: "" يعني بلا سعر، وما عداه رقمٌ يُتحقَّق منه */
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

const initialDraft = (rows: Row[]): Draft =>
  Object.fromEntries(
    rows.map((r) => [
      r.id,
      Object.fromEntries(
        Object.entries(r.prices).map(([b, p]) => [b, asText(p)])
      ),
    ])
  );

export function PricesForm({
  branches,
  rows,
}: {
  branches: BranchInfo[];
  rows: Row[];
}) {
  // الأصل يأتي من الملف؛ والمسودّة ما تحت اليد. الفرق بينهما هو ما يُحفظ.
  const [saved, setSaved] = useState<Draft>(() => initialDraft(rows));
  const [draft, setDraft] = useState<Draft>(() => initialDraft(rows));
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
    const fresh = initialDraft(rows);
    setSaved(fresh);
    setDraft(fresh);
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
      setShots((m) => ({ ...m, [id]: `${data.url}?v=${file.size}-${file.lastModified}` }));
      setStatus({ kind: "done", text: "رُفعت الصورة وحُفظ مسارها" });
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    } finally {
      setUploading(null);
    }
  };

  const edits = useMemo(() => {
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

  const invalid = useMemo(() => {
    const bad = new Set<string>();
    for (const r of rows) {
      for (const b of Object.keys(r.prices)) {
        if (parse(draft[r.id]?.[b] ?? "") === undefined) bad.add(`${r.id}:${b}`);
      }
    }
    return bad;
  }, [draft, rows]);

  const missing = useMemo(
    () =>
      rows.filter((r) =>
        Object.keys(r.prices).some((b) => !normalize(saved[r.id]?.[b] ?? ""))
      ).length,
    [rows, saved]
  );

  const shown = useMemo(() => {
    const q = query.trim();
    return rows.filter((r) => {
      if (
        onlyEmpty &&
        !Object.keys(r.prices).some((b) => !normalize(draft[r.id]?.[b] ?? ""))
      ) {
        return false;
      }
      if (!q) return true;
      return `${r.name} ${r.latin} ${r.meta}`.includes(q);
    });
  }, [rows, draft, onlyEmpty, query]);

  const save = useCallback(async () => {
    if (!edits.length || invalid.size) return;
    setStatus({ kind: "saving" });

    const prices: Record<string, Record<string, number | null>> = {};
    for (const e of edits) {
      (prices[e.id] ??= {})[e.branch] = e.value;
    }

    try {
      const res = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({ kind: "error", text: data.error ?? `تعذّر الحفظ (${res.status})` });
        return;
      }

      const count = edits.length;
      setSaved(draft);
      setStatus({ kind: "done", text: `حُفظ ${count} سعرًا في catalog.ts` });
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    }
  }, [edits, invalid, draft]);

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

  const set = (id: string, branch: string, value: string) => {
    setDraft((d) => ({ ...d, [id]: { ...d[id], [branch]: value } }));
    setStatus({ kind: "idle" });
  };

  return (
    // `admin-root` علامةٌ عامّةٌ تلتقطها admin.css لتخفي ترويسةَ المحل وتذييله
    <main className={`admin-root ${s.page}`}>
      <header className={s.head}>
        <h1>أسعار الكتالوج</h1>
        <p className={s.note}>
          ما يُحفظ هنا يُكتب في <code>app/catalog.ts</code> مباشرةً، ثم يُرفع مع
          الكود. الحقل الفارغ يعني «السعر عند الطلب».
        </p>
        <p className={s.stat}>
          {rows.length} منتجًا · <strong>{missing}</strong> بلا سعر
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
          غير المسعَّرة فقط
        </label>
      </div>

      <table className={s.table}>
        <thead>
          <tr>
            <th className={s.shotHead}>الصورة</th>
            <th>العطر</th>
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
                  {uploading === r.id && <span className={s.uploading}>يُرفع…</span>}
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
              {branches.map((b) => {
                const sells = b.id in r.prices;
                const key = `${r.id}:${b.id}`;
                const changed = edits.some(
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
                        onChange={(e) => set(r.id, b.id, e.target.value)}
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

      {shown.length === 0 && <p className={s.empty}>لا نتائج لهذا البحث.</p>}

      <div className={s.bar}>
        <span className={s.barText}>
          {invalid.size > 0
            ? `${invalid.size} حقلًا فيه رقمٌ غير صالح`
            : edits.length > 0
              ? `${edits.length} تغييرًا غير محفوظ`
              : status.kind === "done"
                ? status.text
                : "لا تغييرات"}
          {status.kind === "error" && ` — ${status.text}`}
        </span>
        <button
          type="button"
          className={s.save}
          onClick={() => void save()}
          disabled={
            !edits.length || invalid.size > 0 || status.kind === "saving"
          }
        >
          {status.kind === "saving" ? "يُحفظ…" : "حفظ"}
        </button>
      </div>
    </main>
  );
}
