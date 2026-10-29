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
| **quart-out** | `(0.25, 1, 0.5, 1)` | `power3.out` | hovers, dropdowns, micro | expo's calmer sibling; snappy without drama |
| **quint-in-out** | `(0.83, 0, 0.17, 1)` | `power4.inOut` | curtains, wipes, panel slides | holds, then *commits*; the cinematic door |
| **quart-in-out** | `(0.76, 0, 0.24, 1)` | `power3.inOut` | position swaps, accordions | quint's softer sibling |
| **back-out** | `(0.34, 1.56, 0.64, 1)` | `back.out(1.4)` | badges, toasts, playful pops | 5-6% overshoot; personality, so ration it |
| **circ-out** | `(0, 0.55, 0.45, 1)` | `circ.out` | cursor effects, trailing UI | mechanical-smooth |

Per-vibe personality = picking 2 to 3 of these plus a duration scale ([vibe-presets.md](vibe-presets.md)). A site that uses expo-out/quint-in-out at 0.8 to 1.4s feels heavy and cinematic; the same site on quart-out/back-out at 0.25 to 0.6s feels kinetic and product-y.

For a true signature ease, GSAP `CustomEase.create("brand", "M0,0 C0.2,0 0.1,1 1,1")`. The table covers 99% of shipping needs.

**Cheap tell:** `transition-all duration-300 ease-in-out` on everything, `duration-500` on big things. **Instead:** Asymmetric curves chosen per role, durations spanning 0.2s→1.4s by element weight.

---

## 1. Page transition curtain

The route curtain is one system, and it lives in [route-transitions.md](route-transitions.md): the GSAP `PageTransitionProvider` and `TransitionLink` (cover, swap, reveal), with session-gated loaders in [loaders.md](loaders.md) and per-zone entrances in [page-entrances.md](page-entrances.md). Build every multi-page site from there. The ease is quint-in-out for the panel and expo-out for the content rising behind it, per the table above.

**Cheap tell:** route changes hard-cut, or cross-fade via `opacity` on the whole page. **Instead:** A surface with a committed quint-in-out sweep, content rising in its wake.

<sub>Footnote: a Motion-only `app/template.tsx` that plays a reveal-on-mount curtain (no cover phase, because `template.tsx` cannot animate the old page out) is a valid stopgap for a two-page site that will never grow a provider. It is not the canonical system; prefer [route-transitions.md](route-transitions.md) whenever a site has more than two routes or a loader.</sub>

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
| Route change, narrative site | GSAP `PageTransitionProvider` | Route curtain ([route-transitions.md](route-transitions.md)) |
| Act-break between sections | GSAP scrub | Section curtain (§2) |
| List → detail, same route | Motion `layoutId` | Shared element (§3) |
| Anything mounting/unmounting | Motion `AnimatePresence` | Enter + designed exit (§4) |
| Scroll-driven anything | GSAP | other reference files |
