# Performance: cinematic and fast

An award-tier site that stutters or takes four seconds to show its hero is not award-tier. The motion in this skill is cheap when it runs on one clock and animates transforms; what actually makes these sites slow is **assets**: a 40MB hero video, PNG photography, an unoptimized GLB, six font files. Fix assets first, then code.

Run this in two places: on every build before verify, and first thing on a redesign of an existing project (existing projects are almost always carrying badly optimized media).

## 1. Budgets

| Asset | Budget | Notes |
|---|---|---|
| Hero image | 250KB at 1920w (AVIF or WebP) | the LCP element on most pages; preload it |
| Content image | 150KB at 1440w | lazy below the first viewport |
| Hero or ambient video loop | 2 to 4MB, 6 to 12s, no audio | always a poster; WebM first, MP4 fallback |
| Any single video | 10MB max | longer content belongs on a video host |
| GLB model | 1 to 3MB after compression | Draco or meshopt geometry, KTX2 or WebP textures |
| Fonts | 2 families, 4 files max, about 150KB total | WOFF2, subset, variable where possible |
| JavaScript on first load | about 250KB gzipped for the route, measured (§8) | three.js and R3F never in it; lazy island only |

**Where the 250KB goes** (measured on a dry run with a recent Next.js and React, three.js correctly excluded: 244KB gzipped for `/`): the framework runtime (React, React DOM, the Next.js client and router) is roughly 150 to 190KB of it and is not yours to cut; GSAP core, ScrollTrigger, SplitText and DrawSVG are about 49KB; Lenis about 6KB; the rest is your components. Over budget, cut in this order: GSAP plugins registered but unused (MorphSVG and Flip are the usual passengers, [setup.md](setup.md) §1), Motion on a page where nothing uses it, Radix primitives imported into the root layout instead of the component that opens them, then heavy client components that could stay server components. The framework share moves with each major, so measure on the installed versions and write the number under VERIFY; never quote this table as the measurement.

Targets on a mid-range phone profile: **LCP under 2.5s, CLS under 0.1, INP under 200ms**. Record them under VERIFY in STRUQ.md ([direction.md](direction.md)).

## 2. Audit an existing project (redesign mode, step one)

```bash
# the 25 heaviest files under public/ and any asset folders
find public assets -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.webm" -o -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" -o -iname "*.avif" -o -iname "*.gif" -o -iname "*.svg" -o -iname "*.glb" -o -iname "*.gltf" -o -iname "*.ttf" -o -iname "*.otf" -o -iname "*.woff" -o -iname "*.woff2" \) -printf "%s\t%p\n" 2>/dev/null | sort -rn | head -25 | awk -F'\t' '{printf "%8.1f KB  %s\n", $1/1024, $2}'

# what a video actually is: codec, size, fps, duration, bitrate, audio
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate:format=duration,bit_rate,size -of compact input.mp4
```

(On macOS, `find -printf` is unavailable: use `du -k` over the same globs.)

List every file over budget with its role (hero, ambient, content, poster), then fix them in this order: videos, images, models, fonts. Replace references in code to point at the optimized files; never optimize in place over the source.

## 3. Video with ffmpeg

Decorative and hero loops: strip audio, cap at 30fps, never upscale, trim to the loop.

```bash
# WebM (VP9), primary source. CRF 32 to 36 for ambient, 28 to 32 for a hero that people look at.
ffmpeg -i input.mov -t 10 -an -vf "scale='min(1920,iw)':-2,fps=30" \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -pix_fmt yuv420p -row-mt 1 -deadline good -cpu-used 2 \
  public/media/hero.webm

# MP4 (H.264), fallback. faststart so playback starts before the download ends.
ffmpeg -i input.mov -t 10 -an -vf "scale='min(1920,iw)':-2,fps=30" \
  -c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p -movflags +faststart \
  public/media/hero.mp4

# Mobile variant: same commands with min(1080,iw) and one CRF step higher.

# Poster from a representative frame (pick the second, never a black first frame)
ffmpeg -ss 2.5 -i input.mov -frames:v 1 -vf "scale='min(1920,iw)':-2" -c:v libwebp -quality 80 public/media/hero-poster.webp
```

```tsx
<video autoPlay muted loop playsInline preload="metadata" poster="/media/hero-poster.webp">
  <source src="/media/hero.webm" type="video/webm" />
  <source src="/media/hero.mp4" type="video/mp4" />
</video>
```

- Under `prefers-reduced-motion` or Save-Data, show the poster and do not autoplay.
- Pause offscreen loops (IntersectionObserver); keep one decoding video per viewport.
- A scroll-scrubbed video sequence is better as a WebP frame sequence on a canvas than as `currentTime` scrubbing, which stutters on most browsers: `ffmpeg -i input.mov -vf "fps=24,scale='min(1440,iw)':-2" -c:v libwebp -quality 75 frames/%04d.webp`, then cap the count (120 to 180 frames).

