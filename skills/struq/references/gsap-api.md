# GSAP API: the 15% this skill actually uses

This is not a GSAP manual. It's the exact API surface the technique files rely on, so the skill needs no external reference. Everything imports from the `@/lib/gsap` registry ([setup.md](setup.md) §1); every animating component follows the `useGSAP` rules ([setup.md](setup.md) §3).

---

## 1. Tweens & timelines

```ts
gsap.to(target,     { x: 100, duration: 0.8, ease: "expo.out" });   // current → values
gsap.from(target,   { y: 48, autoAlpha: 0 });                        // values → current (SSR HTML is the final state; prefer this)
gsap.fromTo(target, { yPercent: -8 }, { yPercent: 8, ease: "none" }); // explicit both ends
gsap.set(target,    { autoAlpha: 0 });                               // instant, no tween
```

- `target` = element, ref `.current`, selector string (scoped inside `useGSAP`), or array.
- **`autoAlpha`** = opacity + `visibility`. Use it instead of `opacity` for entrances so hidden elements can't intercept clicks.
- **Stagger object:** `stagger: { each: 0.08, from: "start" | "center" | "edges" | "end" | "random", grid: [rows, cols] }`. Plain `stagger: 0.08` = shorthand for `each`.
- **`gsap.defaults({ ease, duration })`**: set once in the registry so every tween starts agency-grade.

**Timelines** sequence tweens; the *position parameter* (third argument) is the craft:

```ts
const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1 } });
tl.from(a, {...})            // starts at 0
  .from(b, {...}, "-=0.4")   // overlaps: starts 0.4s before previous ends
  .from(c, {...}, "<")       // starts WITH the previous tween
  .from(d, {...}, "<0.15")   // 0.15s after the previous tween's START
  .from(e, {...}, "+=0.2");  // gap: 0.2s after everything ends
```

Overlapping (`-=` / `<`) reads as one composed gesture; strict sequencing reads as a PowerPoint build ([scroll-reveals.md](scroll-reveals.md)).

---

## 2. useGSAP (the React hook)

```tsx
const { contextSafe } = useGSAP(() => {
  gsap.from(".card", { y: 40, autoAlpha: 0, stagger: 0.08 }); // ".card" scoped to container
}, { scope: container });

const onHover = contextSafe(() => gsap.to(".dot", { scale: 1.4 })); // event-handler tweens MUST be wrapped
```

Everything created inside is auto-killed on unmount (no leaked ScrollTriggers after route changes). Full rules (`"use client"`, scope ref, animate-`from`, no `window` at module scope): [setup.md](setup.md) §3.

---

## 3. ScrollTrigger

```ts
gsap.to(target, {
  ...,
  scrollTrigger: {
    trigger: container.current,
    start: "top 78%",          // "[trigger-edge] [viewport-edge]"
    end: "bottom top",         // or "+=250%" (2.5 viewports of scroll-room), or a function
    scrub: 1,                  // true = locked 1:1; number = seconds of catch-up (feel-layer.md §2)
    pin: true,                 // freeze the trigger while the scroll distance plays out
    once: true,                // entrances fire once; scrub effects may repeat
    snap: { snapTo: 1 / (n - 1), duration: 0.4, ease: "power2.inOut" }, // stepped content only
    invalidateOnRefresh: true, // re-run function-based values on refresh/resize
    onUpdate: (self) => { progress.current = self.progress; }, // 0 to 1; mutate refs, never setState
  },
});
// Standalone (no tween): ScrollTrigger.create({ trigger, start, end, scrub, onUpdate })
```

**The pinning rules (each one is a real failure when skipped):**

1. **Pinning re-parents** the trigger into a generated pin-spacer, so measure and position accordingly; `pinSpacing: false` only when a following section should slide over the pinned one.
2. **Function-based distances** for anything measured: `x: () => -getDistance()` and `end: () => "+=" + getDistance()`, plus `invalidateOnRefresh: true`. Otherwise resize breaks the mapping.
3. **`ScrollTrigger.refresh()`** after layout settles (fonts/images loaded, entrance finished). Triggers measured against a mid-animation layout are wrong ([page-entrances.md](page-entrances.md)).
4. **Never `anticipatePin` with smooth scroll.** Lenis feeds it a smoothed velocity, the prediction overshoots, and the pin engages a frame early then corrects: a visible jerk at the handoff. Full diagnosis: [pinning-scrub.md](pinning-scrub.md) §2.
5. **One trigger per concern**, not per element: stagger ten cards from one trigger on the parent.
6. **Never pin on touch.** The matchMedia + scroll-snap fallback in [pinning-scrub.md](pinning-scrub.md) §4 is the law.

