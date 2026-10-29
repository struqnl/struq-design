# First-Load Loaders: session-gated, SSR-safe

One arm of the page-flow system, the site's *arrival*. A loader is the route transition's cover phase with no swap ([route-transitions.md](route-transitions.md)): it starts closed and clears once assets are ready. Sibling: [page-entrances.md](page-entrances.md) for what the revealed page does next.

**It is optional.** It is warranted on narrative/portfolio/launch sites and skipped on app/dashboard zones. Keep it short, tie it to real load progress, and play it **once per session**. Never a spinner: the overlay sits on top of finished content and reveals it.

---

## 0. The lifecycle invariant: why flash-free loaders work

A first-load loader has **two different state machines**. Never collapse them into one boolean:

| State | Owner | What it may do |
|---|---|---|
| First paint: play or skip | synchronous script in `<head>` + CSS | Hide SSR loader markup on a revisit before the browser paints |
| Live phase: loading → revealing → done | the mounted loader component | Keep the first-visit curtain mounted until its transform/opacity exit completes |

The classic regression is using one `data-loader-seen` attribute for both jobs, then running `markLoaderSeen()` when the intro starts or when the exit starts. If CSS contains `html[data-loader-seen] [data-first-loader] { display:none }`, that write removes the live curtain immediately. The reveal timeline technically starts against `display:none`, so the user sees a flash/cut instead of a curtain.

**Non-negotiable order:**

1. SSR emits an already-opaque curtain. Any animated word/chars are also emitted in their hidden start state; do not wait for hydration to apply a GSAP `.from()` state.
2. A synchronous `<head>` script stamps the skip attribute only for a session revisit or excluded app route. CSS suppresses that SSR overlay before first paint.
3. On a genuine first visit, await real readiness plus a minimum floor, capped by a safety ceiling. The curtain remains static and opaque while waiting.
4. Start one compositor-only exit (`transform` and/or `opacity`). Do not read layout or change overflow at release time.
5. In the exit's `onComplete`, and only there: persist the session marker, stamp the skip attribute, release scroll, and unmount.

This is why the system stays clean at both ends: the SSR gate prevents revisit flashes, while delayed persistence lets the live curtain finish.

---

## 1. The session gate (shared by every loader)

```ts
// components/ui/loaders/useFirstVisit.ts
const PREFIX = "loader:";
export const LOADER_SEEN_ATTR = "data-loader-seen";

// Inline this synchronously in <head>, before loader markup. It is the only code
// allowed to activate the CSS skip gate before the first paint.
export const PRE_PAINT_LOADER_SCRIPT = `try{if(sessionStorage.getItem('${PREFIX}intro')==='1')document.documentElement.setAttribute('${LOADER_SEEN_ATTR}','1')}catch(e){}`;

export function loaderSeen(id?: string): boolean {
  if (typeof window === "undefined" || !id) return false;
  if (document.documentElement.hasAttribute(LOADER_SEEN_ATTR)) return true;
  try { return sessionStorage.getItem(PREFIX + id) === "1"; } catch { return false; }
}
export function markLoaderSeen(id?: string): void {
  if (typeof window === "undefined" || !id) return;
  // CALL ONLY FROM THE CURTAIN EXIT'S onComplete.
  document.documentElement.setAttribute(LOADER_SEEN_ATTR, "1");
  try { sessionStorage.setItem(PREFIX + id, "1"); } catch { /* private mode → plays every time */ }
}
```

```css
/* SSR revisit gate. This selector is permanent suppression, not animation state. */
html[data-loader-seen] [data-first-loader] {
  display: none !important;
}
```

Mount the loader in a persistent root/marketing layout, never inside a page template that remounts on every client navigation. A small same-document module guard may protect Strict Mode/HMR remounts while the first run is active; session persistence still happens only after the exit completes.

---

## 2. Asset-aware counter (the default loader)

Tie release to **real** readiness (`document.fonts.ready` + critical image decode/load) and a minimum on-screen floor, raced against a hard ceiling. The floor makes a warm-cache run legible; the ceiling means one stalled request can never pin the site.

The key lifecycle, not the visual styling, is:

