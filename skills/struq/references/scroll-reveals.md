# Scroll-Driven Reveals

The single highest-payoff motion category. Three techniques, in ascending order of drama: staggered group reveals, masked reveals, and split-text line reveals. All assume the providers from [setup.md](setup.md). Shipping values (durations, eases, staggers) justified in [feel-layer.md](feel-layer.md).

---

## 1. Staggered group reveal

**Term:** Orchestrated entrance / stagger choreography.
**Mechanic:** Sibling elements enter with a shared transform + opacity, offset in time by 0.06 to 0.1s each, triggered when the group scrolls into view. The offsets create a reading order. The eye is led, not flooded.

**When:** Default for any group: nav items, card rows, list items, footer columns. Basically never overkill; this is the floor, not the ceiling.
**Cost:** Negligible (transform/opacity only).

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function FeatureRow({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-reveal]", {
        y: 48,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: { each: 0.08, from: "start" }, // try "center" or "edges" for non-linear rows
        scrollTrigger: {
          trigger: container.current,
          start: "top 78%",   // fire while approaching, not at the edge; feels anticipatory
          once: true,          // entrances happen once; re-triggering reads as a glitch
        },
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="grid grid-cols-12 gap-6">
      {children /* each child carries data-reveal */}
    </div>
  );
}
```

Notes that separate this from the reflex version:
- `start: "top 78%"`: content is already moving as it enters the eye line. `"top bottom"` fires too early (animates off-screen), `"top top"` too late.
- `once: true` for entrances. Scrub-tied effects may repeat; entrances may not.
- Vary the stagger origin: a centered logo wall feels better with `from: "center"`.
- Motion swap: for a one-off, `<motion.div initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-22%" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>` is fine. Use GSAP once multiple groups need coordination.

**Cheap tell:** every element fades in with `opacity: 0 → 1`, no transform, all at once, `duration-300 ease-in-out` (the "AOS fade" look). **Instead:** Transform + stagger + expo-out, triggered at 78%.

---

## 2. Masked / clip-path reveal

**Term:** Mask reveal (wipe).
**Mechanic:** The element doesn't fade *into* view. It's *uncovered*, as if sliding out from behind an invisible edge. Two implementations: **overflow mask** (parent `overflow-hidden`, child translates up from 110%) and **clip-path wipe** (`inset()` animates open). The motion has a surface to interact with, which is what reads as physical.

**When:** Images, hero media, big standalone statements. The signature "agency" reveal.
**Overkill when:** applied to every paragraph. Masks are for moments; body content uses technique 1.
**Cost:** `clip-path` and transforms are paint/composite-only. Cheap.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// A) Overflow mask: image slides up from behind its own bottom edge,
//    while scaling down from 1.25 → 1 ("settle") for a parallax-like richness.
export function MaskedImage({ src, alt }: { src: string; alt: string }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: container.current, start: "top 75%", once: true },
        defaults: { duration: 1.2, ease: "expo.out" },
      });
      tl.from(container.current, { yPercent: 18, autoAlpha: 0 }, 0)
        .from("img", { yPercent: 24, scale: 1.25 }, 0); // counter-move: frame up, image down
    },
    { scope: container }
  );

  return (
    <div ref={container} className="overflow-hidden rounded-sm">
      <img src={src} alt={alt} className="block h-full w-full object-cover" />
    </div>
  );
}

