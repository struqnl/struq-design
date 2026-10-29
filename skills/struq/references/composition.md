# Composition: Overlap, Bleed, and Z-Choreography

No JavaScript in most of this file. Composition is the cheapest "custom build" signal there is: templates stack self-contained sections; art direction makes elements trespass across boundaries. If a build looks generic with motion already in place, the problem is almost always here.

---

## 1. Section bleed (negative-margin overlap)

**Term:** Section bleed / overlap seam.
**Mechanic:** An element from section A extends into section B's space via negative margin (or translate), so the boundary between sections is interrupted. The two sections must sit on different surface tones for the overlap to register.

**When:** Every page should have 1 to 3 seams. Best at hero→content and content→footer joints.
**Overkill when:** every seam overlaps, because then nothing reads as intentional.

```tsx
// Hero media punching down into the next section
export function HeroToIntro() {
  return (
    <>
      <section className="bg-surface-1 px-6 pb-0 pt-40">
        <h1 className="font-display max-w-[12ch] text-[clamp(3rem,8vw,9rem)] leading-[0.95] tracking-tight">
          Studio for durable brands
        </h1>
        {/* The trespasser: pulled down across the boundary */}
        <div className="relative z-10 mx-auto -mb-32 mt-24 max-w-5xl overflow-hidden">
          <img src="/hero.jpg" alt="" className="aspect-[16/9] w-full object-cover" />
        </div>
      </section>

      {/* Receiving section pays for the overlap with top padding */}
      <section className="bg-surface-0 px-6 pb-28 pt-56">
        <p className="max-w-[44ch] text-lg leading-relaxed text-ink-muted">…</p>
      </section>
    </>
  );
}
```

The arithmetic: trespasser gets `-mb-32` + `relative z-10`; receiver gets `pt-56` (≥ the overlap + breathing room). Forgetting the receiver's compensating padding is why naive attempts collide with content.

❌ **Cheap tell:** sections are watertight boxes: each starts where the last ended, every child inside its container. ✅ At least one element per major seam belongs to both sections.

---

## 2. Full-bleed breakouts from a constrained container

**Term:** Breakout / edge bleed.
**Mechanic:** Page content sits in a max-width column, but specific elements escape to the viewport edge. The contrast between contained text and escaping media is the editorial rhythm.

```css
/* globals.css: a reusable content grid, one class, three lanes */
.content-grid {
  display: grid;
  grid-template-columns:
    [full-start] minmax(1.5rem, 1fr)
    [wide-start] minmax(0, 6rem)
    [content-start] min(100% - 3rem, 68rem) [content-end]
    minmax(0, 6rem) [wide-end]
    minmax(1.5rem, 1fr) [full-end];
}
.content-grid > * { grid-column: content; }
.content-grid > .bleed-wide { grid-column: wide; }
.content-grid > .bleed-full { grid-column: full; }
```

```tsx
<section className="content-grid gap-y-10 py-32">
  <p className="text-xs uppercase tracking-[0.14em] text-ink-faint">Selected Work</p>
  <h2 className="font-display text-5xl tracking-tight">Selected projects</h2>
  <p className="max-w-[52ch] text-ink-muted">…</p>
  <img className="bleed-full aspect-[21/9] w-full object-cover" src="/wide.jpg" alt="" />
  <blockquote className="bleed-wide font-display text-3xl leading-snug">…</blockquote>
</section>
```

This named-lines grid replaces the `max-w-6xl mx-auto` wrapper-div habit and makes breakouts a one-class decision. Use `wide` for pull-quotes/secondary media, `full` for one hero-grade image per few screens.

❌ **Cheap tell:** everything lives inside the same `max-w-7xl mx-auto px-4`, so the page is a centered column of boxes. ✅ Text contained, media escaping: the page has margins *and* moments that ignore them.

---

## 3. Type/media overlap with z-index choreography

**Term:** Layered lockup.
**Mechanic:** Display type and imagery occupy the same grid cells and are layered deliberately: type *behind* the image (emerging from it) or *across* it (stacked above). Requires committing to a z-order story: background texture (z-0) → media (z-10) → display type (z-20) → UI/nav (z-50).

**When:** Heroes, project headers, section openers. One strong lockup beats five timid ones.