```tsx
"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { loaderSeen, markLoaderSeen } from "./useFirstVisit";

const MIN_HOLD_MS = 1450;
const SAFETY_CEILING_MS = 4000;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function decodeCriticalHeroImage(src = "/hero-poster.webp"): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.decode().then(resolve).catch(resolve);
  });
}

export function LoaderCounter({ id = "intro" }: { id?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    if (loaderSeen(id)) { setDone(true); return; }
    const layer = root.current;
    if (!layer) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    document.documentElement.classList.add("loader-scroll-lock");

    const assetChecks = Promise.all([
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve(),
      decodeCriticalHeroImage(), // resolve on decode OR error
      wait(MIN_HOLD_MS),
    ]);

    Promise.race([assetChecks, wait(SAFETY_CEILING_MS)]).then(() => {
      if (cancelled) return;
      layer.dataset.loaderPhase = "revealing";
      gsap.to(layer, {
        yPercent: reduce ? 0 : -100,
        autoAlpha: reduce ? 0 : 1,
        duration: reduce ? 0.25 : 0.9,
        ease: reduce ? "power2.out" : "power4.inOut",
        onComplete: () => {
          // Persist LAST. Earlier writes activate the CSS display:none gate and
          // cut this live reveal off.
          markLoaderSeen(id);
          document.documentElement.classList.remove("loader-scroll-lock");
          setDone(true);
        },
      });
    });

    return () => {
      cancelled = true;
      document.documentElement.classList.remove("loader-scroll-lock");
    };
  }, { scope: root });

  if (done) return null;
  return (
    <div ref={root} data-first-loader data-loader-phase="loading"
         className="fixed inset-0 z-[10001] bg-surface-0">
      {/* Encode hidden start states in SSR markup/CSS. If SplitText must create
          them after hydration, keep the whole word visibility:hidden until its
          chars have been positioned, then reveal the wrapper. */}
      <span className="loader-word" style={{ visibility: "hidden" }}>Brand</span>
    </div>
  );
}
```

The readiness callback must only flip state/start a transform. Never run `getBoundingClientRect()`, `ScrollTrigger.refresh()`, image decoding, or synchronous asset work in the release frame.

### Flash-free animated start states

The curtain background itself must be present in SSR HTML. Any content that winds up (masked chars, mark, line, dot) must also start hidden before React runs:

```css
.loader-char { transform: translateY(118%); }
.loader-dot { opacity: 0; transform: scale(0); }
```

For SplitText, SSR cannot emit the generated char wrappers. Set `visibility:hidden` on the unsplit word in JSX, create the split, position every char, then set the wrapper visible. A GSAP `.from()` without that SSR guard is too late: the browser can paint the completed word for one frame before hydration, producing the initial flash.

### Scroll lock without scrollbar shift

`scrollbar-gutter: stable` alone is not enough if the lock changes `<html>` to `overflow:hidden`; Chromium may collapse the gutter because the root is no longer scrollable. Keep the root scrollable and lock the body/content instead:

```css
html { scrollbar-gutter: stable; }
html.loader-scroll-lock {
  overflow-y: scroll;
  touch-action: none;
  overscroll-behavior: none;
}
html.loader-scroll-lock body {
  height: 100dvh;
  overflow: hidden;
}
```

Apply the class while the opaque curtain is present and remove it only after the exit completes. Measure `document.documentElement.clientWidth` before/during/after the lock in browser coverage; all three values must match.

---

## 3. Loader preset menu (pick one per project)

All are SSR-safe overlays at `z-[10001]`, reveal on exit, respect reduced-motion, and use `mixBlendMode: "difference"` so the mark reads on any backdrop. Add the `loaderSeen`/`markLoaderSeen` gate (inside `useGSAP`) for any loader you want to play once per session.

| Preset | Feel | Mechanic | Exit |
|---|---|---|---|
| **Counter** | data / precise | % count tied to real asset load | slide up `yPercent:-100` 0.9s `power4.inOut` |
| **Mark** | minimal / brand | wordmark fades in, holds, layer fades | `opacity→0` 0.6s `power2.inOut` |
| **Shutter** | architectural | grid of tiles holds brand, staggered grid-wipe | tiles `scaleY→0` 0.6s `power3.inOut` |
| **Odometer** | mechanical | rolling 0→100 reel | slide up 0.9s `power4.inOut` |
| **WordCycle** | editorial | masked word reel settles on brand | slide up 0.9s `power4.inOut` |
| **ProgressBar** | restrained | hairline fills 0→100% under a wordmark | slide up 0.8s `power4.inOut` |
| **DrawMark** | crafted | SVG mark draws in (DrawSVG, recipe in [svg-motion.md](svg-motion.md)) + wordmark | layer fades 0.6s |

> **Warning: avoid a scramble / "decode" / terminal-typewriter loader by default.** That monospaced, glitchy-text aesthetic reads as techy filler and collides with the monospace ban ([anti-patterns.md](anti-patterns.md)). Use it only when the brand is genuinely a terminal/dev product.

Example of the gate wired into a preset (Shutter):

