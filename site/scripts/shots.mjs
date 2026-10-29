// scripts/shots.mjs: node scripts/shots.mjs http://localhost:3207 [only]
// Verify captures (SKILL.md workflow step 8): four widths at the top, a reduced-motion full
// page, a no-JS full page, and the settled motion-on scroll sequence at 1440.
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3207";
const only = process.argv[3] ?? "all";
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch();
const wait = (p, ms) => p.waitForTimeout(ms);
// Native lazy images only load near the viewport, and a fullPage capture never scrolls:
// walk the page once (wheel works without page JS) so the capture shows what a reader sees.
const preScroll = async (p) => {
  await p.mouse.move(200, 200);
  for (let i = 0; i < 80; i++) { await p.mouse.wheel(0, 600); await wait(p, 60); }
  await wait(p, 800);
  await p.keyboard.press("Home").catch(() => {});
  for (let i = 0; i < 80; i++) { await p.mouse.wheel(0, -600); await wait(p, 20); }
  await wait(p, 1200);
};

if (only === "all" || only === "top") {
  for (const [w, h, mobile] of [[390, 844, true], [768, 1024, true], [1440, 900, false], [1920, 1080, false]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile });
    await page.goto(base, { waitUntil: "networkidle" });
    await wait(page, 3200);
    await page.screenshot({ path: `shots/home-${w}-top.png` });
    await page.close();
  }
}

if (only === "all" || only === "full") {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await preScroll(page);
  await page.screenshot({ path: "shots/home-1440-full-reduced.png", fullPage: true });
  await ctx.close();

  const nojs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p2 = await nojs.newPage();
  await p2.goto(base, { waitUntil: "networkidle" });
  await preScroll(p2);
  await p2.screenshot({ path: "shots/home-1440-full-nojs.png", fullPage: true });
  await nojs.close();

  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const p3 = await m.newPage();
  await p3.goto(base, { waitUntil: "networkidle" });
  await preScroll(p3);
  await p3.screenshot({ path: "shots/home-390-full-reduced.png", fullPage: true });
  await m.close();
}

if (only === "all" || only === "scroll") {
  for (const f of readdirSync("shots")) if (f.startsWith("scroll-1440-")) rmSync(`shots/${f}`);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: "networkidle" });
  await wait(page, 3000);
  await page.mouse.move(720, 450);
  let last = -1;
  for (let i = 0; i < 60; i++) {
    await page.screenshot({ path: `shots/scroll-1440-${String(i).padStart(2, "0")}.png` });
    const y = await page.evaluate(() => window.scrollY);
    if (y === last) break;
    last = y;
    for (let k = 0; k < 7; k++) { await page.mouse.wheel(0, 100); await wait(page, 30); }
    await wait(page, 1900); // let Lenis, the scrub and every reveal settle before the next frame
  }
  await page.close();
}

await browser.close();
