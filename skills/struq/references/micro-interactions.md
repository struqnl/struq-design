# Micro-Interactions

Garnish, not the meal: micro-interactions are the last 5% that make the first 95% feel intentional. They only land if the macro layer (type, spacing, reveals) is already right. A magnetic button on a templated layout is lipstick.

Budget rule: pick **2 to 3** from this file per site, executed perfectly, rather than all of them. Density of gimmicks reads as junior.

All hover-dependent effects must be gated: wrap in `@media (hover: hover)` / check `window.matchMedia("(hover: hover)").matches`. Magnetic buttons and cursor followers on touch devices are dead weight that still costs listeners.

**Library split (SOTA, not taste):** the high-frequency imperative effects here (magnetic buttons, custom cursor) stay on **GSAP `quickTo`**, because they update every frame and must share the one Lenis+GSAP ticker. A competing Motion spring loop is what makes otherwise-good motion feel subtly off. **Motion** owns the state/lifecycle layer: press/toggle feedback (`whileTap`), `AnimatePresence`, `layout`/`layoutId`, and `whileHover`/`whileInView` one-offs. Same rule as the SKILL.md decision table: *every frame or scroll-tied means GSAP; React state/lifecycle means Motion.* The weighted, smooth feel comes from one clock and tuned easing, not from the library choice.

---

## 1. Magnetic button

**Term:** Magnetic / gravitational hover.
**Mechanic:** Within a proximity zone, the button drifts toward the cursor (and its label drifts slightly further, creating internal depth). On leave, it snaps home with an elastic ease. Implemented with `gsap.quickTo`, which gives pre-compiled tweens for high-frequency updates. Never `setState` per mousemove (re-render per frame) and never raw `gsap.to` per event (allocates a tween per pixel moved).

**When:** Primary CTAs, nav logo, social icons. 1 to 3 magnetic elements per viewport max.
**Cost:** Trivial with quickTo. The gate is taste, not perf.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function MagneticButton({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      if (!window.matchMedia("(hover: hover)").matches) return;

      const el = wrap.current!;
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      const lx = gsap.quickTo(label.current, "x", { duration: 0.45, ease: "power3.out" });
      const ly = gsap.quickTo(label.current, "y", { duration: 0.45, ease: "power3.out" });

      const onMove = contextSafe!((e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * strength); yTo(dy * strength);
        lx(dx * strength * 0.5); ly(dy * strength * 0.5); // label trails → internal parallax
      });

      const onLeave = contextSafe!(() => {
        gsap.to([el, label.current], { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      });

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
    },
    { scope: wrap }
  );

  return (
    <div ref={wrap} className="inline-block">
      <button className="group relative overflow-hidden rounded-full border border-line bg-surface-2
                          px-8 py-4 font-ui text-ui text-ink">
        <span ref={label} className="relative z-10 inline-block">{children}</span>
        {/* fill swell on hover: scales from bottom, CSS-only */}
        <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-accent
                                     transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
      </button>
    </div>
  );
}
```

The two depth cues, the label trailing at 0.5× and the `elastic.out` return, are the difference between "follows the mouse" and "magnetic." Strength stays at or below 0.4. Buttons chasing cursors across the screen is the parody version.

**Cheap tell:** `hover:scale-105 transition` on the button. **Instead:** Proximity drift + trailing label + elastic return + fill swell.

---

## 2. Custom cursor / follower

**Term:** Cursor follower / contextual cursor.
**Mechanic:** A fixed element lerps toward the real cursor (trailing it by its smoothing factor) and **changes state per hover context**: growing into a "View" pill over project cards, a circle over links, hiding over native inputs. The context-reactivity is the entire justification. A dot that only follows is decoration.

**When:** Image-heavy portfolios and campaign pages where "View / Drag / Play" affordances add real information.
**Skip when:** content/SaaS/utility products. Fighting the system cursor in a tool context is hostile. This is the #1 over-reached-for effect, so when in doubt, skip.
**Cost:** One quickTo pair on a `fixed` element, which is cheap. Never hide the native cursor without a perfect replacement, and never `cursor: none` globally (it breaks inputs, iframes, selection).

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"default" | "view">("default");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    // duration here IS the trail amount: 0.5-0.7 visible trail, 0.2 tight
    const xTo = gsap.quickTo(dot.current, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(dot.current, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY); };

    // Event delegation: one listener, data-cursor attributes opt elements in
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setVariant((t?.dataset.cursor as "view") ?? "default");
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    return () => { window.removeEventListener("mousemove", onMove); document.removeEventListener("mouseover", onOver); };
  }, []);

  return (
    <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2">
      <div className={`flex items-center justify-center rounded-full bg-ink text-surface-0
                       transition-all duration-300 ease-out-expo
                       ${variant === "view" ? "eyebrow text-eyebrow h-20 w-20" : "h-2.5 w-2.5"}`}>
        {variant === "view" && "View"}
      </div>
    </div>
  );
}

// Usage: <article data-cursor="view">…</article>. The native cursor stays visible alongside.
```

