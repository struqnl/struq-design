# SVG Motion: DrawSVG, MorphSVG, MotionPath

SVG motion is how a site signs its name: a line that draws the story down the page, a mark that writes itself on first load, a logo that folds into an icon. Done well it costs almost nothing (a dash offset, a path string); done badly it is a squiggle that plays on a loop for no reason. Every recipe here is tied to scroll, a state change or a first visit, never to a timer.

Prerequisites: the registry and `useGSAP` rules in [setup.md](setup.md), reduced motion via `gsap.matchMedia()` ([setup.md](setup.md) §4). API pointers: [gsap-api.md](gsap-api.md) §9.

## 1. Registration

All three plugins ship in the public `gsap` package since 3.13. Register only the ones the build uses, in the one registry module:

```ts
// lib/gsap.ts (additions)
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin);
export { DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin };
```

## 2. Stroke setup and the gotchas

DrawSVG animates `stroke-dashoffset` and `stroke-dasharray` on `path`, `line`, `polyline`, `polygon`, `rect`, `circle` and `ellipse`. `drawSVG: 0` is nothing drawn, `"100%"` the full stroke, `"40% 60%"` a segment, and `"50% 50%"` to `"0% 100%"` draws from the middle outward.

```css
.draw { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; }
.draw-fluid { vector-effect: non-scaling-stroke; } /* static strokes only: never on a path DrawSVG animates */
```

- **Colour from tokens.** `stroke: currentColor` and a `text-ink` or `text-accent` class on the `<svg>`. Never a hex in the SVG file.
- **Never combine `preserveAspectRatio="none"` with `vector-effect: non-scaling-stroke` on a drawn path.** The stroke is then dashed in screen space while DrawSVG measures in user space under a non-uniform scale, so the dash length is wrong and the line ends early or never finishes. A drawn path scales uniformly (default `preserveAspectRatio`), or is rebuilt in CSS pixels in a `viewBox` that matches its box and re-measured on resize (§3). A short, nearly flat swash may stretch without `vector-effect` (it measures correctly, the slight stroke distortion is invisible at that size, §5). `draw-fluid` is for static hairlines that are never drawn.
- **A drawn motif used at several sizes takes its stroke width as a prop.** One 120-unit profile rendered at 72px and at 600px is either a hairline or a marker with a fixed `stroke-width`, and `vector-effect: non-scaling-stroke` is off the table on a drawn path (above). Pass the weight per use so the rendered stroke stays about 1 to 1.5px: `strokeWidth = 1.25 * (viewBoxWidth / renderedWidthPx)`, written as a prop (`<Motif weight={2.1} />` at 72px, `weight={0.25}` at 600px).
- **Delete `pathLength` attributes.** Exported SVGs and CSS dash tutorials often set `pathLength="1"`, which rescales dash units; DrawSVG's measured lengths then stop matching and the line ends early or never finishes.
- **No existing dashes.** DrawSVG owns `stroke-dasharray`. A dashed line has to be faked (a mask over a dashed copy), not drawn directly.
- **Round caps show a dot at 0.** With `stroke-linecap: round`, a zero-length stroke still paints a dot. Start the element hidden and reveal it as drawing begins: `gsap.set(el, { autoAlpha: 1 })` right before the draw, or fade in over the first 5% of a scrub.
- **Outlined text cannot be drawn.** A font converted to outlines is filled shapes with two contours per stroke; DrawSVG traces both outlines. Signatures and handwriting need a **single-stroke centreline** path. For filled lettering, draw a thick centreline inside a `<mask>` and let it reveal the fill (§4).
- **Draw direction is path direction.** If it draws backwards, reverse the path in the editor or animate `drawSVG: "100% 100%"` to `"0% 100%"`.

## 3. `path-journey`: a scrub-drawn line through the sections

One long path behind several sections, drawn as you scroll, connecting the chapters. It sits at plane -1 (behind content, above the background) and never crosses running text.