```tsx
// components/ui/loaders/LoaderShutter.tsx (abridged)
"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { loaderSeen, markLoaderSeen } from "./useFirstVisit";

export function LoaderShutter({ id, brand = "Brand", rows = 3, cols = 4 }: {
  id?: string; brand?: string; rows?: number; cols?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    if (loaderSeen(id)) { setDone(true); return; } // revisit → hide before paint
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tiles = gsap.utils.toArray<HTMLElement>(".sh-tile");
    const tl = gsap.timeline();
    tl.from(".sh-word", { autoAlpha: 0, y: 14, duration: reduce ? 0.2 : 0.5, ease: "power2.out" });
    tl.to(".sh-word", { autoAlpha: 0, duration: reduce ? 0.2 : 0.4, ease: "power2.in" }, "+=" + (reduce ? 0.1 : 0.35));
    tl.to(tiles, {
      scaleY: 0, transformOrigin: "top", duration: reduce ? 0.3 : 0.6, ease: "power3.inOut",
      stagger: { each: reduce ? 0 : 0.04, grid: [rows, cols], from: "start" },
      onComplete: () => {
        markLoaderSeen(id); // persist only after the last tile has cleared
        setDone(true);
      },
    }, "-=0.1");
  }, { scope: root });

  if (done) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[10001]">
      <div className="absolute inset-0 grid"
           style={{ gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)` }}>
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div key={i} className="sh-tile bg-surface-0 will-change-transform" />
        ))}
      </div>
      <div className="sh-word pointer-events-none absolute inset-0 grid place-items-center font-display text-4xl tracking-tight text-ink"
           style={{ mixBlendMode: "difference" }}>{brand}</div>
    </div>
  );
}
```

**Why SSR-safe matters:** the overlay sits *on top of* the rendered HTML and reveals it. The page is fully in the SSR markup underneath, so there's no flash of unstyled content, no hydration mismatch, no SEO cost, and if JS fails the content is still there.

Loaders mount inside `<body>`, above `children`. The root-layout wiring is in [route-transitions.md](route-transitions.md) §2.

---

## Timing reference

| Phase | Duration | Ease | Transform |
|---|---|---|---|
| Loader exit (slide) | 0.8-0.9s | `power4.inOut` | `yPercent 0→-100` |
| Loader exit (fade) | 0.6s | `power2.inOut` | opacity |
| **Reduced motion** | 0.2-0.3s | none | opacity only |

---

## Anti-patterns (sweep before shipping)

- **Spinner / loading gif** while content pops in → an asset-aware overlay that reveals finished content.
- **Loader on every navigation** (stacked on the route wipe) → session-gate with `id`; loader is first-visit-only.
- **FOUC / content reflowing in** as fonts/images land → SSR-safe overlay + explicit media aspect ratios; entrances double as load choreography.
- **Completed wordmark flashes, then restarts** → its start state only exists in a hydration-time `.from()` tween; encode it in SSR CSS/inline visibility first.
- **Curtain disappears instead of lifting** → the session `seen` attribute activated `display:none` before exit completion; persist only in `onComplete`.
- **Page jumps horizontally at lock/unlock** → `overflow:hidden` collapsed the root scrollbar gutter; keep `<html>` at `overflow-y:scroll` and lock body/content.
- **Warm loads blink / slow loads hang** → readiness has neither a minimum floor nor a hard safety ceiling; use both in one shared promise.
- **Scramble/terminal-decode loader** as a default aesthetic → use a typographic preset instead (monospace ban).

## When to use a loader

- **Use** on narrative, portfolio, campaign, and launch sites, and only **once per session** (`id`). Keep it under ~1.5s of real work.
- **Skip** on app/dashboard zones and utility pages. There, the route wipe alone (or even just the fast app entrance, [page-entrances.md](page-entrances.md)) is enough; a theatrical intro on a tool feels wrong.
- Reduced motion: every preset branches to a 0.2-0.3s fade, no travel.

## Regression coverage: required for loader work

At minimum, automate these four checks in a real browser:

1. First visit: loader is attached and visible; the persistent `seen` attribute is absent while it plays.
2. Reveal: loader enters an explicit `revealing` phase, remains `display != none`, and its transform moves off-screen before unmount.
3. Same-session revisit: the pre-paint attribute exists and no frame ever shows the SSR loader layer.
4. Scroll lock: root `clientWidth` is identical before, during, and after lock; the lock class is removed when the loader finishes.

Also inspect raw SSR HTML: the `<head>` pre-paint script must occur before loader markup, and animated content must carry its hidden first-paint state.
