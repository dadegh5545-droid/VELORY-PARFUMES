/**
 * فحصُ التخطيط: تراكبٌ وفيضٌ وأخطاءُ طرفية.
 *
 * يُشغَّل على بناءِ إنتاجٍ محلّيٍّ أو على الموقع الحيّ:
 *   node qa/layout-check.mjs [BASE_URL]
 *
 * ثلاثةُ أحكام:
 *  ١) لا يتقاطع عنصران مرئيّان من عناصر الواجهة والبطاقة. التراكبُ هو
 *     ما جعل الصورةَ تركب على النصّ واسمَ العطر على النقاط.
 *  ٢) كلُّ عنصرٍ نصّيٍّ داخلَ الشاشة تمامًا — لا يخرج طرفُه عن الحوافّ.
 *  ٣) لا تجاوزَ أفقيّ، ولا صورةَ مكسورة، ولا خطأَ في طرفية المتصفّح.
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3000";

/** المقاساتُ الستّة المطلوبة — ثلاثةُ هواتفَ ولوحيٌّ وشاشتا حاسوب */
const SIZES = [
  [360, 740],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1366, 768],
  [1440, 900],
];

const LOCALES = ["ar", "fr", "en"];

/** ما يُفحص تراكبُه — إخوةٌ يقع بعضُهم على بعضٍ حين ينكسر التخطيط.
 *  الزخارفُ المطلقةُ (الهالة، النقش، المشهد) خارجَه: هي طبقاتٌ بقصد. */
const HERO = [
  ".hero-chad-title",
  ".hero-chad-text",
  ".hero-carousel",
  ".hero-chad-name",
  ".hero-dots",
  ".hero-chad-actions",
  ".hero-chad-strip",
];

const CARD = [".card h3", ".card .latin", ".card .notes", ".card-foot"];

/** نصوصٌ يجب أن تقع داخل الشاشة كاملةً */
const TEXT = [
  ".hero-chad-title",
  ".hero-chad-text",
  ".hero-chad-name",
  ".hero-chad-strip",
  ".branch-strip",
  ".section-head h2",
];

const overlapProbe = (hero, card, text) =>
  // يُنفَّذ داخل الصفحة: يقيس المستطيلاتِ ويعيد ما تقاطع أو خرج
  `(() => {
    const vis = (e) => {
      if (!e) return false;
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return false;
      const r = e.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    };
    const rect = (e) => e.getBoundingClientRect();
    // تسامحٌ 1px: تقريبُ المتصفّح للكسور ليس تراكبًا
    const hits = (a, b) =>
      a.right - 1 > b.left && b.right - 1 > a.left &&
      a.bottom - 1 > b.top && b.bottom - 1 > a.top;

    const out = { overlaps: [], outside: [], overflow: 0, broken: [] };

    const group = (sels, scope, tag) => {
      const els = sels
        .map((s) => ({ s, e: scope.querySelector(s) }))
        .filter((x) => vis(x.e));
      for (let i = 0; i < els.length; i++)
        for (let j = i + 1; j < els.length; j++) {
          const a = els[i], b = els[j];
          // احتواءٌ لا تراكب: الأبُ يحيط بابنه دائمًا، وذلك تخطيطٌ سليم
          if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
          if (hits(rect(a.e), rect(b.e)))
            out.overlaps.push(tag + ": " + a.s + " ✕ " + b.s);
        }
    };

    group(${JSON.stringify(hero)}, document, "الواجهة");
    const firstCard = document.querySelector(".card");
    if (firstCard) group(${JSON.stringify(card)}, firstCard, "بطاقة");

    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    for (const s of ${JSON.stringify(text)}) {
      const e = document.querySelector(s);
      if (!vis(e)) continue;
      const r = rect(e);
      // الرأسيُّ يُقاس بعد التمرير إليه، فيُفحص الأفقيُّ وحده هنا
      if (r.left < -1 || r.right > vw + 1)
        out.outside.push(s + " (يسار " + Math.round(r.left) + "، يمين " + Math.round(r.right) + " من " + vw + ")");
    }

    out.overflow = document.documentElement.scrollWidth - vw;
    out.broken = [...document.images]
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => i.currentSrc || i.src);
    return out;
  })()`;

const browser = await chromium.launch();
const problems = [];
let checks = 0;

for (const locale of LOCALES) {
  console.log(`\n══ ${locale} ══`);
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript(
      (l) => localStorage.setItem("valory.prefs", JSON.stringify({ branch: "chad", locale: l })),
      locale
    );
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    page.on("pageerror", (e) => errs.push("pageerror: " + e.message));

    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);

    // الواجهةُ أوّلًا وهي في الشاشة
    const hero = await page.evaluate(overlapProbe(HERO, [], TEXT));

    // ثم الشبكةُ بعد التمرير إليها
    await page.evaluate(() => document.querySelector("#chad")?.scrollIntoView());
    await page.waitForTimeout(700);
    const grid = await page.evaluate(overlapProbe([], CARD, [".branch-strip", ".section-head h2"]));

    const all = {
      overlaps: [...hero.overlaps, ...grid.overlaps],
      outside: [...hero.outside, ...grid.outside],
      overflow: Math.max(hero.overflow, grid.overflow),
      broken: [...hero.broken, ...grid.broken],
    };

    const tag = `${locale} @${w}×${h}`;
    const ok =
      !all.overlaps.length && !all.outside.length && all.overflow <= 0 && !all.broken.length && !errs.length;
    console.log(
      `  ${String(w).padStart(4)}×${h}  ` +
        `تراكب=${all.overlaps.length} خارج=${all.outside.length} تجاوز=${all.overflow}px ` +
        `مكسورة=${all.broken.length} أخطاء=${errs.length}  ${ok ? "✅" : "⚠️"}`
    );
    all.overlaps.forEach((o) => { console.log("      ✕ " + o); problems.push(`${tag} تراكب — ${o}`); });
    all.outside.forEach((o) => { console.log("      ↔ " + o); problems.push(`${tag} خارج الشاشة — ${o}`); });
    if (all.overflow > 0) problems.push(`${tag} تجاوزٌ أفقيّ ${all.overflow}px`);
    all.broken.forEach((o) => problems.push(`${tag} صورة مكسورة — ${o}`));
    errs.forEach((e) => { console.log("      ! " + e.slice(0, 110)); problems.push(`${tag} خطأ — ${e.slice(0, 90)}`); });

    checks++;
    await ctx.close();
  }
}

await browser.close();
console.log(`\n════ ${checks} فحصًا ════`);
console.log(problems.length ? problems.map((p) => "  ⚠️ " + p).join("\n") : "  لا مشاكل ✅");
process.exit(problems.length ? 1 : 0);