```tsx
"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Control points as fractions of the wrapper box; the path is rebuilt in CSS pixels.
const journey = (w: number, h: number) =>
  `M${0.8 * w} 0 C ${0.8 * w} ${0.18 * h}, ${0.2 * w} ${0.22 * h}, ${0.2 * w} ${0.4 * h} ` +
  `S ${0.8 * w} ${0.64 * h}, ${0.7 * w} ${0.8 * h} S ${0.3 * w} ${0.92 * h}, ${0.5 * w} ${h}`;

export function PathJourney({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = root.current!;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setBox((b) => (b.w === Math.round(width) && b.h === Math.round(height) ? b : { w: Math.round(width), h: Math.round(height) }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(() => {
    if (!box.w) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set("[data-journey]", { autoAlpha: 1 });
      gsap.fromTo("[data-journey]", { drawSVG: 0 }, {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 80%", scrub: 1 },
      });
    });
  }, { scope: root, dependencies: [box.w, box.h], revertOnUpdate: true });

  return (
    <div ref={root} className="relative">
      {box.w > 0 && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-accent"
             viewBox={`0 0 ${box.w} ${box.h}`}>
          <path data-journey className="draw" d={journey(box.w, box.h)} />
        </svg>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
```

- **The rule:** a full-height drawn path is never stretched. `preserveAspectRatio="none"` with `vector-effect: non-scaling-stroke` looks like the easy way to fit one path to any content length, but DrawSVG cannot measure a stroke drawn that way (§2). Instead the `viewBox` is the wrapper's own pixel box, so one user unit is one CSS pixel, the stroke stays 1.5px with no `vector-effect`, and the curve is rebuilt from fractions of the box.
- **Resize re-measures.** The `ResizeObserver` updates the box only when the rounded size changes; `revertOnUpdate: true` kills the old tween and its ScrollTrigger and builds a fresh one against the new `d`, so DrawSVG always measures the path that is on screen. Check it at 390 and 1440.
- **Scrub, never a threshold.** `ease: "none"` and `scrub: 1`: the line is where the reader is ([feel-layer.md](feel-layer.md)). `start: "top 60%"` keeps the drawing tip near the middle of the viewport, where the eye already is.
- **Mobile is authored.** At 390px a wide S-curve crosses the text column. Write a second, straighter builder (a gentle edge-hugging line) and pick it from the box: `d={box.w < 768 ? edge(box.w, box.h) : journey(box.w, box.h)}`. The resize rebuild swaps it for free.
- **Reduced motion:** no tween is created, so the full path is drawn statically. The path itself is the design; motion only stages it.
- Want something travelling along the line? The pixel `viewBox` scales uniformly, so a MotionPath follower can ride this exact path (§9).
- Pairs with `pin-horizontal-gallery` or `manifesto-fill` in a brand-story arc ([showcase.md](showcase.md)), never with a second scrub-drawn line.

## 4. Signature or logo draw

A mark that writes itself: strokes in order, each at a speed proportional to its length, so long strokes do not race.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function SignatureDraw() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const strokes = gsap.utils.toArray<SVGPathElement>("[data-stroke]");
      gsap.set(strokes, { autoAlpha: 0 }); // no round-cap dots waiting on the page
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
      let at = 0;
      strokes.forEach((p) => {
        const d = gsap.utils.clamp(0.25, 1.2, p.getTotalLength() / 400); // seconds per stroke, by length
        tl.set(p, { autoAlpha: 1 }, at)
          .fromTo(p, { drawSVG: 0 }, { drawSVG: "100%", duration: d, ease: "power2.inOut" }, "<");
        at += d - 0.08; // the next stroke starts 0.08s before this one ends
      });
    });
  }, { scope: root });

  return (
    <svg ref={root} viewBox="0 0 320 120" aria-label="Signed, the studio" role="img" className="w-64 text-ink">
      <path data-stroke className="draw" d="M10 80 C 40 20, 70 20, 80 70 S 120 110, 140 60" />
      <path data-stroke className="draw" d="M150 60 C 170 30, 200 30, 210 70 S 260 100, 300 40" />
    </svg>
  );
}
```

- `power2.inOut` per stroke reads as a hand: it accelerates into the line and settles at the end. A linear draw reads as a plotter.
- Every stroke is hidden up front and revealed at the exact moment its own draw starts, so no stroke shows a round-cap dot while it waits its turn.
- The 0.08s overlap keeps the pen moving between strokes; a gap reads as a stutter.
- **Filled wordmark?** Keep the fill and reveal it through a mask: `<mask id="m"><path data-stroke className="draw" stroke="white" strokeWidth={14} d="(centreline)" /></mask><g mask="url(#m)">(filled letters)</g>`. The thick stroke draws, the mask follows it, and the real letterforms appear behind the pen.
- **When not to:** a mark that is geometric (circles, bars). Drawing a circle reads as a loading spinner; use a mask wipe or a scale-in instead.

## 5. Link underline draw

The straight underline is pure CSS ([micro-interactions.md](micro-interactions.md) §3a); use that. DrawSVG earns its place only when the line is not straight: a hand-drawn swash under one word in a headline, or the main CTA.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function SwashLink({ href, children }: { href: string; children: React.ReactNode }) {
  const root = useRef<HTMLAnchorElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      tl.current = gsap.timeline({ paused: true })
        .set("[data-swash]", { autoAlpha: 1 })
        .fromTo("[data-swash]", { drawSVG: 0 }, { drawSVG: "100%", duration: 0.45, ease: "power3.out" });
      return () => { tl.current = null; };
    });
  }, { scope: root });

  return (
    <a ref={root} href={href} className="relative inline-block"
       onPointerEnter={() => tl.current?.play()} onPointerLeave={() => tl.current?.reverse()}
       onFocus={() => tl.current?.play()} onBlur={() => tl.current?.reverse()}>
      {children}
      <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-accent">
        <path data-swash className="draw invisible" d="M2 8 C 50 2, 120 12, 198 4" />
      </svg>
    </a>
  );
}
```

