# Layered Depth & Parallax

Parallax has a deserved bad reputation because the cheap version (one background image crawling at 0.5×) was strip-mined by 2014 WordPress themes. The agency version is about **relative rates**: multiple surfaces moving at *different* speeds, which is how human vision infers depth. One moving layer is a gimmick; three rates is a world. For named, ready-made showpiece recipes with ids, see [showcase.md](showcase.md).

Rules of thumb before the techniques:
- Speed deltas are small: ±10 to 20% of scroll rate. ±50% reads as broken, not deep.
- Foreground moves *faster* than scroll, background *slower*. Match physical optics or it feels wrong without the viewer knowing why.
- Everything scrub-tied (`ease: "none"`), transforms only.
- Disable under `prefers-reduced-motion` (parallax is the #1 vestibular-trigger complaint).

---

## 1. Multi-speed layers (`data-speed`)

**Term:** Rate-layered section / multiplane.
**Mechanic:** Siblings in one section carry a `data-speed` attribute; a single loop gives each a scrubbed y-drift proportional to `(speed - 1)`. Speed 1 = normal flow, 0.85 = lags (far), 1.15 = leads (near).

**When:** Heroes, full-bleed image sections, any composition from [composition.md](composition.md) with overlapping layers: depth makes overlap legible.
**Overkill when:** dense text/UI sections. Moving reading material is hostile.
**Cost:** Trivial (transforms). Just don't exceed ~6 layers per viewport.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function ParallaxSection({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed ?? "1");
        gsap.to(el, {
          y: () => (1 - speed) * 0.4 * window.innerHeight, // drift over one viewport of travel
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",     // animate across the section's entire visibility
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: container }
  );

  return <section ref={container} className="relative">{children}</section>;
}

// Usage: three rates = depth:
// <ParallaxSection>
//   <span data-speed="0.9"  className="...ghost numeral, far"/>
//   <img  data-speed="1"    className="...main media, normal"/>
//   <div  data-speed="1.12" className="...caption card overlapping the image, near"/>
// </ParallaxSection>
```

`start: "top bottom", end: "bottom top"` makes the drift symmetric around the section's centered position. Elements are at their natural layout spot when the section is mid-viewport. That's why this doesn't break layout the way naive offset parallax does.

**Cheap tell:** one `background-attachment: fixed` image (also broken on iOS), or a single layer at 0.5×. **Instead:** Three-plus siblings at 0.9 / 1.0 / 1.12, symmetric drift.

---

## 2. Image parallax inside a mask

**Term:** Window parallax / internal pan.
**Mechanic:** Container is the "window" (`overflow-hidden`, fixed aspect); image inside is oversized via `scale(1.15)` and pans vertically as the window crosses the viewport. The frame holds still while the photo moves behind it, the signature texture of editorial agency sites.

**When:** Every significant content image. This is a default treatment, not a feature.
**Cost:** Cheap. The scale provides the pan headroom. Never load a larger asset for this. ~15% scale on a properly-sized responsive image is invisible quality-wise.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function ParallaxImage({ src, alt, ratio = "4/3" }: { src: string; alt: string; ratio?: string }) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        frame.current!.querySelector("img"),
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: frame }
  );

  return (
    <div ref={frame} className="overflow-hidden" style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} className="h-full w-full scale-[1.18] object-cover" />
    </div>
  );
}
```

Arithmetic that must hold: pan range (-8% → +8% = 16%) < scale headroom (18%). If edges ever show, scale is too low for the range. Combine freely with the masked-entrance reveal from [scroll-reveals.md](scroll-reveals.md): the entrance plays once and the pan scrubs forever; they don't conflict because the entrance animates the same `yPercent` through GSAP's tween overwrite.

**Cheap tell:** flat `<img>` in a `rounded-xl shadow-lg` card. **Instead:** Still frame, breathing photo.

---

## 3. Sticky-stacking cards

**Term:** Stacking deck / sticky pile.
**Mechanic:** Consecutive full-ish-height cards each get `position: sticky; top: 0`, so each pins while the next slides over it. CSS does 90% of the work; the agency layer is the scrub that *recedes* the covered card: scaling it down and dimming it so it visibly drops into the background instead of just being papered over.

