# Setup: shared infrastructure every other reference file assumes

> **Stack assumption:** this file is written for **Next.js App Router**. For a Vite (or
> other) project, the provider mount point, font loading, lazy boundaries, and `"use
> client"` differ. Translate via [stack-targets.md](stack-targets.md). The GSAP registry,
> the Lenis+ticker provider, and all `useGSAP` rules below are identical on both stacks;
> only *where* you mount them changes.

Stack: Next.js 15 App Router · TypeScript · Tailwind v4 · GSAP 3.13+ (all plugins free, including SplitText & ScrollSmoother) · Lenis · Motion (the framer-motion successor, import from `motion/react`) · Radix primitives · Phosphor icons (`@phosphor-icons/react`, weight light: one icon family per project, not reflexive Lucide; see [iconography.md](iconography.md)) · Three.js / React Three Fiber / Drei / postprocessing when a WebGL moment is planned.

The whole recipe stack, one place:

```bash
# Core: motion, scroll, primitives, icons
npm i gsap @gsap/react lenis motion @phosphor-icons/react radix-ui

# Only when a WebGL moment is planned (see webgl-r3f.md, webgl-scenes.md)
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
npm i -D @types/three
```

- **GSAP plugins need no token.** Flip, DrawSVG, MorphSVG, SplitText, ScrollSmoother and the rest ship inside the public `gsap` npm package (free since 3.13). There is no private registry, no `.npmrc` auth, nothing extra to install.
- **Radix:** `radix-ui` is the single unified package. If you prefer individual packages, install only what the build uses, e.g. `npm i @radix-ui/react-dialog`.

**The scaling knob** ([scaling.md](scaling.md)) is one CSS rule in the global stylesheet. Set it before building so everything authored after scales proportionally:

```css
/* app/globals.css (Next): top of file, after the Tailwind import */
html { font-size: clamp(0.9375rem, 0.836rem + 0.45vw, 1.1875rem); } /* a11y-safe: keeps a rem term */
```

## 1. The GSAP registry (one module, imported everywhere)

Register plugins once, in one place. Re-registering is harmless, but scattering `registerPlugin` calls across components is how you end up with a component that breaks when rendered alone.

```ts
// lib/gsap.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, DrawSVGPlugin, MorphSVGPlugin, useGSAP);

// Project-wide motion defaults: the baseline entrance (expo.out) inside the reveal band
gsap.defaults({ ease: "expo.out", duration: 0.8 });

export { gsap, ScrollTrigger, SplitText, Flip, DrawSVGPlugin, MorphSVGPlugin, useGSAP };
```

Every snippet in the other reference files imports from `@/lib/gsap`, not from `"gsap"` directly.

**Plugin palette: the agency-register plugins registered above.** Every
GSAP plugin is **free since 3.13 (Webflow acquisition)**: no license key, no auth
token, no Club membership. The registry registers these three next to
`ScrollTrigger, SplitText`; drop any a build never uses (registering is cheap, but an unused
import still ships). The API surface is in [gsap-api.md](gsap-api.md). These three punch far
above their cost for the cinematic register:

| Plugin | Reach for it when |
|---|---|
| **Flip** | Expand-to-detail / shared-element morphs: card→modal, grid↔list, thumbnail→hero. Measure with `Flip.getState`, change the DOM, `Flip.from`. The highest impressiveness-to-effort transition available. |
| **DrawSVG** | Self-drawing strokes: underlines, traced line art, signature marks, the DrawMark loader ([loaders.md](loaders.md)). `gsap.from(path, { drawSVG: 0 })`. |
| **MorphSVG** | Shape-to-shape morphing: logo/icon morphs, blob transforms, play↔pause. The sibling to DrawSVG when the path itself must change shape. |

Full DrawSVG and MorphSVG recipes live in [svg-motion.md](svg-motion.md).

## 2. SmoothScrollProvider: Lenis driven by the GSAP ticker