On touch and under reduced motion no timeline exists; show the swash statically on the active link if the design needs it, or leave it out. The focus handlers make the keyboard path identical to hover.

## 6. `draw-mark-loader`: the DrawMark preset, wired

The loader shell, the session gate and the scroll lock live in [loaders.md](loaders.md); this is the DrawSVG body for its DrawMark preset. The loader invariant from [../SKILL.md](../SKILL.md) holds: the revisit gate and the live animation are separate, and the `seen` flag is written only after the exit finishes.

```css
/* Before React runs, the SSR markup must not paint a finished mark for a frame. */
.dm-mark { visibility: hidden; }
```

```tsx
"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { loaderSeen, markLoaderSeen } from "./useFirstVisit"; // loaders.md

export function LoaderDrawMark({ id = "intro" }: { id?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    if (loaderSeen(id)) { setDone(true); return; } // revisit: gone before paint
    const finish = () => { markLoaderSeen(id); setDone(true); };
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const tl = gsap.timeline({ onComplete: finish });
      if (ctx.conditions!.reduced) {
        tl.set(".dm-mark", { visibility: "visible", autoAlpha: 0 })
          .to(".dm-mark", { autoAlpha: 1, duration: 0.2 })
          .to(root.current, { autoAlpha: 0, duration: 0.3 }, "+=0.3");
        return;
      }
      tl.set(".dm-mark", { visibility: "visible" })
        .fromTo(".dm-stroke", { drawSVG: 0 }, { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", stagger: 0.12 })
        .from(".dm-word", { yPercent: 110, duration: 0.7, ease: "expo.out" }, "-=0.35")
        .to(root.current, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, "+=0.25");
    });
  }, { scope: root });

  if (done) return null;
  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[10001] grid place-items-center bg-surface-0 text-ink">
      <div className="dm-mark flex items-center gap-4">
        <svg viewBox="0 0 64 64" className="h-14 w-14">
          <path className="dm-stroke draw" d="M12 48 L32 12 L52 48" />
          <path className="dm-stroke draw" d="M20 36 H44" />
        </svg>
        <span className="overflow-clip"><span className="dm-word block font-display text-h3">Brand</span></span>
      </div>
    </div>
  );
}
```

- Total runtime about 2.3s on a first visit, zero on a revisit. Longer than 2.5s and the loader is in the way, not a welcome.
- The page renders and paints under the overlay ([seo.md](seo.md) §6); the loader only covers it. The hero's `line-rise-hero` starts on the overlay's fade ([typography.md](typography.md) §5).
- Use the real mark's paths, converted to single-stroke where the mark is drawn from lines ([brand.md](brand.md)).

## 7. `logo-morph`: MorphSVG

MorphSVG rewrites a shape's geometry between two shapes. The target can be an element or a raw path string: `gsap.to(logo, { morphSVG: icon })`. A selector string also works, but it resolves lazily against the whole document, not your component (see the scoping note below).

**Rules that decide whether a morph looks designed or melted:**

