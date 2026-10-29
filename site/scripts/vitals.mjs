// scripts/vitals.mjs: node scripts/vitals.mjs http://localhost:3207 (performance.md §8)
// LCP (with its element) and CLS under 4x CPU and a throttled network, mobile 390 and desktop 1440.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3207";
const browser = await chromium.launch();
for (const [label, opts] of [
  ["mobile 390", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
  ["desktop 1440", { viewport: { width: 1440, height: 900 } }],
]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
  });
  await page.addInitScript(() => {
    const v = { lcp: 0, cls: 0, el: "" };
    Object.assign(window, { __vitals: v });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        v.lcp = e.startTime;
        const el = e.element;
        v.el = el ? `${el.tagName} ${(el.getAttribute("src") ?? el.textContent ?? "").slice(0, 60)}` : "";
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) v.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(base, { waitUntil: "load" });
  await page.waitForTimeout(5000);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(500);
  const v = await page.evaluate(() => window.__vitals);
  console.log(`${label}: LCP ${(v.lcp / 1000).toFixed(2)}s (${v.el.trim()}), CLS ${v.cls.toFixed(3)}`);
  await ctx.close();
}
await browser.close();