Pin symptoms (a jerk, a jump, a snap on first engage, a pin that lands in the wrong place), each with cause, fix and check: [pitfalls.md](pitfalls.md) §2.

---

## 4. gsap.matchMedia: responsive + reduced-motion, declaratively

```ts
const mm = gsap.matchMedia();
mm.add({
  motionOK:  "(prefers-reduced-motion: no-preference)",
  isDesktop: "(min-width: 768px)",
}, (ctx) => {
  const { motionOK, isDesktop } = ctx.conditions!;
  if (!motionOK) return;               // SSR markup is already the final state
  if (isDesktop) { /* pin/scrub here */ }
});
// Or one combined query: mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {...});
```

Everything created inside a branch **auto-reverts** when the condition stops matching (rotate, resize, OS setting change). No stale pins, nothing to clean up by hand. Never `if (window.innerWidth < 768)` at setup time: it doesn't revert.

---

## 5. quickTo: per-frame pointer effects

```ts
const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
el.addEventListener("mousemove", (e) => xTo(computeX(e))); // call the function, per frame, cheaply
```

Pre-compiles one reusable tween per property. For anything updating every frame (magnetic buttons, cursor followers, hide-on-scroll headers): never `setState` per mousemove (React render per frame) and never `gsap.to` per event (allocates a tween per pixel). This is also why those effects stay on GSAP's ticker, not a Motion spring loop: the one-clock rule (see the decision table in [SKILL.md](../SKILL.md)).

---

## 6. SplitText (GSAP 3.13 or later)

```ts
SplitText.create(el, {
  type: "lines",            // "lines" | "words" | "chars" (chars: short display words only)
  mask: "lines",            // wraps each line in an overflow-clipped element: the whole effect
  autoSplit: true,          // re-splits on font load / resize
  onSplit: (self) =>        // animation MUST live here so re-splits re-run it
    gsap.from(self.lines, { yPercent: 110, stagger: 0.09, ease: "expo.out", duration: 1.1 }),
});
```

Do **not** use the old `new SplitText()` + manual resize listeners. Accessibility is automatic (`aria-label` set on the parent). Craft details (leading, descenders, the scrub variant): [scroll-reveals.md](scroll-reveals.md) §3. SplitText typography choreography in depth: [typography.md](typography.md).

---

## 7. Flip: expand-to-detail / shared-element morphs

```ts
const state = Flip.getState(".card, .card img");  // 1. measure
container.classList.toggle("expanded");           // 2. change the DOM/layout however you like
Flip.from(state, {                                // 3. animate FROM the old positions
  duration: 0.6, ease: "power4.inOut",
  absolute: true,   // see §7.1: REQUIRES a positioned + height-pinned container
  nested: true,     // when parents AND children both move
});
```

Reach for Flip when the morph must coordinate with scroll or a timeline (card→modal, grid↔list, thumbnail→hero); a simple React-state list→detail swap is Motion `layoutId` territory ([transitions.md](transitions.md) §3, and the decision table in [SKILL.md](../SKILL.md)).

### 7.1 The four Flip failures: read before writing any Flip

Flip has a reputation for "layout shift that nothing fixes" and for fighting the
page. It is almost always one of these four, and they compound, so fixing one and
still seeing a jump does **not** mean you were wrong; it means there were two.
Work the list in order.

**1. `absolute: true` collapses the container.**
`absolute: true` sets every target to `position: absolute` for the tween's
duration. If the container derives its height from those in-flow children (any
CSS grid with `grid-auto-rows`, any auto-height flex/block wrapper), it now has
zero in-flow children and its height collapses to `0`, then snaps back. Everything
below lurches up and slams down.

> The older note that `absolute: true` "prevents reflow fighting" is only half
> true: it prevents *sibling* reflow, and causes *container* collapse. It is not
> a free win. It is a trade that you must pay for with the two fixes below.

**2. No positioned ancestor → items escape the container.**
Absolutely-positioned targets resolve offsets against the nearest *positioned*
ancestor. If the container is not `position: relative`, tiles fly out of its
coordinate space and render **on top of the next section**. This looks like a
z-index bug and is not one. Symptom: content overlapping the section below, not
just shifting.

**3. The height release races the stagger.**
With `stagger`, the last item lands at `duration + stagger.amount`, and stays
`position: absolute` until then. Pin the height for only `duration` and it
releases while items are still out of flow → the same collapse, but *only at the
very end* of the animation. Symptom: the tween looks perfect, then jumps on the
final beat.