- **Path, polyline, polygon.** MorphSVG morphs `<path>`, `<polyline>` and `<polygon>` in place (it rewrites `d` or `points`; the element stays the same node). `<circle>`, `<rect>` and `<ellipse>` need `MorphSVGPlugin.convertToPath(...)` first, and that call is the only one that **replaces** elements, which pulls nodes out from under React. Run it on an SVG React never re-renders, or better, convert once in the editor and commit paths.
- **Scope plugin selectors yourself.** `useGSAP`'s `scope` scopes the tween's *target* selector, but strings inside plugin config (`morphSVG.shape`, `motionPath.path`, `motionPath.align`) are resolved later by the plugin against `document`. With two instances on a page they grab the first match. Query the element from the component root and pass it: `root.current!.querySelector("[data-icon]")`.
- **One path to one path.** A five-letter wordmark morphing into one icon is five morphs, not one: morph the letter that becomes the icon and fade or scale the others away. Compound paths (several subpaths in one `d`) work best when both shapes have the same number of subpaths.
- **`shapeIndex`** chooses which point on the start shape maps to the start of the end shape. The default (`"auto"`) is usually right; when a morph twists or folds through itself, try small integers (`shapeIndex: 3`) until it travels cleanly.
- **`type: "rotational"`** interpolates points by angle and distance around a centre instead of in straight lines. Use it when linear morphing makes the shape collapse through its middle (blobs, organic marks, shapes that rotate as they change).
- Duration 0.5 to 0.8s, `power3.inOut` or the quart in-out curve: a morph is an A to B with both ends visible.

**Header mark that folds into an icon on scroll.** Wordmark at the top of the page, compact icon once the hero is past:

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

export function MorphingMark() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const icon = root.current!.querySelector<SVGPathElement>("[data-icon]")!; // element, not a selector string
      const tl = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: "power3.inOut" } })
        .to("[data-shape]", { morphSVG: { shape: icon, type: "rotational" } }, 0)
        .to("[data-rest]", { autoAlpha: 0, x: -8, stagger: 0.03 }, 0);
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.4,  // scroll position in px: 40% of the first viewport
        end: "max",
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });
    });
  }, { scope: root });

  return (
    <svg ref={root} viewBox="0 0 160 40" role="img" aria-label="Brand" className="h-8 text-ink">
      <path data-shape fill="currentColor" d="(first letter of the wordmark)" />
      <g data-rest fill="currentColor">{/* remaining letters */}</g>
      <path data-icon d="(the icon)" className="hidden" />
    </svg>
  );
}
```

The `[data-icon]` path only supplies shape data, so it stays hidden. Under reduced motion swap the two with a cross-fade instead (Motion `AnimatePresence` or a CSS opacity transition), since the state change still has to read.

**Play and pause.** The cleanest icon morph there is, if both shapes have matching subpaths. Draw play as two halves so it matches pause's two bars:

```tsx
const PLAY  = "M7 5 L12 8.2 L12 15.8 L7 19 Z M12 8.2 L18 12 L18 12 L12 15.8 Z";
const PAUSE = "M7 5 H10.5 V19 H7 Z M13.5 5 H17 V19 H13.5 Z";

// in a click handler made with contextSafe from useGSAP:
gsap.to(iconPath, { morphSVG: playing ? PAUSE : PLAY, duration: 0.35, ease: "power3.inOut" });
```

Two subpaths of four points each on both sides, so every point has a partner and the morph never tears. Reduced motion: set the `d` directly, no tween.

**Blobs.** A blob that morphs between organic shapes is the classic tell when it loops on a timer ("nothing moves the user did not cause", [feel-layer.md](feel-layer.md) §5). Tie it to scroll (`scrub`) or to hover, use `type: "rotational"`, keep two or three shapes with similar point counts, and keep it behind content at low contrast.

## 8. Morph during a route transition

The cover overlay from [route-transitions.md](route-transitions.md) is the perfect stage for a mark morph: the page is hidden, the eye has nothing else to watch, and the morph fills the swap. Add the mark inside the overlay and play the morph inside the cover's window:

```tsx
// PageTransition.tsx, additions only. Inside the overlay wrapper, above the panel:
<svg ref={mark} viewBox="0 0 64 64" className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-surface-0 opacity-0">
  <path data-from fill="currentColor" d="(mark)" />
  <path data-to className="hidden" d="(alternate shape)" />
</svg>