**Cheap tell:** a ring + dot following the cursor everywhere, no state changes, native cursor hidden. **Instead:** Small dot that *becomes an affordance* over opted-in elements, delegation-driven, hover-gated.

---

## 3. Hover state choreography

**Term:** Compound hover / hover scene.
**Mechanic:** A hover state where 2 to 4 properties move on *different* timings: image scales while a caption rises while siblings dim. The compound timing is what reads as choreography. Mostly CSS via `group`; Motion/GSAP only when state must persist or sequence.

### Hover vocabulary (summary)

| Effect | What it is | Tool | Where |
|---|---|---|---|
| Link underline | Line exits one side, redraws from the other (origin flip) | CSS | §3a |
| Card hover scene | Image scale + caption rise + sibling dim on three clocks | CSS (`group`, `group/list`) | §3b |
| Text swap | Label rolls out of its mask while its twin rolls in | CSS (JS + SplitText for per-char) | §3c |
| Magnetic | Element and label drift toward the cursor, elastic return | GSAP `quickTo` | §1 |
| Cursor follower | Lerped dot that becomes "View / Drag / Play" over opted-in elements | GSAP `quickTo` + delegation | §2 |
| Image distortion on hover | Displacement/ripple of a texture under the pointer, WebGL only | R3F shader | [webgl-scenes.md](webgl-scenes.md) |

Pick from this table by genre (see the selection heuristic at the end). Hover distortion on images is the heaviest item here, so it needs a real poster fallback and the one-canvas budget from [webgl-r3f.md](webgl-r3f.md).

### a) Link underline: draws out one side, redraws from the other

```tsx
<a className="group relative inline-block text-ink" href="/work">
  Selected work
  <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0
                               bg-current transition-transform duration-400 ease-out-quart
                               group-hover:origin-left group-hover:scale-x-100" />
</a>
```

The origin flip (`origin-right` at rest, `origin-left` on hover) makes the line *exit the way it came in*: exit stage right, re-enter stage left. It is the detail people feel and can't name.

### b) Card hover scene: image, caption, arrow, siblings

```tsx
export function WorkCard({ p }: { p: { img: string; title: string; tag: string } }) {
  return (
    // parent <ul> gets: className="group/list", enables sibling dimming
    <li className="group transition-opacity duration-500
                   group-hover/list:opacity-40 group-hover/list:hover:opacity-100">
      <a href="#" className="block">
        <div className="overflow-hidden">
          <img src={p.img} alt="" className="aspect-[4/3] w-full object-cover
                                             transition-transform duration-700 ease-out-expo
                                             group-hover:scale-[1.06]" />
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <h3 className="type-h3 text-h3">{p.title}</h3>
          <span className="text-small translate-x-2 text-ink-muted opacity-0
                           transition-all duration-400 delay-75 ease-out-quart
                           group-hover:translate-x-0 group-hover:opacity-100">
            {p.tag} →
          </span>
        </div>
      </a>
    </li>
  );
}
```

