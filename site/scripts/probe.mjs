// scripts/probe.mjs: node scripts/probe.mjs http://localhost:3207
// Layout facts the screenshots cannot show: footer height against the viewport (footer-reveal),
// horizontal overflow, and the html classes Lenis leaves.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3207";
const browser = await chromium.launch();
for (const [w, h] of [[390, 844], [768, 1024], [1440, 900], [1920, 1080]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({
    footer: document.querySelector("footer")?.offsetHeight,
    fits: document.documentElement.hasAttribute("data-footer-fits"),
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    height: document.documentElement.scrollHeight,
    html: document.documentElement.className,
  }));
  console.log(`${w}x${h}`, JSON.stringify(r));
  await page.close();
}
await browser.close();