## 4. Images

Use `next/image` for everything it can serve: it negotiates AVIF and WebP and resizes per `sizes`. Set `images.formats = ["image/avif", "image/webp"]` in `next.config`. What it cannot fix is a 12MB source in the repo, so normalize sources first:

```bash
# one-off with sharp-cli: cap sources at 2400w and convert to high-quality WebP
npx sharp-cli -i "assets/raw/*.{jpg,png}" -o public/images/ resize 2400 --withoutEnlargement -f webp -q 82
```

- The LCP hint on exactly one image, the LCP image of that page: `preload` or `priority`, whichever the installed `next/image` declares ([setup.md](setup.md) §0, Known API shifts). Never `fetchPriority="high"` without `loading="eager"`; on a lazy image the hint does nothing.
- `sizes` on every large image, matching the layout (`(min-width: 1024px) 50vw, 100vw`).
- Width and height, or `fill` inside a sized frame, on every image: that is CLS.
- PNG only for real transparency that WebP cannot carry; GIF never (convert to a muted video loop).
- The grade from [imagery.md](imagery.md) is applied before export, not with CSS filters at runtime.

## 5. 3D models and textures

```bash
# one command: dedupe, weld, meshopt geometry, WebP textures capped at 2048,
# with the scene graph kept intact
npx @gltf-transform/cli optimize input.glb public/models/product.glb \
  --compress meshopt --texture-compress webp --texture-size 2048 \
  --flatten false --join false
```

- `--flatten false --join false` keep the node hierarchy and names. The defaults flatten the scene and merge meshes, which drops the node names that rigs, `useGLTF` lookups and per-part animation target. Drop the two flags only for a static, single-object model that nothing addresses by name.
- drei's `useGLTF` takes meshopt as a boolean and ships its own decoder: `useGLTF(url, true, true)` (Draco on, meshopt on). The Draco decoder is fetched only for a Draco-compressed file; self-host it once with `useGLTF.setDecoderPath("/draco/")` at module level in the island. See [webgl-scenes.md](webgl-scenes.md) §1.
- Textures are usually the weight, not geometry: 2048 max on desktop, 1024 for mobile variants.
- Every model loads when its island mounts. `useGLTF.preload` buys nothing inside the lazy island (it runs only when the island chunk loads), and calling it from the section pulls three into the page bundle; the poster covers the wait.
- Always ship the poster image that stands in before and instead of the canvas ([webgl-r3f.md](webgl-r3f.md)).

## 6. Fonts

- Two families, WOFF2 only, variable files where they exist. `next/font` self-hosts and subsets Google fonts automatically; for local files subset to the languages used.
- Preload the display and the body face, nothing else.
- `adjustFontFallback` (default in `next/font`) to keep CLS near zero when the face swaps.
- The TTF kept for OG images lives outside `public/` so it is never shipped to browsers ([seo.md](seo.md)).

## 7. Code

- **Lazy WebGL.** three.js, R3F, Drei and postprocessing load only inside the island, via `next/dynamic` with `ssr: false`. They must never appear in the first-load bundle.
- **One clock.** Lenis, ScrollTrigger and R3F all on `gsap.ticker` ([setup.md](setup.md)); a second requestAnimationFrame loop is a performance bug, not a style choice.
- **Animate transforms and opacity only.** Never `top`, `left`, `width`, `height` or `filter: blur()` on scroll. `clip-path` and masks are fine for reveals.
- **No React state per frame.** Scroll and pointer values go to refs, CSS variables or uniforms ([webgl-r3f.md](webgl-r3f.md) §3).
- **`will-change` only while animating**, set and cleared by the timeline, never globally.
- **Clean up.** Every `useGSAP` scope reverts on unmount; route changes must not leave ScrollTriggers, tickers or canvases alive ([route-transitions.md](route-transitions.md)).
- **Register only the GSAP plugins in use.**

## 8. Verify

