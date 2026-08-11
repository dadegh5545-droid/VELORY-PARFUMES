// كتابة أسعار الكتالوج في مصدرها — يخدم صفحة /admin/prices وحدها.
//
// الأسعار تعيش في app/catalog.ts لا في قاعدة بيانات، فالحفظ هنا تحريرُ نصٍّ:
// نبدّل قيمة الفرع داخل سطر `branches` الخاص بكل عطر ونترك ما عداه كما هو،
// كي لا يمحو الحفظُ تعليقًا ولا ترتيبًا ولا حقلًا أضافه محرّرٌ بيده.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { BRANCHES, CATALOG, type BranchId } from "../../catalog";

export const dynamic = "force-dynamic";

const CATALOG_PATH = path.join(process.cwd(), "app", "catalog.ts");

/** أقصى سعرٍ مقبول — حارسٌ ضد رقمٍ لُصق سهوًا، لا حدٌّ تجاريّ */
const MAX_PRICE = 10_000_000;

const isBranchId = (v: string): v is BranchId =>
  BRANCHES.some((b) => b.id === v);

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

  const prices = (body as { prices?: unknown })?.prices;
  if (!prices || typeof prices !== "object") {
    return NextResponse.json({ error: "لا أسعار في الطلب" }, { status: 400 });
  }

  // يُتحقَّق من كل قيمة قبل لمس الملف: إمّا يُحفظ الطلب كلّه أو لا يُكتب منه شيء.
  const edits: { id: string; branch: BranchId; price: number | null }[] = [];

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
        edits.push({ id, branch, price: null });
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
      edits.push({ id, branch, price: value });
    }
  }

  try {
    const before = await readFile(CATALOG_PATH, "utf8");
    const after = edits.reduce(
      (src, e) => setPrice(src, e.id, e.branch, e.price),
      before
    );

    if (after === before) {
      return NextResponse.json({ saved: 0 });
    }

    // كتابةٌ في مكانها لا عبر ملفٍ مؤقّتٍ ثم إعادة تسمية:
    // OneDrive يزامن المجلّد وقد يقفل الاسم فتفشل إعادة التسمية بـ EPERM.
    await writeFile(CATALOG_PATH, after, "utf8");
    return NextResponse.json({ saved: edits.length });
  } catch (err) {
    return NextResponse.json(
      { error: `تعذّرت الكتابة: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