Three timings: image `700ms` (heavy thing, moves slow), tag `400ms` + `delay-75` (responds after), siblings `500ms` dim. **Sibling dimming** (`group/list` named group: list dims everyone, hovered card restores itself) is the single highest-value hover trick. It turns a grid into a spotlight.

### c) Text swap (slot-machine label)

```tsx
<button className="group relative overflow-hidden px-6 py-3">
  <span className="block transition-transform duration-400 ease-out-expo
                   group-hover:-translate-y-full">Get in touch</span>
  <span aria-hidden className="absolute inset-x-6 top-full block transition-transform duration-400
                               ease-out-expo group-hover:-translate-y-full">Get in touch</span>
</button>
```

Label rolls up and out of its mask while its twin rolls in: the masked-reveal principle ([scroll-reveals.md](scroll-reveals.md)) at button scale. With per-char stagger it becomes the full slot-machine; that needs JS (SplitText chars + `stagger: 0.02`) and is worth it on exactly one element (the main CTA or logo).

**Cheap tell:** `hover:shadow-xl hover:-translate-y-1` on cards: everything moves at once, on one duration, with a shadow change for "lift." **Instead:** Image, caption, and siblings on three different clocks; elevation never via shadow swell.

---

## 4. Micro-feedback (press, focus, toggle)

The smallest layer: `whileTap` and friends. Motion is the right tool (state-driven):

```tsx
import { motion } from "motion/react";

<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
  className="... focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
>
  Submit
</motion.button>
```

- Press = scale **0.97**, 150ms. (Not 0.9, that's a toy.)
- Focus rings: visible, offset, in the accent. Designed, not suppressed. Keyboard users get states as considered as hover users'.
- Toggles/accordions animate `grid-template-rows: 0fr → 1fr` (or Motion `height: "auto"`), 300ms quart-out, with a chevron rotating on the same clock.

---

## 5. Animated icons (Lordicon / Lottie)

An animated icon is a micro-interaction and obeys this file's rules: budget 2 to 3 per view, hover-gated, reduced-motion renders static (the still frame). It's state/lifecycle-driven (a Lottie player toggled on hover/click), so triggering lives in **Motion** territory, not GSAP.

The discipline that separates "delightful" from "distracting" is **timing**, and it's locked:

| Trigger | Duration | Notes |
|---|---|---|
| Click / tap | **≤ 500ms** | must keep up with repeat clicks; longer lags the cursor and annoys by the 3rd press |
| Hover (decorative) | **1500-3000ms** | the delight sweet spot; more complex symbol → longer end |
| GIF fallback loop | **2000-5000ms delay between loops** | only if tech forces a looping GIF |

- **Never loop in a dashboard / standard UI**; trigger on hover instead. (Looping is for a page *loader*, not ambient decoration. Same as "nothing moves the user didn't cause," [feel-layer.md](feel-layer.md) §5.)
- **No flashing/flickering** (seizure hazard); **natural physics only**. Unnatural bounce or motion that contradicts the icon's meaning leaves users unsettled.

Full icon doctrine (source via Iconify, system vs decorative registers, color/state, labels, accessibility, touch targets) is in [iconography.md](iconography.md).

**Cheap tell:** a row of icons all looping forever, or a 700ms "success" spin that lags every click. **Instead:** One hover-triggered animated anchor that plays once, ≤500ms on click, static under reduced motion.

---

## Selection heuristic

| Site genre | Ship | Skip |
|---|---|---|
| Portfolio / studio | cursor "View" states, sibling dimming, magnetic CTA | none |
| Campaign / launch | magnetic CTA, text-swap buttons, underline choreography | cursor follower (usually) |
| Editorial / content | underline choreography, image scale-in-mask | magnetic, cursor |
| SaaS / product | press feedback, focus design, hover scenes on cards | cursor follower, magnetic (almost always) |