// In navigate(), after cover(...) starts, when motion is allowed:
if (!reduce && mark.current) {
  const p = mark.current.querySelector<SVGPathElement>("[data-from]")!;
  const to = mark.current.querySelector<SVGPathElement>("[data-to]")!;
  gsap.timeline()
    .to(mark.current, { opacity: 1, duration: 0.2 }, 0.3)
    .to(p, { morphSVG: to, duration: 0.5, ease: "power3.inOut" }, 0.35)
    .to(mark.current, { opacity: 0, duration: 0.2 }, 0.85)
    .set(p, { morphSVG: p }); // reset to its own shape for the next navigation
}
```

- Keep the whole thing inside the cover and reveal: the budget is still 900ms per navigation ([route-transitions.md](route-transitions.md)). If the morph needs longer, the morph is too complex.
- The final `set` with the path itself as the target restores its original shape; MorphSVG records the original `d` for exactly this.
- One mark, one morph. A different shape per route turns navigation into a slideshow.

## 9. MotionPath: follow a path

An element that travels along a curve: a dot running the journey line, a plane crossing a map, a cursor of light along a diagram.

```tsx
// inside a component with `const root = useRef<HTMLDivElement>(null)` on the section, holding a
// uniformly scaled <svg> with <path data-route className="draw" /> and a <div data-follower />
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const route = root.current!.querySelector<SVGPathElement>("[data-route]")!; // element, not a string
    const tl = gsap.timeline({
      defaults: { ease: "none", duration: 1 },
      scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 60%", scrub: 1 },
    });
    tl.set(route, { autoAlpha: 1 }, 0)
      .fromTo(route, { drawSVG: 0 }, { drawSVG: "100%" }, 0)
      .to("[data-follower]", {
        motionPath: {
          path: route,
          align: route,               // follower sits on the path, in the path's coordinate space
          alignOrigin: [0.5, 0.5],    // centre of the follower on the line
          autoRotate: true,           // faces along the tangent; omit for a dot
          start: 0,
          end: 1,
        },
      }, 0);
  });
}, { scope: root });
```

- The drawn line and the follower share **one** timeline under one ScrollTrigger, both at position 0 with the same duration, so the tip of the line and the follower cannot drift apart.
- `path` and `align` get the element queried from `root`, never a selector string: plugin strings resolve against the whole document (§7).
- `align` needs the path's real geometry: the SVG must scale uniformly (no `preserveAspectRatio="none"`). The pixel `viewBox` from §3 qualifies; rebuild the timeline on resize the same way (`dependencies` plus `revertOnUpdate`).
- `autoRotate` on something with a front (an arrow, a plane). A dot does not need it, and rotating a circle costs a matrix per frame for nothing.
- Reduced motion: the follower sits at its end state (or is not rendered); the line is drawn statically.

## 10. Performance

- **DrawSVG is cheap.** It is a dash offset; ten drawn paths on a page cost nothing measurable. The cost is paint area: a full-viewport path repaints its bounding box each frame, so keep strokes thin and avoid filters (`drop-shadow`, blur) on any animating SVG.
- **MorphSVG runs on the main thread.** It rebuilds the `d` string every frame, proportional to point count. Simplify paths before morphing (hundreds of points, not thousands), and never morph more than a few shapes at once.
- **Inline SVG only.** An `<img src="logo.svg">` cannot be drawn or morphed. Inline the few SVGs that animate; leave the rest as images.
- **Move the `<svg>`, not the path,** when the whole graphic travels: transform the container (compositor) and keep path work for shape changes.
- **One ScrollTrigger per graphic**, not per stroke: a timeline under one trigger, as in §4.

## Tells

| Tell | Replace with |
|---|---|
| A squiggle or blob morphing on an infinite loop | Tied to scroll, hover or a state change |
| Drawn line that finishes before the reader arrives (time-based at a threshold) | `scrub` with `ease: "none"` |
| Outlined font text "drawing" its own outline | Single-stroke centreline, or a centreline mask over the fill |
| A round-cap dot visible before the draw starts | Hidden until the draw begins |
| A drawn path with `preserveAspectRatio="none"` and `non-scaling-stroke` that stops short | A pixel `viewBox` rebuilt on resize (§3) |
| A circle drawing itself as a "loader" | The real mark, or a mask wipe |
| Morph that folds through itself | `shapeIndex`, `type: "rotational"`, matched subpaths |
| A different SVG flourish in every section | One line, one mark: SVG motion is a signature, not a texture |