**4. A CSS `transition` on a property Flip tweens.**
`Flip.getState(el, { props: 'filter' })` makes GSAP write `filter` inline every
frame. A CSS `transition: filter …` on the same element re-animates every one of
those writes. Two systems own one property; the result is mushy, laggy, or stuck.
Same for `transition: all`. **Never** transition a property you pass to `props`,
and never use `transition: all` on a Flip target.

### 7.2 The rock-solid pattern (React)

Covers all four. Measure the old height *before* the re-render, pin, tween the
container in lockstep with the staggered items, release only after the last one
lands.

```tsx
const DURATION = 0.8;
const STAGGER = 0.18;   // shared, so the height tween can never drift out of sync

const gridRef = useRef<HTMLDivElement>(null);
const flipState = useRef<Flip.FlipState | null>(null);
const prevHeight = useRef(0);

// Capture in the EVENT HANDLER, before React re-renders.
const handleChange = (next: Id) => {
  const grid = gridRef.current;
  if (grid && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    prevHeight.current = grid.getBoundingClientRect().height;   // old height
    flipState.current = Flip.getState(grid.querySelectorAll('[data-flip]'));
  }
  setActive(next);
};

useLayoutEffect(() => {
  const state = flipState.current;
  flipState.current = null;
  if (!state) return;
  const grid = gridRef.current;
  if (!grid) return;

  const from = prevHeight.current;
  const to = grid.getBoundingClientRect().height;  // measure BEFORE pinning
  gsap.set(grid, { height: from });

  const flip = Flip.from(state, {
    duration: DURATION, ease: 'power3.inOut', absolute: true,
    stagger: { amount: STAGGER, from: 'start' },
  });

  // Outlast the stagger (failure #3).
  const height = gsap.to(grid, {
    height: to,
    duration: DURATION + STAGGER,
    ease: 'power3.inOut',
    onComplete: () => gsap.set(grid, { clearProps: 'height' }),
  });

  return () => { flip.kill(); height.kill(); gsap.set(grid, { clearProps: 'height' }); };
}, [active]);
```

```css
.grid {
  position: relative;   /* REQUIRED: failure #2 */
  display: grid;
  grid-auto-rows: …;
}
.grid > [data-flip] {
  /* Do NOT transition any property passed to Flip's `props` (failure #4).
     Opacity is safe here only because Flip never touches it. */
  transition: opacity 0.6s var(--ease-out);
}
```

**Ordering rule:** all measurement happens before any `gsap.set` that mutates
layout. Never `set(height:'auto')` → measure → tween *after* `Flip.from` has
captured target geometry; that mutates layout mid-flight and silently corrupts
the capture.

### 7.3 `scale: true` is a trade, not a default

`scale: true` fakes resizing with `transform: scale`, which is cheaper, but it
**distorts children**: `object-fit: cover` images stretch, text warps, borders and
radii scale non-uniformly.

- Items that genuinely change dimensions (bento tile `span 1` → `span 2`, card →
  modal): **omit `scale`.** Let Flip tween width/height. Correctness beats cheap.
- Uniform items that only *move* (reordering a same-size grid), or brief/small
  morphs where distortion is imperceptible: `scale: true` is a fine win.

### 7.4 Verifying Flip

**Typecheck and lint cannot see any of these failures.** A fully broken Flip
passes `tsc --noEmit` and ESLint clean, which is exactly how a wrong fix survives
review and reaches the user. Flip is only verified by watching it: click the
control and confirm (a) nothing below the container moves, (b) no item overlaps
the next section, (c) the final beat lands without a jump. Check the last one
specifically; failure #3 hides until the very end.

---

## 8. The `ease: "none"` rule

Anything **scrubbed** tracks scroll linearly. Scroll itself is the easing; an ease on top feels broken:

- Scrub-tied values (parallax drift, marquee, the horizontal-scroll track, continuous dial): `ease: "none"`.
- **Every tween whose trigger uses `containerAnimation`** (triggers inside a moving horizontal track): `ease: "none"` on the track tween, or the trigger math breaks.
- The exception: *segment* eases (`power2.out`/`power2.in`) **inside** a scrubbed timeline for phase swaps. Each swap keeps shape while the timeline as a whole stays scroll-locked ([pinning-scrub.md](pinning-scrub.md) §1).

---

## 9. DrawSVG & MorphSVG (pointer)

Both plugins are free (no token) and register in the `@/lib/gsap` module alongside `Flip` ([setup.md](setup.md) §1). The two one-liners the other files rely on:

```ts
gsap.from(path, { drawSVG: 0 });             // self-drawing stroke
gsap.to("#shapeA", { morphSVG: "#shapeB" }); // shape-to-shape morph
```

Full DrawSVG and MorphSVG recipes live in [svg-motion.md](svg-motion.md).
