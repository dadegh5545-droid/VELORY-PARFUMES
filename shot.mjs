import { chromium } from "@playwright/test";
const dir = process.argv[2];
const b = await chromium.launch();
for (const w of [1440, 1366, 768, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w === 390 ? 844 : w === 768 ? 1024 : 768 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => localStorage.setItem("valory.prefs", JSON.stringify({ branch: "chad", locale: "ar" })));
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${dir}/home-${w}.png` });          // first viewport
  await p.evaluate(() => document.querySelector("#chad")?.scrollIntoView());
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${dir}/grid-${w}.png` });          // product grid
  await ctx.close();
}
await b.close();
console.log("shots →", dir);
