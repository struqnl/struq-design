# Route Transitions: the cover→swap→reveal overlay

One arm of the page-flow system, and the canonical way a site *navigates*. Siblings: [loaders.md](loaders.md) (first-load overlay, the same gesture starting closed) and [page-entrances.md](page-entrances.md) (the per-zone entrance of the revealed page).

This is the proven, studio-grade overlay approach. Use it for any narrative/marketing/portfolio site. For the easing vocabulary these timings draw on, see [transitions.md](transitions.md); for the Lenis/GSAP provider this builds on, see [setup.md](setup.md).

**The whole point:** a site should *navigate* like a film cuts. A deliberate surface covers the screen, the swap happens unseen, and the surface clears to reveal finished content. Never a hard route cut, never a whole-page cross-fade.

---

## Philosophy: why an overlay, not `AnimatePresence`

The App Router **unmounts the old page on navigation**, so there is nothing left to animate *out*. The robust move is the opposite of a cross-fade:

1. **Cover**: a full-screen panel sweeps over the current page.
2. **Swap behind the cover**: `router.push()` runs while the screen is hidden; the old page unmounts, the new one mounts unseen.
3. **Reveal**: the panel clears, uncovering finished, already-painted content.

The user never sees a swap, a layout jump, or an empty frame. The first load is the same gesture with the cover *starting* closed. That's the loader ([loaders.md](loaders.md)).

**Cheap tells this replaces:** route changes that hard-cut; whole-page `opacity` cross-fades; the page visibly reflowing as fonts/images land.

---

## Architecture at a glance

```
app/layout.tsx (root)
└─ SmoothScrollProvider          // Lenis on the GSAP ticker (setup.md §2)
   └─ MotionConfig reducedMotion="user"   // Motion respects reduced-motion globally
      └─ PageTransitionProvider   // owns the cover overlay + TransitionLink (this file)
         └─ {children}
            └─ app/(zone)/template.tsx   // per-zone entrance (page-entrances.md)
   ── optional: <LoaderCounter id="intro" />  // first-load overlay (loaders.md)
```

Provider **order matters**: SmoothScroll outermost (one scroll clock for everything), Motion config next, the transition provider innermost so its overlay sits above page content. Loaders mount inside `<body>`, above `children`.

Five things make it feel seamless, and all five are load-bearing:

1. **Cover → swap → reveal**, never animate a stale DOM.
2. **`TransitionLink` intercepts navigation** and prefetches on hover (next/link is bypassed, so the route must be warmed manually or the wipe finishes before the page exists).
3. **Loaders are session-gated**: they play once per session, never stacking on top of the route wipe on every click ([loaders.md](loaders.md)).
4. **Loaders are SSR-safe**: they sit *on top of* already-rendered HTML and reveal it ([loaders.md](loaders.md)).
5. **Zone `template.tsx` re-runs `ScrollTrigger.refresh()`** after the entrance and uses `clearProps:"all"`, so pinned/scrubbed sections measure correctly on the freshly-revealed page ([page-entrances.md](page-entrances.md)).

---

## 1. The transition provider (cover → swap → reveal)

Drop-in. Wrap the app once; navigate with `<TransitionLink>` instead of `next/link`. Six variants (`wipe-up` default, `wipe-down/left/right`, `columns`, `iris`); reduced-motion collapses every variant to a 0.2s fade.