**When:** Sequential content with weight: case studies, principles, chapters. 3 to 5 cards.
**Overkill when:** >6 cards (the gesture wears out), or content users need to compare side-by-side.
**Cost:** Sticky is free. The recede uses `scale` + an opacity veil (cheap). Avoid scrubbed `filter: brightness()`/`blur()` on large cards; that's the expensive variant. If you want blur-recede, budget it as your one filter effect per page ([setup.md](setup.md) §5).

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const SURFACES = ["bg-surface-1", "bg-surface-2", "bg-surface-1", "bg-surface-2"];

export function StackingCards({ items }: { items: { kicker: string; title: string; body: string }[] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card, i, all) => {
        if (i === all.length - 1) return; // last card never gets covered
        gsap.to(card, {
          scale: 0.92,
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: all[i + 1],          // driven by the NEXT card's approach
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
        gsap.fromTo(card.querySelector("[data-veil]"), { autoAlpha: 0 }, {
          autoAlpha: 0.5,
          ease: "none",
          scrollTrigger: { trigger: all[i + 1], start: "top bottom", end: "top top", scrub: true },
        });
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      {items.map((item, i) => (
        <section key={item.title} data-card
                 className={`sticky top-0 flex h-screen flex-col justify-between overflow-hidden
                             px-8 py-12 ${SURFACES[i % SURFACES.length]}`}>
          <span className="eyebrow text-eyebrow text-ink-muted">{item.kicker}</span>
          <div className="max-w-3xl">
            <h3 className="font-display text-h2">{item.title}</h3>
            <p className="text-lead mt-6 max-w-[48ch] text-ink-muted">{item.body}</p>
          </div>
          <div data-veil className="pointer-events-none absolute inset-0 bg-surface-0 opacity-0" />
        </section>
      ))}
    </div>
  );
}
```

Load-bearing details:
- **Trigger is the *next* card**: each recede is driven by its coverer's approach, so timing is exact regardless of card heights.
- The `data-veil` div dims with surface color (not black) so the receding card recedes *into the page's own depth*, and it's opacity, which is cheap where `brightness()` isn't.
- Alternating `bg-surface-1/2` makes each new edge visible the moment it enters.
- `transform-origin` defaults to center, which is correct here: the card shrinks toward the page's vanishing point.

**Cheap tell:** bare `sticky top-0` cards papering over each other with no recede; covered cards look frozen/glitched rather than layered. **Instead:** Covered cards scale to 0.92 and dim under a surface veil, scrubbed to the coverer's approach.

---

## 4. Scrub-drift marquee (ghost type)

**Term:** Scroll-rate marquee.
**Mechanic:** The off-canvas ghost type from [composition.md](composition.md) §4, driven sideways by scroll position (not a CSS loop). Direction can alternate per instance; speed is the parallax delta again, applied on x.

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.to("[data-marquee]", {
      xPercent: -18,
      ease: "none",
      scrollTrigger: { trigger: container.current, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}, { scope: container });

// <div aria-hidden className="overflow-clip">
//   <p data-marquee className="font-display text-ghost whitespace-nowrap font-light text-ink/[0.05]">
//     Studio Nord · Studio Nord · Studio Nord ·
//   </p>
// </div>
```

The type is muted solid: `text-ghost` in the display face at its lightest loaded weight, `text-ink/[0.05]` (0.04 to 0.06), the phrase repeated three times ([typography.md](typography.md) §5, Ghost marquee). Never outlined (`-webkit-text-stroke` with a transparent fill): that is a dated template move.

Scroll-tied drift beats an autonomous CSS `@keyframes` marquee for section texture: it's still when the user is still (calmer, and free under reduced motion if you gate it). Use the looping CSS marquee only for genuinely continuous content like logo walls.

---

## Depth recipe (composing the file)

For a hero or any showpiece section, stack the techniques as planes:

| Plane | Element | Treatment |
|---|---|---|
| -2 | ghost numeral / marquee type | `data-speed 0.9` or x-drift, `text-ghost text-ink/[0.05]`, muted solid |
| -1 | full-bleed media | window parallax (§2) |
| 0 | headline, body | normal flow, text never parallaxes |
| +1 | caption card, badge overlapping media | `data-speed 1.1`, `z-20` |

Text at plane 0 always. The moment copy drifts at a different rate than the reading eye expects, the whole effect flips from depth to seasickness.
