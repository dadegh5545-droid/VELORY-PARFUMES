// رفع صورة منتج — يخدم صفحة /admin/prices وحدها.
//
// الصورة تُحفظ باسم معرّف العطر تحت public/products، ويُضبط حقل `image`
// في app/catalog.ts ليشير إليها. فما يُرفع هنا يُرفع مع الكود إلى Amplify.

import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { CATALOG } from "../../catalog";

export const dynamic = "force-dynamic";

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, "app", "catalog.ts");
const PRODUCTS_DIR = path.join(ROOT, "public", "products");

const MAX_BYTES = 8 * 1024 * 1024;

/** الامتدادات التي يعرضها المتصفّح بلا وسيط — والصيغة تُؤخذ من النوع لا من اسم الملف */
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** يضبط حقل `image` لعطرٍ بعينه، ويُدرجه بعد `tint` إن لم يكن له حقلٌ أصلًا.
 *  الالتقاط بلا فاصل السطر: `$` في ملفٍ بنهايات CRLF لا يطابق بعد `,`
 *  لأن `\r` بينهما، فينفلت الحقلُ الموجود ويفشل الإدراج صامتًا. */
function setImage(src: string, id: string, url: string): string {
  const at = src.indexOf(`id: "${id}",`);
  if (at === -1) return src;

  const stop = src.indexOf("\n  },", at);
  if (stop === -1) return src;
  const block = src.slice(at, stop);
  const nl = src.includes("\r\n") ? "\r\n" : "\n";

  const existing = block.match(/^ *image: "[^"\r\n]*",/m);
  if (existing) {
    const line = existing[0];
    const indent = line.match(/^ */)?.[0] ?? "    ";
    return (
      src.slice(0, at) +
      block.replace(line, `${indent}image: "${url}",`) +
      src.slice(stop)
    );
  }

  // `tint` حقلٌ إلزاميّ في كل عطر، فهو مرساةٌ مضمونة للإدراج بعدها.
  const tint = block.match(/^ *tint: [^\r\n]*,/m);
  if (!tint) return src;
  const indent = tint[0].match(/^ */)?.[0] ?? "    ";

  return (
    src.slice(0, at) +
    block.replace(tint[0], `${tint[0]}${nl}${indent}image: "${url}",`) +
    src.slice(stop)
  );
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "طلبٌ غير مقروء" }, { status: 400 });
  }

  const id = String(form.get("id") ?? "");
  const file = form.get("file");

  const perfume = CATALOG.find((p) => p.id === id);
  if (!perfume) {
    return NextResponse.json({ error: `عطرٌ مجهول: ${id}` }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لا ملفَّ في الطلب" }, { status: 400 });
  }

  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: `صيغةٌ غير مدعومة: ${file.type || "مجهولة"}` },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `الصورة أكبر من ${MAX_BYTES / 1024 / 1024} م.ب` },
      { status: 400 }
    );
  }

  const name = `${id}.${ext}`;
  const url = `/products/${name}`;

  try {
    await writeFile(
      path.join(PRODUCTS_DIR, name),
      Buffer.from(await file.arrayBuffer())
    );

    // صورةٌ قديمة بصيغةٍ أخرى تصير يتيمةً بعد التبديل — تُحذف كي لا يبقى
    // في public ملفٌّ لا يشير إليه الكتالوج. ولا يُحذف إلا ما اسمه اسمُ العطر.
    for (const other of Object.values(EXT)) {
      if (other === ext) continue;
      await rm(path.join(PRODUCTS_DIR, `${id}.${other}`), { force: true });
    }

    const before = await readFile(CATALOG_PATH, "utf8");
    const after = setImage(before, id, url);
    if (after !== before) await writeFile(CATALOG_PATH, after, "utf8");

    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: `تعذّر الحفظ: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
