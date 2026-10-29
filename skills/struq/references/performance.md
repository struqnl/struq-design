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
| JavaScript on first load | about 200KB gzipped for the route | three.js and R3F never in it; lazy island only |

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

- `preload` (Next 16) or `priority` (Next 15) on exactly one image: the LCP image of that page. Never `fetchPriority="high"` without `loading="eager"`; on a lazy image the hint does nothing.
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
- drei's `useGLTF` takes meshopt as a boolean and ships its own decoder: `useGLTF(url, true, true)` (Draco on, meshopt on). The Draco decoder path is optional (a string in place of the second argument); without it drei loads the decoder from its default CDN. See [webgl-scenes.md](webgl-scenes.md).
- Textures are usually the weight, not geometry: 2048 max on desktop, 1024 for mobile variants.
- `useGLTF.preload` only for the model in the first viewport; everything else loads when its island mounts.
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

1. Build for production (`next build && next start`), never measure the dev server.
2. Lighthouse (or PageSpeed Insights on the deploy) on the home page and one inner page, mobile profile. Record LCP, CLS and the total transfer size under VERIFY. Lab Lighthouse reports TBT, not INP: INP needs field data (PageSpeed's CrUX panel once the site has traffic) or a manual interaction trace in the performance panel (click the menu, a hover scene and a form control; read the longest interaction). Until then write "INP: field data pending" with the TBT number.
3. Scroll the full page with the browser's performance panel recording: no long tasks during scroll, frames steady through the pinned showpiece.
4. Re-run the size listing from §2 on the output: nothing over budget without a written reason in STRUQ.md.