```tsx
export function ProjectHeader() {
  return (
    <header className="relative grid grid-cols-12 items-end gap-4 px-6 pt-44 pb-24">
      {/* Image occupies cols 5-12 */}
      <div className="col-span-8 col-start-5 row-start-1 overflow-hidden">
        <img src="/project.jpg" alt="" className="aspect-[4/3] w-full object-cover" />
      </div>

      {/* Headline occupies cols 1-9 in the SAME row: overlap is the design */}
      <h1 className="font-display pointer-events-none relative z-10 col-span-9 col-start-1 row-start-1
                     -mb-6 text-[clamp(3.5rem,10vw,11rem)] leading-[0.9] tracking-tight mix-blend-difference text-white">
        Atelier Nord
      </h1>

      <p className="col-span-3 col-start-1 mt-10 text-sm leading-relaxed text-ink-muted">
        Identity & digital flagship for a Scandinavian furniture house.
      </p>
    </header>
  );
}
```

Load-bearing details:
- **Same `row-start-1`** on both children: overlap via grid stacking, not absolute positioning, so it stays in document flow and responsive.
- `mix-blend-difference` (or `exclusion`) keeps type legible across image edges without a scrim. Costs a compositing layer, which is fine for one headline but don't blanket it.
- `pointer-events-none` on the overlapping type so the image stays interactive.
- Type slightly *exceeding* the image (starting left of it, or `-mb-6` below it) is what makes it a lockup instead of a caption accident.

❌ **Cheap tell:** image left, text right, 50/50, `gap-8`, both vertically centered: the eternal "alternating zigzag" section. ✅ Type and image share cells and contest the space.

---

## 4. Off-canvas type (deliberate crop)

**Term:** Cropped display type.
**Mechanic:** Display type intentionally runs off the viewport edge. The crop signals the word is bigger than the page, i.e. confidence. Usually paired with a scrub-tied drift ([depth-parallax.md](depth-parallax.md) §marquee).

```tsx
<div className="relative overflow-hidden py-24">
  <span aria-hidden className="font-display block whitespace-nowrap text-[18vw] leading-none
                               tracking-tight text-ink/[0.06] -translate-x-[6%] select-none">
    PORTFOLIO / PORTFOLIO /
  </span>
  {/* real content layered above */}
  <div className="relative z-10 -mt-[9vw] px-6">…</div>
</div>
```

Always `aria-hidden` + a real heading elsewhere; this is texture, not content. The `text-ink/[0.06]` ghost-type variant doubles as section wayfinding.

❌ **Cheap tell:** all type fully visible, all centered. ✅ One enormous word cropped by the viewport, content overlapping it.

---

## 5. Z-index choreography during scroll

**Term:** Stacking-order storytelling.
**Mechanic:** Scroll changes which layer is "on top": a section slides over the previous one (the prior section appears pinned beneath), or the footer is revealed from *under* the page. These need ~5 lines each and read as wildly custom.

```tsx
// A) Footer reveal: page slides up to UNCOVER a fixed-height footer beneath it.
export function FooterReveal() {
  return (
    <>
      {/* main page content gets a bottom z-layer guarantee */}
      <main className="relative z-10 bg-surface-0 mb-[60vh]">…</main>

      <footer className="fixed bottom-0 left-0 z-0 h-[60vh] w-full bg-surface-1">
        <div className="flex h-full flex-col justify-between p-10">
          <p className="font-display text-[clamp(2.5rem,6vw,6rem)] tracking-tight">Let's talk.</p>
          <div className="flex justify-between text-sm text-ink-muted">…</div>
        </div>
      </footer>
    </>
  );
}
```

Mechanic: `main` has `mb-[60vh]` (a hole at the end of the document) and a higher z-index; the `fixed` footer sits in that hole and is uncovered as the page scrolls past. Zero JS. The sibling pattern, sections covering *each other*, is sticky-stacking, covered with its scrub polish in [depth-parallax.md](depth-parallax.md).

Z-order constitution (declare once, never improvise):

| Layer | z | |
|---|---|---|
| Uncovered footer, ghost type | 0 | beneath the page |
| Page sections | 10 | default |
| Overlapping/trespassing elements | 20 | seams & lockups |
| Sticky UI (nav) | 50 | |
| Page-transition curtain, cursor | 100 | [transitions.md](transitions.md) |

❌ **Cheap tell:** ad-hoc `z-50`/`z-[999]` sprinkled until things look right. ✅ A declared ladder; every overlap is a decision.

---

## Composition checklist (run on every page)

- [ ] ≥2 grid breaks (bleed, overlap, crop, sticky), and they're *the* moments, not noise
- [ ] No two consecutive sections share the same layout skeleton
- [ ] At least one seam where an element belongs to two sections
- [ ] One full-bleed media moment per ~3 viewports
- [ ] Z-ladder declared; `mix-blend` and `pointer-events-none` on overlapping type
- [ ] Section surfaces alternate tonally (surface-0 / surface-1) so seams and overlaps register
