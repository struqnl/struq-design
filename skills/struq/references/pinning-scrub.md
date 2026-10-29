# Pinning & Scrub-Tied Sequences

The showpiece category. A pinned, scrubbed section is where a site stops being a page and becomes a sequence, but it's also the easiest place to wreck UX. Budget: **1 to 2 pinned sequences per site.** Three or more and scrolling feels hijacked. For named, ready-made showpiece recipes with ids, see [showcase.md](showcase.md).

Core concept first, because everything here is one idea: **`scrub` ties timeline progress to scroll position** (scroll = the playhead), and **`pin` freezes an element while the scroll distance plays out**. Triggered tweens fire once and play on their own clock; scrubbed timelines move when the user moves and stop when they stop. That hand-connection is the feel difference between an award site and a slideshow.

All snippets assume [setup.md](setup.md). `scrub: true` vs `scrub: 1` is a feel decision; see [feel-layer.md](feel-layer.md).

**A pin that jerks, jumps, snaps or lands in the wrong place** is one of a short list of causes (`anticipatePin` with Lenis, stale measurements, a transformed ancestor, `vh` on mobile, a pin in a flex or grid parent, nested pins). Work through [pitfalls.md](pitfalls.md) §2 before tuning `scrub`.

---

## 1. Pinned scrub timeline (the workhorse)

**Term:** Pinned sequence / scroll-told story.
**Mechanic:** A one-screen (`100svh`) section pins; the user scrolls "through" an invisible distance (`end: "+=250%"` → 2.5 viewport-heights of scroll) while a timeline scrubs across phases: text swaps, media transforms, layers move. Scroll distance, not time, is the duration unit.

**When:** Product walkthroughs, process steps, one cinematic brand moment.
**Overkill when:** the content is just three paragraphs. Pinning 3 viewports of scroll to read 40 words is hostage-taking.
**Cost:** Pinning re-parents into a pin-spacer and recalculates on resize; transforms inside are cheap. The real cost is UX: always check the section is skippable in <3 swipes on mobile, and skip pinning entirely under `prefers-reduced-motion`.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const PHASES = [
  { kicker: "01", title: "Research", body: "We start in the field, not in Figma." },
  { kicker: "02", title: "Systems", body: "Design tokens before screens." },
  { kicker: "03", title: "Craft", body: "Motion and microcopy get design reviews too." },
];

