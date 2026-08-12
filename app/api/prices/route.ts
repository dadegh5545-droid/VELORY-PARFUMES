// كتابة بيانات الكتالوج في مصدرها — يخدم صفحة /admin/prices وحدها.
//
// البيانات تعيش في app/catalog.ts لا في قاعدة بيانات، فالحفظ هنا تحريرُ نصٍّ:
// نبدّل قيمةً بعينها داخل كتلة العطر ونترك ما عداها كما هو، كي لا يمحو
// الحفظُ تعليقًا ولا ترتيبًا ولا حقلًا أضافه محرّرٌ بيده.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { BRANCHES, CATALOG, type BranchId, type Gender } from "../../catalog";

export const dynamic = "force-dynamic";

const CATALOG_PATH = path.join(process.cwd(), "app", "catalog.ts");

/** أقصى سعرٍ مقبول — حارسٌ ضد رقمٍ لُصق سهوًا، لا حدٌّ تجاريّ */
const MAX_PRICE = 10_000_000;

/** الحقول النصّية التي تُحرَّر من اللوحة، بترتيب ظهورها في الكتلة */
const TEXT_FIELDS = ["size", "longevity", "gender"] as const;
type TextField = (typeof TEXT_FIELDS)[number];

const GENDERS: Gender[] = ["رجالي", "نسائي", "للجنسين"];

const isBranchId = (v: string): v is BranchId =>
  BRANCHES.some((b) => b.id === v);

const isTextField = (v: string): v is TextField =>
  (TEXT_FIELDS as readonly string[]).includes(v);

/** فاصل أسطر الملف كما هو — الإدراج بفاصلٍ غريبٍ يخلط CRLF بـ LF في ملفٍ واحد */
const newlineOf = (src: string) => (src.includes("\r\n") ? "\r\n" : "\n");

/** حدود كتلة عطرٍ بعينه في المصدر */
function blockOf(src: string, id: string) {
  const at = src.indexOf(`id: "${id}",`);
  if (at === -1) return null;
  const end = src.indexOf("\n  },", at);
  if (end === -1) return null;
  return { at, end, text: src.slice(at, end) };
}

/** يبدّل سعر فرعٍ واحد داخل سطر `branches` الخاص بعطرٍ واحد.
 *  السعر `null` يعني «بلا سعر» فيعود المفتاح `{}` وتقول الواجهة «السعر عند الطلب». */
function setPrice(
  src: string,
  id: string,
  branch: BranchId,
  price: number | null
): string {
  const at = src.indexOf(`id: "${id}",`);
  if (at === -1) return src;

  const start = src.indexOf("branches: {", at);
  if (start === -1) return src;

  const end = src.indexOf("\n", start);
  const line = src.slice(start, end);

  // الفرع الغائب عن السطر يبقى غائبًا: الصفحة لا تعرض إلا فروعًا يُباع فيها العطر،
  // فغيابُه هنا يعني أن أحدًا حذفه من المصدر بعد فتح الصفحة.
  const key = new RegExp(`${branch}: \\{[^}]*\\}`);
  if (!key.test(line)) return src;

  const next = line.replace(
    key,
    price === null ? `${branch}: {}` : `${branch}: { price: ${price} }`
  );

  return src.slice(0, start) + next + src.slice(end);
}

/** يضبط حقلًا نصّيًّا في كتلة عطر: يبدّله إن وُجد، ويُدرجه قبل `tint` إن غاب،
 *  ويحذف سطره إن كانت القيمة فارغة — فالحقلُ الغائب أصدقُ من حقلٍ بقيمةٍ خاوية. */
