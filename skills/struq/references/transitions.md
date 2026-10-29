# Cinematic Transitions & Easing Philosophy

Two halves: the easing reference (used by every other file) and the transition patterns (page curtains, section curtains, shared-element moves).

---

## Easing philosophy: why custom beziers feel "designed"

Default `ease-in-out` (`cubic-bezier(0.4, 0, 0.2, 1)`) is symmetric and polite: it accelerates and decelerates by similar amounts. Nothing in the physical world moves like that on arrival. Things that *arrive* decelerate hard at the end (a hand placing a glass); things that *leave* accelerate away. Designed motion encodes intent in the curve:

- **Entrances → strong out-eases.** Almost all the velocity happens in the first 20% of the duration, and the long deceleration tail is where the eye reads "settled, weighted, premium." This is why expo-out at 1s feels *faster* than ease-in-out at 0.5s: perceived speed is initial velocity, and perceived quality is the tail.
- **Exits → in-eases.** The element commits and accelerates away. Slow-decelerating exits read as reluctance or lag.
- **In-outs → only for things that move from A to B on screen** (curtains, position swaps, reordering) where both endpoints are visible.
- **Never linear** except scrub-tied values, where scroll itself is the easing.

### The beziers that actually ship

CSS-side (these go in `@theme`, see [vibe-presets.md](vibe-presets.md)) and their GSAP equivalents:

| Name | cubic-bezier | GSAP | Use for | Character |
|---|---|---|---|---|
| **expo-out** | `(0.16, 1, 0.3, 1)` | `expo.out` | reveals, hero entrances, masks | the agency default; violent start, infinite-feeling settle |
| **quart-out** | `(0.25, 1, 0.5, 1)` | `power4.out`-ish | hovers, dropdowns, micro | expo's calmer sibling; snappy without drama |
| **quint-in-out** | `(0.83, 0, 0.17, 1)` | `power4.inOut` | curtains, wipes, panel slides | holds, then *commits*; the cinematic door |
| **quart-in-out** | `(0.76, 0, 0.24, 1)` | `power3.inOut`-ish | position swaps, accordions | quint's softer sibling |
| **back-out** | `(0.34, 1.56, 0.64, 1)` | `back.out(1.4)` | badges, toasts, playful pops | 5-6% overshoot; personality, so ration it |
| **circ-out** | `(0, 0.55, 0.45, 1)` | `circ.out` | cursor effects, trailing UI | mechanical-smooth |

Per-vibe personality = picking 2 to 3 of these plus a duration scale ([vibe-presets.md](vibe-presets.md)). A site that uses expo-out/quint-in-out at 0.8 to 1.4s feels heavy and cinematic; the same site on quart-out/back-out at 0.25 to 0.6s feels kinetic and product-y.

For a true signature ease, GSAP `CustomEase.create("brand", "M0,0 C0.2,0 0.1,1 1,1")`. The table covers 99% of shipping needs.

❌ **Cheap tell:** `transition-all duration-300 ease-in-out` on everything, `duration-500` on big things. ✅ Asymmetric curves chosen per role, durations spanning 0.2s→1.4s by element weight.

---

## 1. Page transition curtain (App Router)

> **Canonical system lives in [route-transitions.md](route-transitions.md)** (with [loaders.md](loaders.md) + [page-entrances.md](page-entrances.md)). First-load loaders and route transitions are one seamless system. Use the GSAP `PageTransitionProvider` + `TransitionLink` (cover→swap→reveal, six variants, session-gated loaders, per-zone entrances) as the default. The Motion `template.tsx` version below is a **lighter alternative** for a single quick reveal when you don't want the provider + intercepted-link wiring.

**Term:** Curtain / wipe transition.
**Mechanic:** On route change, a full-screen surface sweeps over the page (cover), navigation happens underneath, then it sweeps off (reveal). The sweep uses `scaleY` with a flipping `transform-origin` so it *wipes* through rather than fading. Two-phase, in-out ease: this is the canonical "agency site" navigation feel.

