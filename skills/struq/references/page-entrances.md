# Per-Zone Page Entrances: the `template.tsx` layer

One arm of the page-flow system: what the *revealed* page does. Siblings: [route-transitions.md](route-transitions.md) (the cover→swap→reveal wipe this entrance overlaps) and [loaders.md](loaders.md) (the first-load overlay).

`template.tsx` re-mounts on every navigation within a route group ([setup.md](setup.md) §6), so it's where the revealed page gets a subtle entrance. It overlaps the reveal so content rises in the cover's wake rather than popping. Differentiate zones: richer for marketing, quick for app.

```tsx
// app/(marketing)/template.tsx: expressive
"use client";
import { useRef } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.from(ref.current, reduce
      ? { opacity: 0, duration: 0.3, clearProps: "all" }
      : { opacity: 0, y: 24, duration: 0.8, ease: "power3.out", clearProps: "all",
          onComplete: () => ScrollTrigger.refresh() });
  }, { scope: ref });
  return <div ref={ref}>{children}</div>;
}
```

```tsx
// app/(app)/template.tsx: functional, fast
"use client";
import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, duration: 0.25, ease: "power1.out", clearProps: "all" });
  }, { scope: ref });
  return <div ref={ref}>{children}</div>;
}
```

**Two non-obvious, load-bearing details:**
- **`clearProps: "all"`**: a leftover transform on this wrapper (even `translate(0,0)`) makes it a containing block for `position: fixed`, which silently breaks ScrollTrigger pinning for *every* section inside. Clearing props after the entrance removes the wrapper's footprint.
- **`ScrollTrigger.refresh()` on complete**: trigger positions measured while the page was still offset (mid-entrance) are wrong. Refreshing after it settles re-measures against the final layout so pinned/scrubbed sections don't jump.

---

## Hero entrances the presets name

The template entrance above moves the whole page. The hero's own entrance is a separate, per-preset decision ([vibe-presets.md](vibe-presets.md)): Soft Modern's `weight-in` and Warm Editorial's `soft-scrub` live in [typography.md](typography.md) §5; the two below belong to Dark Cinematic and Luxury Minimal. Both follow the same rules as every recipe: a `"use client"` leaf, `useGSAP` with a scope ref, all animation inside the `no-preference` branch of `gsap.matchMedia()`, and the server markup already the final state for reduced motion.

### `match-cut-hero`: image to type (Dark Cinematic)

The hero opens on a full-bleed image, holds it for about a second, then cuts to the h1 sitting exactly where a shape in the image was (a horizon, an edge, a bright band). The cut is hard, or a 0.3s dissolve at most; the type itself does not rise. The shared shape is art direction: place the h1 on the image's horizon line at 1440 and at 390, and choose or crop the image so the shape lands there.

```css
/* globals.css: the type waits under the image only while motion is allowed */
@media (prefers-reduced-motion: no-preference) {
  [data-cut-hero]:not([data-cut]) [data-cut-type] { visibility: hidden; }
}
@media (prefers-reduced-motion: reduce) {
  [data-cut-image] { display: none; } /* reduced motion opens on the type, no cut */
}
```

```tsx
"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

type NetInfo = { effectiveType?: string; saveData?: boolean };

export function MatchCutHero({ src, title, cut = "hard" }: {
  src: string; title: string; cut?: "hard" | "dissolve";
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = root.current!;
      const img = el.querySelector<HTMLImageElement>("[data-cut-image] img");

      // Shorter hold on slow or data-saving connections: the post-cut content is the LCP candidate.
      const net = (navigator as Navigator & { connection?: NetInfo }).connection;
      const slow = net?.saveData === true || /2g|3g/.test(net?.effectiveType ?? "");
      const HOLD = slow ? 0.6 : 1;

      const tl = gsap.timeline({ paused: true })
        .call(() => { el.dataset.cut = "1"; }, [], 0) // the type is there at the cut
        .to("[data-cut-image]", { autoAlpha: 0, duration: cut === "hard" ? 0 : 0.3, ease: "none" }, 0);

      // The hold starts when the photo has PAINTED, never on mount: a hold over an empty frame
      // is no match cut at all. Use delayedCall, not tl.delay(): play() ignores a delay set
      // after the timeline was created.
      let started = false;
      let hold: gsap.core.Tween | undefined;
      const start = (seconds: number) => {
        if (started) return;
        started = true;
        hold = gsap.delayedCall(seconds, () => { tl.play(); });
      };
      const onLoad = () => start(HOLD);
      img?.addEventListener("load", onLoad, { once: true });
      if (img?.complete && img.naturalWidth > 0) onLoad();      // cached: already painted
      const fallback = gsap.delayedCall(2.5, () => start(0));  // photo never came: open on the type

      return () => {
        tl.kill(); hold?.kill(); fallback.kill();
        img?.removeEventListener("load", onLoad);
        delete el.dataset.cut;
      };
    });
  }, { scope: root });

  return (
    <section ref={root} data-cut-hero
             className="relative grid min-h-svh items-end overflow-clip bg-surface-0 px-6 pb-[12svh]">
      <h1 data-cut-type className="font-display text-display max-w-[16ch]">{title}</h1>
      <div data-cut-image aria-hidden className="absolute inset-0">
        {/* LCP hint: `preload` or `priority`, whichever the installed next/image declares (setup.md §0, Known API shifts) */}
        <Image src={src} alt="" fill preload sizes="100vw" className="object-cover" />
      </div>
    </section>
  );
}
```