```tsx
// components/providers/PageTransition.tsx
"use client";

import {
  createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

export type TransitionVariant =
  | "wipe-up" | "wipe-down" | "wipe-left" | "wipe-right" | "columns" | "iris";

type NavOpts = { variant?: TransitionVariant; fillClass?: string };
const TransitionCtx = createContext<{ navigate: (href: string, opts?: NavOpts) => void } | null>(null);

const COLS = 6;
const DEFAULT_FILL = "bg-ink"; // the overlay lives outside themed wrappers, so use a concrete token

// One timing set, inside the 900ms budget: cover + delay + reveal = 0.40 + 0.05 + 0.45.
// Curtains and panels take the baseline's quint-in-out (power4.inOut) on every variant.
const EASE = "power4.inOut";
const COVER = 0.4, REVEAL = 0.45, PAINT_DELAY = 0.05;
const BAR = 0.26, BAR_STAGGER = 0.03; // columns: 0.26 + 5 x 0.03 = 0.41 per phase

export function useTransitionRouter() {
  const ctx = useContext(TransitionCtx);
  if (!ctx) throw new Error("useTransitionRouter must be used within PageTransitionProvider");
  return { push: ctx.navigate };
}

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Set the overlay's starting state for the chosen variant.
function prep(variant: TransitionVariant, panel: HTMLElement, colsWrap: HTMLElement, reduce: boolean) {
  const useCols = !reduce && variant === "columns";
  gsap.set(colsWrap, { autoAlpha: useCols ? 1 : 0 });
  gsap.set(panel, {
    autoAlpha: useCols ? 0 : 1,
    clipPath: !reduce && variant === "iris" ? "circle(0% at 50% 50%)" : "none",
    scaleX: 1, scaleY: 1,
  });
}

// COVER: panel comes in, then fires onComplete (which triggers router.push).
function cover(variant: TransitionVariant, panel: HTMLElement, bars: HTMLElement[], reduce: boolean, onComplete: () => void) {
  if (reduce) return gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, onComplete });
  const d = COVER, ease = EASE;
  switch (variant) {
    case "wipe-down":  return gsap.fromTo(panel, { scaleY: 0, transformOrigin: "top" },    { scaleY: 1, duration: d, ease, onComplete });
    case "wipe-left":  return gsap.fromTo(panel, { scaleX: 0, transformOrigin: "right" },  { scaleX: 1, duration: d, ease, onComplete });
    case "wipe-right": return gsap.fromTo(panel, { scaleX: 0, transformOrigin: "left" },   { scaleX: 1, duration: d, ease, onComplete });
    case "iris":       return gsap.fromTo(panel, { clipPath: "circle(0% at 50% 50%)" },    { clipPath: "circle(150% at 50% 50%)", duration: d, ease, onComplete });
    case "columns":    return gsap.fromTo(bars,  { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: BAR, ease, stagger: BAR_STAGGER, onComplete });
    case "wipe-up": default:
      return gsap.fromTo(panel, { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: d, ease, onComplete });
  }
}

// REVEAL: cover goes out, uncovering the new page. `delay` lets it paint first.
function reveal(variant: TransitionVariant, panel: HTMLElement, bars: HTMLElement[], reduce: boolean, onComplete: () => void) {
  if (reduce) return gsap.to(panel, { autoAlpha: 0, duration: 0.2, onComplete });
  const d = REVEAL, ease = EASE, delay = PAINT_DELAY;
  switch (variant) {
    case "wipe-down":  return gsap.to(panel, { scaleY: 0, transformOrigin: "bottom", duration: d, ease, delay, onComplete });
    case "wipe-left":  return gsap.to(panel, { scaleX: 0, transformOrigin: "left",   duration: d, ease, delay, onComplete });
    case "wipe-right": return gsap.to(panel, { scaleX: 0, transformOrigin: "right",  duration: d, ease, delay, onComplete });
    case "iris":       return gsap.to(panel, { clipPath: "circle(0% at 50% 50%)",    duration: d, ease, delay, onComplete });
    case "columns":    return gsap.to(bars,  { scaleY: 0, transformOrigin: "top",    duration: BAR, ease, stagger: BAR_STAGGER, delay, onComplete });
    case "wipe-up": default:
      return gsap.to(panel, { scaleY: 0, transformOrigin: "top", duration: d, ease, delay, onComplete });
  }
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const cols = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const variantRef = useRef<TransitionVariant>("wipe-up");
  const [fill, setFill] = useState(DEFAULT_FILL);
  const [covering, setCovering] = useState(false);

  // Reveal once the path actually changes while covered. The swap is now committed.
  useEffect(() => {
    if (!covering) return;
    const p = panel.current;
    if (!p) return;
    const bars = cols.current ? gsap.utils.toArray<HTMLElement>(cols.current.children) : [];
    const t = reveal(variantRef.current, p, bars, prefersReduced(), () => setCovering(false));
    return () => { t.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const navigate = useCallback((href: string, opts?: NavOpts) => {
    if (href === pathname) return;
    const p = panel.current, c = cols.current;
    if (!p || !c) { router.push(href); return; } // fallback if overlay isn't ready
    const variant = opts?.variant ?? "wipe-up";
    variantRef.current = variant;
    setFill(opts?.fillClass ?? DEFAULT_FILL);
    const reduce = prefersReduced();
    const bars = gsap.utils.toArray<HTMLElement>(c.children);
    prep(variant, p, c, reduce);
    pending.current = href;
    setCovering(true);
    cover(variant, p, bars, reduce, () => {
      if (pending.current) router.push(pending.current);
      pending.current = null;
    });
  }, [pathname, router]);

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[10000]">
        {/* Plain template strings: a fresh scaffold has no `cn` helper (setup.md §1). */}
        <div ref={panel} style={{ transform: "scaleY(0)" }} className={`absolute inset-0 ${fill}`} />
        <div ref={cols} style={{ visibility: "hidden" }} className="absolute inset-0 flex">
          {Array.from({ length: COLS }).map((_, i) => (
            <div key={i} style={{ transform: "scaleY(0)" }} className={`h-full flex-1 ${fill}`} />
          ))}
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}
```