// ONE gate for the layout switch and the pin. Touch, small screens, reduced motion and
// no-JS all get the stacked list the server rendered.
const GATE = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export function ProcessSequence() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(GATE, () => {
        const section = container.current!;
        const phases = gsap.utils.toArray<HTMLElement>("[data-phase]");

        // Switch the stacked list into a stage, then hide the later phases with GSAP.
        // matchMedia reverts the gsap.set and runs the returned cleanup when the gate
        // stops matching, so the list comes back by itself.
        section.dataset.mode = "rig";
        gsap.set(phases.slice(1), { yPercent: 30, autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=250%",          // 2.5 viewports of scroll-room: ~0.8 per phase
            pin: true,
            scrub: 1,                // 1s catch-up smoothing, see feel-layer.md
            // snap: phases feel like steps? snap to them. Continuous story? omit.
            snap: { snapTo: 1 / (phases.length - 1), duration: 0.4, ease: "power2.inOut" },
          },
        });

        phases.forEach((phase, i) => {
          if (i === 0) return; // phase 0 is the resting state
          tl.to(phases[i - 1], { yPercent: -30, autoAlpha: 0, ease: "power2.in", duration: 0.4 })
            .to(phase,
              { yPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 0.4 },
              "<0.15" // overlap: new phase starts before old one is fully gone
            );
        });

        // A continuous element that evolves across ALL phases sells the sequence
        tl.fromTo("[data-dial]", { rotate: 0 }, { rotate: 270, ease: "none", duration: tl.duration() }, 0);

        return () => { delete section.dataset.mode; };
      });
    },
    { scope: container }
  );

  // Server markup = a readable stacked list. data-mode="rig" (motion branch only) turns it
  // into the pinned stage: the phases stack absolutely and the section takes one screen.
  return (
    <section
      ref={container}
      className="group/seq relative bg-surface-1 py-[8rem]
                 data-[mode=rig]:h-[100svh] data-[mode=rig]:overflow-hidden data-[mode=rig]:py-0"
    >
      <div className="grid grid-cols-12 items-center gap-y-16 px-6 group-data-[mode=rig]/seq:h-full">
        <ol className="relative col-span-12 space-y-16 md:col-span-5 md:col-start-2
                       group-data-[mode=rig]/seq:h-full group-data-[mode=rig]/seq:space-y-0">
          {PHASES.map((p) => (
            <li key={p.kicker} data-phase
                className="flex flex-col justify-center group-data-[mode=rig]/seq:absolute group-data-[mode=rig]/seq:inset-0">
              <span className="eyebrow text-eyebrow text-ink-muted">{p.kicker}</span>
              <h3 className="font-display text-h2 mt-4">{p.title}</h3>
              <p className="text-body mt-6 max-w-[36ch] text-ink-muted">{p.body}</p>
            </li>
          ))}
        </ol>
        <div data-dial aria-hidden
             className="col-span-4 col-start-8 aspect-square rounded-full border border-line max-md:hidden" />
      </div>
    </section>
  );
}
```

Craft notes:
- **`ease: "none"` for anything that should track scroll linearly** (the dial); eases *inside* a scrubbed timeline still apply within their segment, so entrance/exit phases keep `power2` and each swap has shape.
- **One continuous element** (`data-dial`) spanning the whole timeline is what makes it feel like a sequence rather than a slide deck.
- **`"<0.15"` overlap** between exit and entrance: gapless storytelling.
- The `01/02/03` kickers here are fine. Ordinal numbering *inside one stepped component* is real content, distinct from the page-wide numbered-everything tell ([anti-patterns.md](anti-patterns.md) §16). Don't let this pattern leak numerals onto every other section.
- Snap is for stepped content; omit for continuous narratives. Never snap with distances under ~80% per phase (fights the user's thumb).
- **Server markup is the final, readable state.** Nothing is hidden with an inline `style={{ opacity: 0 }}` or a CSS class: the later phases are hidden by `gsap.set` inside the motion branch, so reduced motion, touch, a failed bundle and no-JS all read the three phases as a list. The layout switch is a data attribute set in the same branch, so the list and the pin can never disagree.
- **One `GATE` string** for every decision about this section (the layout switch, the pin, and a canvas if one joins it, [webgl-r3f.md](webgl-r3f.md) §1). Two queries drift: a fine-pointer tablet ends up with a pin and no stage, or a stage and no pin.

**Cheap tell:** content swaps via `opacity` crossfade fired at thresholds (`toggleActions`), no pin: a slideshow that happens near scroll. Or: pinned for 6 viewports with one sentence. **Instead:** Pinned, scrubbed, phases overlapping, one element evolving continuously, ≤2.5 viewports.

---

## 2. Horizontal scroll section

**Term:** Horizontal scroll-jack (the respectable kind).
**Mechanic:** A pinned viewport-height section translates a wide flex row on `x` as the user scrolls vertically. Vertical input, horizontal travel. The pin distance equals the hidden width, so scroll speed maps 1:1 to lateral movement. This 1:1 mapping is why it feels natural where `scroll-snap` carousels feel like a different widget.

**When:** Galleries, project indexes, timeline content that is *genuinely sequential*.
**Overkill when:** the content would work as a grid. Horizontal scroll must be earned by content with an axis. Never put critical info (pricing, CTA) inside one.
**Cost:** Transforms only, so cheap. But images off-screen still load; lazy-load panels 3+. On touch, 1:1 vertical→horizontal is fine; *nested* horizontal sections are not: one per page.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function WorkGallery({ projects }: { projects: { title: string; meta: string; img: string }[] }) {
  const container = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const getDistance = () => track.current!.scrollWidth - window.innerWidth;

      const scrollTween = gsap.to(track.current, {
        x: () => -getDistance(),            // function-based: recalcs on refresh/resize
        ease: "none",                       // scroll IS the ease; easing here feels broken
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: () => `+=${getDistance()}`,  // pin distance = hidden width → 1:1 feel
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          // Do NOT add anticipatePin here when Lenis (or any smooth scroll) is on.
          // See craft note below: it jumps the frame at the pin handoff.
        },
      });

      // Per-panel parallax inside the horizontal world: containerAnimation
      gsap.utils.toArray<HTMLElement>("[data-panel] img").forEach((img) => {
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            containerAnimation: scrollTween, // triggers measured inside the moving track
            start: "left right",
            end: "right left",
            scrub: true,
          },
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="overflow-hidden bg-surface-0">
      <div ref={track} className="flex h-[100svh] w-max items-center gap-[6vw] px-[8vw]">
        <div className="w-[28vw] shrink-0">
          <h2 className="font-display text-h2">Selected<br />work</h2>
        </div>
        {projects.map((p, i) => (
          <article key={p.title} data-panel className="w-[42vw] shrink-0">
            <div className="overflow-hidden">
              <img src={p.img} alt="" loading={i > 1 ? "lazy" : undefined}
                   className="aspect-[4/3] w-full scale-110 object-cover" />
            </div>
            <p className="text-small mt-4 flex items-baseline justify-between text-ink-muted">
              <span>{p.title}</span><span className="eyebrow text-eyebrow">{p.meta}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Craft notes:
- **Function-based `x` and `end` + `invalidateOnRefresh`**: without these, resize breaks the mapping and the section over/under-scrolls.
- **`containerAnimation`** is the GSAP-only feature that makes triggers work *inside* the moving track (per-panel parallax, reveals as panels enter). This is why Motion isn't the tool here.
- Varying panel widths (`28vw` intro, `42vw` projects) beats uniform cards, the same asymmetry rule as vertical layout.
- **Never `anticipatePin` with smooth scroll.** `anticipatePin` pins *early* by predicting scroll velocity, but Lenis feeds it a **smoothed** velocity, so the prediction overshoots and the pin engages a frame too early, then corrects. The result is a visible jump at the exact vertical→horizontal handoff that reads as "jagged, not eased in," worst on a fast scroll-in. It exists to hide native-scroll pin latency; smooth scroll already removes that latency, so it only adds jitter. The fix for a jagged handoff is almost always **remove `anticipatePin`** (not tuning `scrub`). If the *first* scroll-in specifically snaps, the cause is stale pin positions: add the delayed initial `lenis.resize()` + `ScrollTrigger.refresh()` from [setup.md](setup.md) §2, not `anticipatePin`.
- Mobile fallback: **never pin on touch**. The exact matchMedia pattern is §4 below. Pinned horizontal on small phones is a common award-site sin.

**Cheap tell:** `overflow-x-auto` with `scroll-snap` and visible scrollbar presented as the showpiece; or a horizontal section where panels are identical-width cards 1 to 12. **Instead:** Pinned 1:1 mapping, mixed panel widths, parallax inside panels, native fallback on mobile.

---

## 3. Scrub-tied hero (no pin)

**Term:** Departure scrub.
**Mechanic:** The hero reacts to the first hundreds of scroll pixels: headline drifts up faster than scroll, media scales and dims, eyebrow fades. No pinning; the page just *leaves* cinematically instead of sliding away as a rigid block.

**When:** Every hero. This is the cheapest scrub win on the page. Do it even when you do nothing else from this file.
**Cost:** Trivial.

```tsx
useGSAP(
  () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",   // while the hero leaves the viewport
        scrub: true,          // direct tie; departure should feel attached to the hand
      },
    });

    tl.to("[data-hero-title]", { yPercent: -40, ease: "none" }, 0)        // rises faster than page
      .to("[data-hero-media]", { scale: 1.12, ease: "none" }, 0)           // grows as it leaves
      .to("[data-hero-veil]",  { autoAlpha: 0.55, ease: "none" }, 0)       // dims under a veil div
      .to("[data-hero-meta]",  { autoAlpha: 0, yPercent: -100, ease: "none" }, 0);
  },
  { scope: container }
);
```

Different elements at different rates = instant depth (full multi-layer treatment in [depth-parallax.md](depth-parallax.md)). Dim with a `data-hero-veil` overlay div, not `filter: brightness()`: opacity composites cheaply, scrubbed filters don't.

**Cheap tell:** hero scrolls away as one static raster. **Instead:** Title, media, veil, and meta leave at four different speeds, tied to the hand.

---

## 4. The touch fallback: pin on desktop, swipe on touch (the exact pattern)

Pinning fights native touch scroll; every pinned/horizontal section MUST branch.
The contract: **one markup tree**, authored so the touch experience is pure
CSS (scroll-snap), with the pin added *only* inside a desktop
`gsap.matchMedia()` branch. matchMedia reverts the ScrollTriggers automatically
when the viewport crosses the breakpoint: no stale pins, nothing to clean up
by hand.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function Showcase({ items }: { items: { id: string; title: string }[] }) {
  const container = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop + motion-OK ONLY: the pinned 1:1 horizontal scrub (§2).
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const getDistance = () => track.current!.scrollWidth - window.innerWidth;
        gsap.to(track.current, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      // Touch/small/reduced: NO branch needed. The markup below is already a
      // native scroll-snap carousel via the max-md: utilities. No JS, nothing
      // fighting the user's thumb.
    },
    { scope: container }
  );

  return (
    <section ref={container} className="overflow-hidden">
      {/* One tree serves both modes: the max-md: snap utilities are inert on
          desktop (where the pin translates the track), and the md: width is
          inert on mobile (where the track scrolls natively). */}
      <div
        ref={track}
        className="flex items-center gap-[5vw] px-[8vw]
                   max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto
                   md:h-[100svh] md:w-max"
      >
        {items.map((item) => (
          <article key={item.id} className="w-[82vw] shrink-0 snap-center md:w-[42vw]">
            {/* … */}
          </article>
        ))}
      </div>
    </section>
  );
}
```

What makes this the *correct* shape (each is a common failure when improvised):
- **The touch path is CSS-only.** If the fallback also needs JS, it can race the
  matchMedia revert. Scroll-snap markup that's simply *inert* under the desktop
  pin can't break.
- **Both conditions in one query** (`min-width` AND `no-preference`), so
  reduced-motion desktop users get the native carousel too, not the pin.
- **Function-based `x`/`end` + `invalidateOnRefresh`** so crossing the
  breakpoint (rotate, window resize) re-measures instead of over/under-scrolling.
- For *vertically stacked* pinned sequences (§1-style phase swaps), the touch
  fallback is a plain stacked list: keep the phases `relative` in normal flow on
  mobile and only position them `absolute` inside the desktop branch. Same
  principle: the mobile layout must work with zero JS.

---

## When *not* to pin: the self-check

1. Would the content lose meaning as a normal section? If no → don't pin.
2. Is the pin distance ≤ 2.5 viewports? If no → cut phases.
3. Is there already a pinned section on this page? If yes → strong justification or cut.
4. Mobile + reduced-motion fallbacks written (§4)? Not optional.
5. Does anything *continuous* evolve across the pin? If it's only discrete swaps → maybe it's just a stepped section with reveals, not a pin.