- **The hold is gated on the image.** `img.complete` (cached) or its `load` event starts a `gsap.delayedCall` for the hold, with a 2.5s fallback straight to the type. A timeline with `delay: 1` on mount fires the cut over an empty frame whenever the photo is remote or slow, and a delay set later with `tl.delay()` is ignored by `play()`. Verify it with a frame trace: the hold frame must be the photo ([pitfalls.md](pitfalls.md) §3.3).
- **LCP is not free here.** The h1 is in the HTML from the start, hidden only by CSS while motion is allowed, and whatever is hidden until the cut (the h1, a product shot) becomes the LCP candidate the moment it appears. So lab LCP lands after hold plus cut, and fails the 2.5s floor ([performance.md](performance.md) §1) whenever the post-cut content paints a larger area than the photo did. Keep the post-cut hero smaller than the photo's painted area, and keep the shorter hold on slow connections (`HOLD` above). Measure it with the LCP probe in [performance.md](performance.md) §8; never assume it.
- Add `<noscript><style>{"[data-cut-image]{display:none!important}[data-cut-type]{visibility:visible!important}"}</style></noscript>` to the root layout's `<head>`, so a JS failure opens on the type.
- With a loader, start the hold as the loader exits ([loaders.md](loaders.md)), not on mount, or the cut happens behind the curtain.
- **When not to:** when the image has no shape the type can land on (a cut with no shared shape is just a slideshow), and when the post-cut hero must be larger than the photo's painted area and LCP under 2.5s is a hard requirement: then open on the type and let the image follow.

### `clip-line-hero`: the 1.6s single-line clip (Luxury Minimal)

One line of display type, revealed by one slow `clip-path` wipe from left to right. No split, no stagger, no y-travel: the restraint is the move.

```css
/* globals.css: pre-paint guard, same shape as line-rise-hero */
@media (prefers-reduced-motion: no-preference) {
  [data-clip-line]:not([data-ready]) { clip-path: inset(0% 100% 0% 0%); }
}
```

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function ClipLineHero({ children }: { children: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const line = root.current!.querySelector<HTMLElement>("[data-clip-line]")!;
      gsap.fromTo(line,
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power4.inOut", delay: 0.2,
          clearProps: "clipPath" }); // no clip left on the glyphs once it is open
      line.dataset.ready = "1"; // the inline start clip now holds the line hidden
    });
  }, { scope: root });

  return (
    <div ref={root}>
      <h1 data-clip-line className="font-display text-display -my-[0.1em] whitespace-nowrap py-[0.1em]">
        {children}
      </h1>
    </div>
  );
}
```

- `fromTo` renders its start clip immediately, so `data-ready` can lift the CSS guard in the same tick without a flash. The 0.1em padding pulled back with a negative margin keeps descenders inside the clipped box at leading 0.92. An italic last glyph overhangs its box on the right: add `px-[0.08em] -mx-[0.08em]` too when the line ends in italic ([pitfalls.md](pitfalls.md) §1).
- `power4.inOut` is the baseline's curtain ease: the wipe is a curtain drawn across one line. 1.6s is the top of the hero band, which Luxury Minimal's motion personality owns.
- Add `<noscript><style>{"[data-clip-line]{clip-path:none!important}"}</style></noscript>` to the root layout's `<head>`.
- One line only. If the copy needs two lines at 390px, shorten the copy ([page-architecture.md](page-architecture.md) §5); a two-line clip wipe reads as two reveals.

---

## Timing reference

| Phase | Duration | Ease | Transform |
|---|---|---|---|
| Marketing entrance | 0.8s | `power3.out` | `y 24→0` + fade |
| App entrance | 0.25s | `power1.out` | fade |
| Match cut (Dark Cinematic) | 1s hold from image load (0.6s on slow connections, 2.5s fallback), then 0s or 0.3s | `none` | image `autoAlpha` to 0, type static |
| Single-line clip (Luxury Minimal) | 1.6s | `power4.inOut` | `clip-path` inset wipe |
| **Reduced motion** | 0.3s | none | opacity only |

---

## Anti-pattern (sweep before shipping)

- **Forgetting `clearProps`/`refresh`** → broken pins on revealed pages. If a pinned section jumps only after navigating (not on hard reload), this is the cause ([pitfalls.md](pitfalls.md) §2).
- **A timed entrance started on mount** while it depends on an image, a font or a loader → it plays behind the curtain or over an empty frame. Start it from the thing it waits for ([pitfalls.md](pitfalls.md) §3.3).