// B) Clip-path wipe, for blocks where overflow-hidden would clip siblings.
export function WipeReveal({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        el.current,
        { clipPath: "inset(100% 0% 0% 0%)" },                  // covered from top
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power4.inOut",                                 // wipes read best with in-out
          scrollTrigger: { trigger: el.current, start: "top 80%", once: true },
        }
      );
    },
    { scope: el }
  );

  return <div ref={el}>{children}</div>;
}
```

The **counter-move** in (A) is the load-bearing detail: container and image translate in opposite directions, so the image appears to be revealed *through* a window rather than sliding as a sticker. Same trick powers parallax-in-mask ([depth-parallax.md](depth-parallax.md)).

**Cheap tell:** image scales from 0.8 with a fade ("zoom-in card"), or slides as one rigid block. **Instead:** Frame and content counter-translate inside an overflow mask.

---

## 2C. Curtain section reveal (named preset)

**Term:** Curtain section reveal (a.k.a. "the curtain reveal").
**Mechanic:** The clip-path wipe (2B) *paired with a counter-scale on the inner image*, fired per media frame as a row/section enters view. The frame is **uncovered bottom-up** (`inset(100% 0 0 0)` → `inset(0)`) while the image behind **settles back from a slight zoom** (`scale 1.2 → 1`), both from the same trigger. The picture is drawn up like a rising curtain while the image "breathes" into place behind it. The two tweens are the whole effect: clip alone is flat; clip + counter-scale is what reads as premium and physical.

**When:** Editorial media rows, alternating image/text sections, case-study frames, discipline mosaics. The default "professional section entrance" for imagery on a narrative page. Ready-made named showpiece recipes built on presets like this one are catalogued in [showcase.md](showcase.md).
**Overkill when:** tiny thumbnails, logo walls, or anything below ~240px tall. The wipe needs vertical distance to read.
**Cost:** `clip-path` + `transform` only (paint/composite). Cheap. Composes cleanly with a parallax `yPercent` drift on the *same* inner element (translate + scale coexist).

```tsx
// Clip on the OUTER frame, counter-scale on the INNER image, one timeline, once per frame.
gsap.utils.toArray<HTMLElement>("[data-curtain]").forEach((frame) => {
  const inner = frame.querySelector("[data-curtain-inner]");
  const tl = gsap.timeline({
    scrollTrigger: { trigger: frame, start: "top 88%", once: true },
    defaults: { ease: "power4.out" },
  });
  tl.fromTo(
    frame,
    { clipPath: "inset(100% 0% 0% 0%)" },       // covered from the bottom up
    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 },
  );
  if (inner) tl.fromTo(inner, { scale: 1.2 }, { scale: 1, duration: 1.4 }, "<"); // settle, same start
});
```

Details that matter:
- **Clip on the frame, scale on the inner child**: never both on one node, or the scale visibly drags the clip edge. Structure: `<div data-curtain><div data-curtain-inner><img/></div></div>`.
- `"<"` starts the scale at the **same instant** as the clip; the slightly longer scale duration (1.4 vs 1.1) means the image keeps easing after the curtain is fully open. That trailing settle is the premium tell.
- `start: "top 88%"` fires just before the frame is comfortably in view; `once: true` (entrances never re-fire).
- **Do not also wrap the frame in a fade-in** (e.g. a `FadeIn`/`whileInView` opacity). The curtain *is* the entrance; a fade on top muddies it. Give the media its curtain and nothing else.
- **Reduced-motion:** register the tween only under `(prefers-reduced-motion: no-preference)` and set no initial clip in CSS, so motion-off renders the image fully visible with zero JS. No FOUC.
- Pairs with: a parallax drift on `[data-curtain-inner]` ([depth-parallax.md](depth-parallax.md)) and an entrance-drawn connector line between frames (DrawSVG, recipes in [svg-motion.md](svg-motion.md); API surface in [gsap-api.md](gsap-api.md)).

**Cheap tell:** the frame just fades/zooms in as one block, or the clip runs with no scale. **Instead:** Bottom-up clip on the frame + counter-scale settle on the image, same trigger, image easing a beat longer.

---

## 3. Line-by-line text split (SplitText)

**Term:** Masked line reveal / line stagger.
**Mechanic:** SplitText slices a heading into line elements, each wrapped in an `overflow: clip` mask; lines translate up from 110% below their own mask, staggered. The text appears to rise out of the page in slats, the canonical award-site headline entrance.

**When:** Hero h1, section headlines, pull quotes. 3 to 6 uses per page.
**Overkill when:** body paragraphs (use a plain fade-up), or per-**char** splits on long text (chars are for short display words only; char-staggering a sentence looks like a typewriter toy).
**Cost:** Splitting mutates DOM and measures layout. Fine for headlines, do not split hundreds of nodes. `aria` handling is automatic (SplitText sets `aria-label` on the parent).

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function SplitHeadline({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      SplitText.create(container.current!.querySelector("[data-split]"), {
        type: "lines",
        mask: "lines",        // wraps each line in an overflow-clipped element
        autoSplit: true,      // re-splits on font load / resize; animation must live in onSplit
        linesClass: "split-line",
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: container.current, start: "top 80%", once: true },
          }),
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      <Tag data-split className={className}>
        {children}
      </Tag>
    </div>
  );
}

// Usage:
// <SplitHeadline as="h1" className="font-display text-[clamp(3rem,8vw,9rem)] leading-[0.95] tracking-tight">
//   Design that survives contact with reality
// </SplitHeadline>
```

Details that matter:
- `mask: "lines"` + `yPercent: 110` is the whole effect. Without the mask it's just a stagger fade; with it, each line is born at its own baseline.
- `autoSplit: true` + returning the tween from `onSplit` makes the split responsive and font-safe: GSAP reverts and re-runs on reflow. This is the GSAP 3.13+ API; do not use the old `new SplitText()` + manual resize listeners.
- Give display type `leading-[0.95]` to `leading-[1.05]` *before* splitting; masks clip to line boxes, so loose leading shows gaps.
- Descenders: if g/y/p get clipped during the animation, add `padding-bottom: 0.1em` via `linesClass` styling or keep a tiny visible overshoot.
- Scrub variant for manifesto paragraphs: split into `words`, set initial `opacity: 0.15`, and `gsap.to(words, { opacity: 1, stagger: 0.05, scrollTrigger: { scrub: true, start: "top 70%", end: "top 20%" } })`, the "reading highlights itself" effect.
- Motion swap: only if you refuse GSAP. Manually wrap lines and animate `y` with `whileInView`. SplitText's measurement/re-split handling is why GSAP wins here.
- SplitText typography choreography in depth: [typography.md](typography.md).

**Cheap tell:** whole headline fades in as one block; or chars typewriter in one-by-one with uniform linear timing. **Instead:** Lines rise from individual masks, 0.09s apart, expo-out.

---

## Orchestrating a full section

Reveals compose into one timeline per section so the elements *relate* (label → headline → body → media), instead of each element wearing its own trigger:

```tsx
useGSAP(
  () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: "top 70%", once: true },
      defaults: { ease: "expo.out", duration: 1 },
    });

    tl.from("[data-eyebrow]", { y: 24, autoAlpha: 0, duration: 0.6 })
      .add(splitHeadlineIn(), "-=0.4")                       // overlap, don't queue
      .from("[data-body]", { y: 32, autoAlpha: 0 }, "-=0.6")
      .from("[data-media]", { yPercent: 12, autoAlpha: 0, duration: 1.2 }, "-=0.8");
  },
  { scope: container }
);
```

The `-=0.x` overlaps are the craft: sequential-but-overlapping reads as one composed gesture; strictly sequential reads as a PowerPoint build.