```tsx
// components/ui/TransitionLink.tsx: use everywhere you'd reach for next/link
"use client";
import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTransitionRouter, type TransitionVariant } from "@/components/providers/PageTransition";

export function TransitionLink({
  href, children, className, variant, fillClass, ...rest
}: {
  href: string; children: ReactNode; className?: string;
  variant?: TransitionVariant; fillClass?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  const { push } = useTransitionRouter();
  const router = useRouter();
  return (
    <a
      href={href}
      className={className}
      // next/link is bypassed, so prefetch manually or the wipe finishes before the route exists.
      onPointerEnter={() => router.prefetch(href)}
      onFocus={() => router.prefetch(href)}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        push(href, { variant, fillClass });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
```

**Craft notes**
- The reveal is *slightly longer* than the cover (0.45s vs 0.4s) and carries a 0.05s `delay`. The incoming page gets a beat to paint before it's uncovered, so the reveal never exposes an empty frame. The three numbers add up to exactly the 900ms budget below; change one and re-add them.
- `power4.inOut` (quint-in-out, the baseline's curtain and panel ease) is the right curve here: it's an A→B move with both endpoints visible (the curtain holds, then commits), which is exactly what in-out eases are for ([transitions.md](transitions.md) easing table). The menu panel ([nav-header.md](nav-header.md) §3) uses the same ease, so the site has one curtain voice.
- The overlay sits at the **root** layout, outside per-site theme wrappers, so its `fillClass` must be a concrete color token (e.g. `bg-ink`, or a project `.tx-fill-*` class), not a scoped one.
- `fillClass` is set explicitly on every nav so a per-link color never leaks into the next transition.
- Keep total cover+reveal **≤ 900ms**. Block longer than that on every click and the site feels slow, not cinematic.
- Scroll resets naturally on route change (Next scrolls to top); the transition doesn't need to touch Lenis.

---

## 2. Wiring it up (root layout)

```tsx
// app/layout.tsx
import { MotionConfig } from "motion/react";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll"; // setup.md §2
import { PageTransitionProvider } from "@/components/providers/PageTransition";
import { LoaderCounter } from "@/components/ui/LoaderCounter"; // optional, see loaders.md

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface-0 text-ink antialiased">
        <SmoothScrollProvider>
          <MotionConfig reducedMotion="user">
            {/* Optional first-load overlay; omit on app/dashboard zones (loaders.md) */}
            <LoaderCounter />
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </MotionConfig>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

---

## Timing & easing reference

| Phase | Duration | Ease | Transform | Origin |
|---|---|---|---|---|
| Cover: wipe (default) | 0.4s | `power4.inOut` | `scaleY 0→1` | bottom |
| Cover: columns | 0.26s per bar (stagger 0.03), 0.41s total | `power4.inOut` | `scaleY 0→1` | bottom |
| Cover: iris | 0.4s | `power4.inOut` | `clipPath circle 0%→150%` | center |
| Reveal: wipe (default) | 0.45s (delay 0.05) | `power4.inOut` | `scaleY 1→0` | top |
| Reveal: columns | 0.26s per bar (stagger 0.03, delay 0.05), 0.46s total | `power4.inOut` | `scaleY 1→0` | top |
| Reveal: iris | 0.45s (delay 0.05) | `power4.inOut` | `clipPath circle 150%→0%` | center |
| **Total, any variant** | at most 0.9s | | | |
| **Reduced motion (all)** | 0.2s | none | opacity only | n/a |

---

## Anti-patterns (sweep before shipping)

- **Hard route cut**, or a whole-page `opacity` cross-fade → the cover→swap→reveal wipe.
- **Blocking > 900ms** per nav → tighten durations; cover+reveal ≤ 900ms.
- **Animating a stale page out** with `AnimatePresence` on route change → there's nothing to animate; cover instead.
- Reduced motion: every variant already collapses to a 0.2s fade; `MotionConfig reducedMotion="user"` covers Motion-driven UI globally, and GSAP code guards itself (the `prefersReduced()` checks above).

---

For in-page surface handoffs (section curtains), shared-element match-cuts (`layoutId`), and the full easing rationale, see [transitions.md](transitions.md). For the Lenis/GSAP provider this builds on, see [setup.md](setup.md).