function setText(
  src: string,
  id: string,
  field: TextField,
  value: string | null
): string {
  const block = blockOf(src, id);
  if (!block) return src;

  const nl = newlineOf(src);
  // الالتقاط بلا فاصل السطر ولا CR: من التقط `\r` ثم حذف `\r\n` + السطر
  // أكل فاصلَ ما قبله وأبقى فاصلَ ما بعده، فخلط CRLF بـ LF في ملفٍ واحد.
  const existing = block.text.match(
    new RegExp(`^ *${field}: "[^"\\r\\n]*",`, "m")
  );

  let next: string;
  if (existing) {
    const line = existing[0];
    const indent = line.match(/^ */)?.[0] ?? "    ";
    next =
      value === null
        ? // يُحذف السطر ومعه الفاصلُ الذي قبله، فلا يبقى سطرٌ فارغ
          block.text.replace(new RegExp(`\\r?\\n${escapeRe(line)}`), "")
        : block.text.replace(line, `${indent}${field}: "${value}",`);
  } else {
    if (value === null) return src;
    // `tint` حقلٌ إلزاميّ في كل عطر، فهو مرساةٌ مضمونةٌ للإدراج قبلها.
    const tint = block.text.match(/^ *tint: [^\r\n]*,/m);
    if (!tint) return src;
    const indent = tint[0].match(/^ */)?.[0] ?? "    ";
    next = block.text.replace(
      tint[0],
      `${indent}${field}: "${value}",${nl}${tint[0]}`
    );
  }

  return src.slice(0, block.at) + next + src.slice(block.end);
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** نصٌّ يُكتب داخل مزدوجتين في ملف TypeScript: لا مزدوجة ولا شرطة مائلة ولا سطر جديد */
const cleanText = (v: string) => v.replace(/["\\\r\n]/g, "").trim();

export async function POST(request: Request) {
  // اللوحة أداةُ تحريرٍ على جهاز صاحب المحل، لا صفحةً على الموقع المنشور.
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلبٌ غير مقروء" }, { status: 400 });
  }

  const { prices, fields } = (body ?? {}) as {
    prices?: unknown;
    fields?: unknown;
  };

  if (!prices && !fields) {
    return NextResponse.json({ error: "لا تغييرات في الطلب" }, { status: 400 });
  }

  // يُتحقَّق من كل قيمة قبل لمس الملف: إمّا يُحفظ الطلب كلُّه أو لا يُكتب منه شيء.
  const priceEdits: { id: string; branch: BranchId; price: number | null }[] = [];
  const textEdits: { id: string; field: TextField; value: string | null }[] = [];

  if (prices && typeof prices === "object") {
    for (const [id, byBranch] of Object.entries(prices as Record<string, unknown>)) {
      const perfume = CATALOG.find((p) => p.id === id);
      if (!perfume) {
        return NextResponse.json({ error: `عطرٌ مجهول: ${id}` }, { status: 400 });
      }
      if (!byBranch || typeof byBranch !== "object") {
        return NextResponse.json({ error: `أسعارٌ غير مقروءة: ${id}` }, { status: 400 });
      }

      for (const [branch, value] of Object.entries(byBranch as Record<string, unknown>)) {
        if (!isBranchId(branch) || !perfume.branches[branch]) {
          return NextResponse.json(
            { error: `${perfume.name}: فرعٌ غير معروض فيه (${branch})` },
            { status: 400 }
          );
        }
        if (value === null) {
          priceEdits.push({ id, branch, price: null });
          continue;
        }
        if (
          typeof value !== "number" ||
          !Number.isInteger(value) ||
          value <= 0 ||
          value > MAX_PRICE
        ) {
          return NextResponse.json(
            { error: `${perfume.name}: سعرٌ غير صالح (${String(value)})` },
            { status: 400 }
          );
        }
        priceEdits.push({ id, branch, price: value });
      }
    }
  }

  if (fields && typeof fields === "object") {
    for (const [id, byField] of Object.entries(fields as Record<string, unknown>)) {
      const perfume = CATALOG.find((p) => p.id === id);
      if (!perfume) {
        return NextResponse.json({ error: `عطرٌ مجهول: ${id}` }, { status: 400 });
      }
      if (!byField || typeof byField !== "object") {
        return NextResponse.json({ error: `حقولٌ غير مقروءة: ${id}` }, { status: 400 });
      }

      for (const [field, raw] of Object.entries(byField as Record<string, unknown>)) {
        if (!isTextField(field)) {
          return NextResponse.json(
            { error: `${perfume.name}: حقلٌ غير معروف (${field})` },
            { status: 400 }
          );
        }
        if (raw === null || raw === "") {
          textEdits.push({ id, field, value: null });
          continue;
        }
        if (typeof raw !== "string") {
          return NextResponse.json(
            { error: `${perfume.name}: قيمةٌ غير نصّية في ${field}` },
            { status: 400 }
          );
        }

        const value = cleanText(raw);
        if (!value) {
          textEdits.push({ id, field, value: null });
          continue;
        }
        if (value.length > 40) {
          return NextResponse.json(
            { error: `${perfume.name}: نصٌّ أطول من أربعين حرفًا في ${field}` },
            { status: 400 }
          );
        }
        // النوعُ قائمةٌ مغلقة: قيمةٌ خارجها تكسر أنواع TypeScript عند البناء.
        if (field === "gender" && !GENDERS.includes(value as Gender)) {
          return NextResponse.json(
            { error: `${perfume.name}: نوعٌ غير معروف (${value})` },
            { status: 400 }
          );
        }
        textEdits.push({ id, field, value });
      }
    }
  }

  try {
    const before = await readFile(CATALOG_PATH, "utf8");

    let after = priceEdits.reduce(
      (src, e) => setPrice(src, e.id, e.branch, e.price),
      before
    );
    // بترتيب الحقول لا بترتيب ورودها: كلٌّ يُدرج قبل `tint` فيستقرّ
    // size ثم longevity ثم gender كما في تعريف النوع.
    for (const field of TEXT_FIELDS) {
      for (const e of textEdits.filter((t) => t.field === field)) {
        after = setText(after, e.id, e.field, e.value);
      }
    }

    if (after === before) {
      return NextResponse.json({ saved: 0 });
    }

    // كتابةٌ في مكانها لا عبر ملفٍ مؤقّتٍ ثم إعادة تسمية:
    // OneDrive يزامن المجلّد وقد يقفل الاسم فتفشل إعادة التسمية بـ EPERM.
    await writeFile(CATALOG_PATH, after, "utf8");
    return NextResponse.json({ saved: priceEdits.length + textEdits.length });
  } catch (err) {
    return NextResponse.json(
      { error: `تعذّرت الكتابة: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