One clock. If Lenis runs its own rAF while GSAP runs the ticker, scrub animations micro-stutter because the two sample scroll position on different frames. `autoRaf: false` + `gsap.ticker` fixes it; `lagSmoothing(0)` stops GSAP from "catching up" after a long frame, which would visibly jump scroll-tied tweens.

**Failure fix checklist:** if smooth scroll feels absent, first verify the provider did not silently skip itself. Keep Lenis mounted, set `anchors: true`, listen with `lenis.on("scroll", ScrollTrigger.update)`, drive `lenis.raf(time * 1000)` from `gsap.ticker`, call `gsap.ticker.lagSmoothing(0)`, refresh on resize, and do a delayed initial `lenis.resize()` + `ScrollTrigger.refresh()`. Do not return early from the provider for `prefers-reduced-motion`; gate pins/parallax/decorative transforms in animation branches instead so native scroll is not mistaken for a broken provider.

**If the page won't scroll AT ALL** (not "feels unsmooth", the wheel is simply dead), it is almost always one of exactly two bugs, and they're distinguishable in one glance at the `<html>` classes:

| `<html>` has… | Cause | Fix |
|---|---|---|
| `lenis lenis-smooth`, **no** `lenis-stopped` | Nothing is driving `lenis.raf()`: the ticker wiring was skipped by an early `return` that raced the ref (§2) | Register the ticker callback unconditionally; resolve the instance through the ref per frame |
| `lenis-stopped` present | An unbalanced `lenis.stop()`: a menu opened and never released the lock (§2b) | Ensure `lenis.start()` runs on every close path, and on unmount |

Both produce the identical symptom (wheel events fire, `window.scrollY` never moves), so check the class list *before* changing any code.

```tsx
// components/providers/smooth-scroll.tsx
"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Resolve the instance INSIDE the ticker callback, every frame. Never
    // capture it once. See the dead-scroll warning below; this is the whole
    // reason the page can end up completely unscrollable.
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000); // GSAP gives seconds, Lenis wants ms
    };
    gsap.ticker.add(update);                     // registered unconditionally
    gsap.ticker.lagSmoothing(0);

    const onScroll = () => ScrollTrigger.update();

    // The ref may not be populated on this first effect pass, so bind the
    // scroll listener as soon as it is.
    let poll: ReturnType<typeof setInterval> | undefined;
    const bind = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return false;
      lenis.on("scroll", onScroll);
      // Delayed initial re-measure: pins sized before webfonts land are stale.
      setTimeout(() => { lenis.resize(); ScrollTrigger.refresh(); }, 400);
      return true;
    };
    if (!bind()) poll = setInterval(() => { if (bind()) clearInterval(poll); }, 50);

    return () => {
      if (poll) clearInterval(poll);
      lenisRef.current?.lenis?.off("scroll", onScroll);
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.1, autoRaf: false, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
```