1. **Build for production and serve it** (`next build && next start -p <port>`, or `vite build && vite preview --port <port>`). Never measure or shoot the dev server. **Confirm the port belongs to the server you just started:** before starting, `lsof -i :<port>` (Windows: `netstat -ano | findstr :<port>`) shows nothing; after, it shows the PID of that production process. A dev server left running on the same port answers every request silently, and `next start` then fails with `EADDRINUSE` in a log nobody reads.
2. **First-load JS.** Turbopack builds print no per-route "First Load JS" table, so measure it from the served HTML. The script also proves three.js is absent on touch and arrives lazily on desktop:

   ```js
   // scripts/firstload.mjs: node scripts/firstload.mjs http://localhost:<port>
   import { gzipSync } from "node:zlib";
   import { chromium } from "playwright";

   const base = process.argv[2];
   const html = await (await fetch(base + "/")).text();
   const srcs = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]))];
   const THREE = /WebGLRenderer|WebGL2RenderingContext|react-three-fiber/;
   let raw = 0, gz = 0;
   const hits = [];
   for (const s of srcs) {
     const buf = Buffer.from(await (await fetch(new URL(s, base))).arrayBuffer());
     raw += buf.length; gz += gzipSync(buf).length;
     if (THREE.test(buf.toString("utf8"))) hits.push(s);
   }
   console.log(`first-load: ${srcs.length} scripts, ${(raw / 1024).toFixed(1)} kB raw, ${(gz / 1024).toFixed(1)} kB gzip`);
   console.log(`three.js in first load: ${hits.length ? hits.join(", ") : "none"}`);

   const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
   for (const [name, opts] of [
     ["desktop", { viewport: { width: 1440, height: 900 } }],
     ["phone", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
   ]) {
     const page = await browser.newPage(opts);
     const js = [];
     page.on("response", async (r) => {
       if (!r.url().endsWith(".js")) return;
       try { const b = await r.body(); js.push({ kb: b.length / 1024, three: THREE.test(b.toString("utf8")) }); } catch {}
     });
     await page.goto(base, { waitUntil: "networkidle" });
     await page.waitForTimeout(1500);
     const lazy = js.filter((j) => j.three);
     console.log(`${name}: ${js.length} JS files; three.js chunks ${lazy.length} (${lazy.reduce((a, b) => a + b.kb, 0).toFixed(1)} kB raw)`);
     await page.close();
   }
   await browser.close();
   ```

3. **LCP and CLS: an in-page probe** under 4x CPU and a throttled network (about 1.6 Mbps down, 150ms latency), mobile 390 and desktop 1440. It names the LCP element, which is the number that matters: with a hidden split hero or a match cut, the LCP element is whatever appears last, and on an unthrottled local server the figure is meaningless (a text hero measures 150ms locally).

   ```js
   // scripts/vitals.mjs: node scripts/vitals.mjs http://localhost:<port>
   import { chromium } from "playwright";

   const base = process.argv[2];
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
     await page.waitForTimeout(5000);           // let timed entrances finish: their content is often the LCP
     await page.mouse.wheel(0, 600);            // LCP stops recording at the first input
     await page.waitForTimeout(500);
     const v = await page.evaluate(() => window.__vitals);
     console.log(`${label}: LCP ${(v.lcp / 1000).toFixed(2)}s (${v.el.trim()}), CLS ${v.cls.toFixed(3)}`);
     await ctx.close();
   }
   await browser.close();
   ```

   Lighthouse (or PageSpeed Insights on the deploy) on the home page and one inner page is the second opinion. Lab tools report TBT, not INP: INP needs field data (PageSpeed's CrUX panel once the site has traffic) or a manual interaction trace in the performance panel (click the menu, a hover scene and a form control; read the longest interaction). Until then write "INP: field data pending" with the TBT number.
4. **Frame trace for timed entrances.** A PNG at rest cannot show a hold that fires over an empty frame, a split hero that flashes unsplit, or a reveal stuck at opacity 0. Capture the first 3 seconds and look at the frames in order:

   ```js
   // scripts/trace.mjs: node scripts/trace.mjs http://localhost:<port>  (writes shots/trace-<w>-NN.png)
   import { mkdirSync } from "node:fs";
   import { chromium } from "playwright";

   const base = process.argv[2];
   mkdirSync("shots", { recursive: true });
   const browser = await chromium.launch();
   for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
     const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile });
     const t0 = Date.now();
     await page.goto(base, { waitUntil: "commit" });
     for (let i = 0; i < 15; i++) {
       await page.screenshot({ path: `shots/trace-${w}-${String(i).padStart(2, "0")}.png` }).catch(() => {});
       console.log(`${w} frame ${i}: ${Date.now() - t0}ms`);
       await page.waitForTimeout(200);
     }
     await page.close();
   }
   await browser.close();
   ```

   Each entrance must do what its recipe says: the hold frame of a match cut is the photo ([page-entrances.md](page-entrances.md)), the split hero never shows unsplit, nothing stays invisible ([pitfalls.md](pitfalls.md) §3).
5. Scroll the full page with the browser's performance panel recording: no long tasks during scroll, frames steady through the pinned showpiece.
6. Re-run the size listing from §2 on the output: nothing over budget without a written reason in STRUQ.md.

The scripts use the `playwright` package (`npm i -D playwright`, then `npx playwright install chromium`); any harness browser tool that can throttle, observe and screenshot does the same job.