**When:** Portfolios, studios, campaign sites, anywhere navigation is part of the show.
**Overkill when:** content/utility sites where users navigate constantly. More than 400ms of blocking per nav gets old fast. Keep total cover+reveal ≤ 900ms.
**Tooling:** Motion, not GSAP. This is React lifecycle territory (`AnimatePresence` + App Router's `template.tsx`, which re-mounts per navigation; `layout.tsx` does not).

```tsx
// app/template.tsx
"use client";

import { motion } from "motion/react";

const QUINT_INOUT = [0.83, 0, 0.17, 1] as const;
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Curtain: covers the OLD page (exit isn't possible in template.tsx,
          so we run reveal-on-mount: curtain starts covering, sweeps away) */}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[100] bg-surface-2"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: QUINT_INOUT }}
        style={{ transformOrigin: "top" }}    // reveal pulls UP and away
      />
      {/* Incoming page rises slightly as it's uncovered */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.25, ease: EXPO_OUT }}
      >
        {children}
      </motion.div>
    </>
  );
}
```

Craft notes:
- **`transformOrigin` choreography is the trick**: cover grows from `bottom` (curtain rises), reveal shrinks to `top` (curtain continues upward), one continuous gesture passing over the screen. With a single origin it reads as a blind bouncing back.
- The incoming page's `delay: 0.25` lets the curtain mostly clear before content moves: overlap, not sequence.
- For a true exit phase (animate the *old* page out), wrap routes in `AnimatePresence mode="wait"` keyed on `usePathname()` in a client layout wrapper. That is more wiring, needed only when the old page must visibly leave. The template.tsx reveal alone covers most of the perceived value.
- A 2-layer curtain (accent sweep 60ms behind the surface sweep) is the deluxe version: a second `motion.div`, same origins, `delay: 0.06`.
- Kill `ScrollTrigger` confusion: scroll restoration plus re-mount means triggers recalc. `useGSAP` cleanup handles the old page, and the new page mounts fresh.

❌ **Cheap tell:** route changes hard-cut, or cross-fade via `opacity` on the whole page. ✅ A surface with a committed quint-in-out sweep, content rising in its wake.

---

## 2. Section curtain (in-page)

**Term:** Surface handoff.
**Mechanic:** A section's background sweeps up over the previous section as it enters, so the *surface itself* transitions rather than content scrolling past a boundary. Scrub-tied curtain = the page feels like layered sheets.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function CurtainSection({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        container.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "top 25%",
            scrub: true,        // tied to the hand: the user drags the curtain up
          },
        }
      );
    },
    { scope: container }
  );

  // -mt-[20vh] makes it sweep OVER the previous section's tail (see composition.md)
  return (
    <section ref={container} className="relative z-20 -mt-[20vh] bg-surface-2 px-6 py-32">
      {children}
    </section>
  );
}
```

Use at 1 to 2 major act-breaks per page, on a strong surface change (surface-0 → surface-2, or the accent). Every section curtaining = visual exhaustion.

---

## 3. Shared-element transition (`layoutId`)

**Term:** Shared-element / match-cut transition.
**Mechanic:** An element (project thumbnail) appears to *become* its counterpart in the next view (case-study hero). Motion interpolates position/scale between two elements sharing a `layoutId`. It is the strongest continuity illusion available in React, and pure Motion (GSAP has no equivalent; this is React-tree-aware layout animation).

This is the one place Motion genuinely beats GSAP, and it **complements** the canonical page-flow system: use the cover wipe ([route-transitions.md](route-transitions.md)) for route changes, and `layoutId` for list→detail moves *within* a route.

**When:** List→detail moves inside one route (modal/expanding card). Across App Router *pages*, `layoutId` does not survive the unmount/remount, so use the curtain instead, or keep the "detail" as an in-route overlay (parallel route/modal pattern) so both elements live in one tree.

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ProjectGrid({ projects }: { projects: { id: string; img: string; title: string }[] }) {
  const [active, setActive] = useState<string | null>(null);
  const QUINT_INOUT = [0.83, 0, 0.17, 1] as const;

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        {projects.map((p) => (
          <motion.button key={p.id} layoutId={`card-${p.id}`} onClick={() => setActive(p.id)}
                         className="col-span-4 overflow-hidden">
            <motion.img layoutId={`img-${p.id}`} src={p.img} className="aspect-[4/3] w-full object-cover" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div className="fixed inset-0 z-[90] bg-surface-0/90"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setActive(null)}>
            <motion.div layoutId={`card-${active}`} transition={{ duration: 0.6, ease: QUINT_INOUT }}
                        className="absolute inset-x-0 top-0 mx-auto max-w-5xl overflow-hidden">
              <motion.img layoutId={`img-${active}`} src={projects.find((p) => p.id === active)!.img}
                          className="aspect-[16/9] w-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

Note the aspect-ratio change (4/3 → 16/9): Motion interpolates the crop too, which reads as a deliberate match-cut. Keep the moving element simple (an image, not a complex card), because layout animations of deep trees stutter.

---

## 4. Stagger-out (the forgotten half)

Entrances get all the attention, but exits sell the system. When content leaves (accordion closing, filter change, modal dismiss), it should exit with the same system: `power2.in` (accelerating), ~60% of the entrance duration, reverse stagger (`stagger: { each: 0.04, from: "end" }`). Motion: `exit={{ y: -16, opacity: 0, transition: { duration: 0.35, ease: "easeIn" } }}` inside `AnimatePresence`. An interface whose exits are abrupt `display: none` while entrances are choreographed feels half-built. This asymmetry of care is a top-five LLM tell.

---

## Transition decision table

| Situation | Tool | Pattern |
|---|---|---|
| Route change, narrative site | Motion in `template.tsx` | Curtain (§1) |
| Act-break between sections | GSAP scrub | Section curtain (§2) |
| List → detail, same route | Motion `layoutId` | Shared element (§3) |
| Anything mounting/unmounting | Motion `AnimatePresence` | Enter + designed exit (§4) |
| Scroll-driven anything | GSAP | other reference files |