> **Warning: the dead-scroll trap: read this before "fixing" an unscrollable page.**
> With `autoRaf: false`, Lenis does *nothing* until someone calls `lenis.raf()` every
> frame. The tempting shape:
> ```ts
> const lenis = lenisRef.current?.lenis;
> if (!lenis) return;                 // BUG: races ReactLenis's ref assignment
> gsap.ticker.add((t) => lenis.raf(t * 1000));
> ```
> reads the ref **once**, but `ReactLenis` populates it during its own mount. When the
> effect wins that race, `lenis` is `undefined`, the guard returns early, `gsap.ticker.add`
> is never reached, and **nothing drives Lenis at all**. The page becomes completely
> unscrollable by mouse wheel: the wheel events fire and Lenis swallows them, but the
> scroll position is never integrated. Because it's a race, it's *intermittent*, which is
> why it reads as a mysterious "smooth scroll randomly breaks" bug rather than a code error.
>
> **Symptom → cause:** wheel does nothing, `html` has `lenis lenis-smooth` classes but *not*
> `lenis-stopped`, `document.scrollingElement.scrollHeight` is correct, and `window.scrollY`
> stays pinned at 0. That combination is this bug and essentially nothing else.
> (If `lenis-stopped` *is* present, it's an unbalanced `lenis.stop()` instead; see §2b.)
>
> **Fix:** register the ticker callback unconditionally and resolve the instance through the
> ref per frame, exactly as the snippet above does. Never early-return out of the ticker wiring.

### 2b. The other dead-scroll cause: an unbalanced `lenis.stop()`

The overlay menu ([nav-header.md](nav-header.md) §3) locks scroll with `lenis.stop()` and
releases it with `lenis.start()`. Anything that interrupts the close path leaves the lock on
and the page permanently frozen. The usual culprits:

- The close animation's `onComplete` (where `lenis.start()` lives) never fires because the
  timeline was killed, e.g. a `useGSAP` hook with `dependencies: [open]` reverts its context
  on the very state change that triggers the close, taking the timeline with it. **Don't put
  the menu's open state in a `useGSAP` dependency array**; read it from a ref inside the
  scroll handler instead.
- The component unmounts while open (a route change) without restarting Lenis.

**Symptom → cause:** wheel does nothing AND `html` carries `lenis-stopped`. That's this, not §2.

Belt and braces: release the lock on unmount, so a stuck menu can never outlive its component:

```ts
useEffect(() => () => { lenis?.start(); }, [lenis]);
```

Mount the provider in the root layout (it's a client component wrapping server children, which is fine):

```tsx
// app/layout.tsx
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface-0 text-ink antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
```

`lerp: 0.1` is the shipping default; what other values feel like is in [feel-layer.md](feel-layer.md). Skip Lenis entirely for app-like dashboards. Smooth scroll belongs on narrative pages.

For raw Lenis providers in Vite/React, the core effect should look like this. (Note this shape is immune to the §2 race by construction: it *owns* the instance via `new Lenis()`, so there's no ref to lose a race with. The ref-resolution dance is only needed for `<ReactLenis>`.)

```tsx
useLayoutEffect(() => {
  ScrollTrigger.config({ ignoreMobileResize: true });

  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
    anchors: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const update = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);

  const refresh = () => {
    lenis.resize();
    ScrollTrigger.refresh();
  };

  window.addEventListener("resize", refresh);
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(refresh);
  });

  return () => {
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
    window.removeEventListener("resize", refresh);
    gsap.ticker.remove(update);
    lenis.off("scroll", ScrollTrigger.update);
    lenis.destroy();
  };
}, []);
```

Add the standard CSS helpers in the global stylesheet:

```css
html.lenis,
html.lenis body {
  height: auto;
}

.lenis:not(.lenis-autoToggle).lenis-stopped {
  overflow: clip;
}

.lenis [data-lenis-prevent],
.lenis [data-lenis-prevent-wheel],
.lenis [data-lenis-prevent-touch],
.lenis [data-lenis-prevent-vertical],
.lenis [data-lenis-prevent-horizontal] {
  overscroll-behavior: contain;
}

.lenis.lenis-smooth iframe {
  pointer-events: none;
}
```

## 3. useGSAP: the only way to write GSAP in React

`useGSAP` creates a GSAP context scoped to a ref: every tween/ScrollTrigger created inside is auto-killed on unmount (no leaked ScrollTriggers after route changes, the classic Next.js bug). Selector strings inside are scoped to the container, so `".card"` can't reach across components.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function Example() {
  const container = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.from(".card", { y: 40, autoAlpha: 0, stagger: 0.08 }); // scoped to container
    },
    { scope: container }
  );

  // Animations created in event handlers MUST be wrapped, or they escape cleanup:
  const onHover = contextSafe(() => gsap.to(".dot", { scale: 1.4, duration: 0.25 }));

  return <div ref={container}>…</div>;
}
```

Rules:
- Every component that animates: `"use client"`, a `container` ref, `{ scope: container }`.
- Use `autoAlpha` (opacity + visibility) instead of `opacity` for entrances: hidden elements can't intercept clicks.
- Avoid hiding content with CSS and revealing with JS (flash of nothing if JS fails / SEO cost). Animate **from** with `gsap.from(...)` so SSR HTML is the final state.
- Anything reading `window` stays inside `useGSAP`/`useEffect`, because module scope runs on the server in App Router.

## 4. Reduced motion: global guard, declared once

`gsap.matchMedia()` makes reduced-motion (and responsive) variants declarative. Pattern: full motion in the `motionOK` branch; in the reduced branch, either nothing (elements just sit in final state, because we animate `from`) or opacity-only.

```tsx
useGSAP(
  () => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        motionOK: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
        isMobile: "(max-width: 767px)",
      },
      (ctx) => {
        const { motionOK } = ctx.conditions!;
        if (!motionOK) return; // SSR markup is already the final state, nothing to do

        gsap.from(".hero-line", { yPercent: 110, stagger: 0.09, duration: 1, ease: "expo.out" });
      }
    );
  },
  { scope: container }
);
```

For reduced-motion users, keep the scroll provider behavior explicit. Prefer keeping Lenis mounted and skipping decorative transforms, pinning, parallax, and scrub showpieces inside `matchMedia` branches. If a project intentionally disables Lenis or changes it to near-native behavior, document that in the provider so QA does not misdiagnose native scroll as a broken smooth-scroll setup.

## 5. Performance ground rules (apply to every technique file)

- **Animate only `transform` and `opacity`** (and `clip-path`, which is paint-only). Never `top/left/width/height/margin` (layout thrash). `filter` (blur/brightness) is GPU-composited but expensive at large sizes; budget it.
- **`will-change: transform`** only on elements mid-animation or about to be (e.g. set by GSAP automatically via `force3D`). Blanket `will-change` on dozens of elements eats GPU memory and *hurts*.
- **One ScrollTrigger per concern**, not per element: animate a stagger of 10 cards with one trigger on the parent, not 10 triggers.
- **`scrub` + transform = cheap. `scrub` + filter/blur = budget one per viewport.** Canvas/video scrubbing (image sequences) is its own performance project. Flag the cost before reaching for it.
- Images doing parallax inside masks need `scale` headroom (see [depth-parallax.md](depth-parallax.md)): oversize via `scale(1.15)`, never by loading a bigger image.
- Test with CPU 4× throttle. Lenis + 3 scrubbed sections should hold 60fps on mid-range mobile; if not, the usual culprit is animated `filter` or too many pinned layers.

## 6. App Router gotchas

- **Route changes:** `useGSAP` cleanup kills old ScrollTriggers automatically, but layout shifts from images loading late skew trigger positions. Call `ScrollTrigger.refresh()` after fonts/images settle, or set explicit aspect ratios on media (do this anyway for CLS).
- **`"use client"` discipline:** keep animation components as leaves; pages/layouts stay server components. Pass server content in as `children`.
- **Fonts:** load via `next/font` (see [vibe-presets.md](vibe-presets.md)); SplitText with `autoSplit: true` re-splits when fonts finish loading, so you won't get mid-word line breaks from metric shifts. Deep type system and SplitText typography choreography: [typography.md](typography.md).
- **Page transitions & first-load loaders:** the canonical seamless system is the cover→swap→reveal overlay in [route-transitions.md](route-transitions.md), with session-gated loaders in [loaders.md](loaders.md). `template.tsx` (re-mounts per navigation, not `layout.tsx`) carries the per-zone *entrance* of the revealed page ([page-entrances.md](page-entrances.md)). Easing rationale + in-page section curtains: [transitions.md](transitions.md).
- **WebGL moments:** an R3F canvas is a client-only leaf like any animation component. Integration patterns are in [webgl-r3f.md](webgl-r3f.md), Drei/postprocessing/interactive 3D in [webgl-scenes.md](webgl-scenes.md), and the directed multi-chapter WebGL mode in [../cinematic/README.md](../cinematic/README.md). The skill entry point is [../SKILL.md](../SKILL.md).
