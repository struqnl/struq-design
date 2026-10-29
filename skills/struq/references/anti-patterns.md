# Anti-Pattern Gallery: the Cheap Reflex vs. the Agency Version

Each pair below names the **tell**, the specific detail that exposes the default. Use this file as a pre-ship checklist: scan for tells, replace with the paired fix. Cross-references point to the full technique.

---

## 1. Elevation

**Reflex:**
```tsx
<div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200">
```
**The tell:** `shadow-md`/`shadow-lg` doing elevation on a light card, gray-200 border, on a `bg-gray-50` page. Component-library depth model.

**Agency:**
```tsx
// Dark: elevation = lighter surface. Light: elevation = hairline + tone.
<div className="rounded-sm bg-surface-2 p-8 border border-line">
```
Surface ladder steps (`surface-0 → 1 → 2`) signal depth tonally. Real shadows are reserved for true floaters, and then: `shadow-[0_24px_80px_-12px_rgb(0_0_0/0.4)]`. ([baseline-prompt.md](baseline-prompt.md))

---

## 2. The feature section

**Reflex:**
```tsx
<section className="py-16">
  <h2 className="text-center text-3xl font-bold">Why Choose Us</h2>
  <p className="mt-2 text-center text-gray-500">Everything you need to succeed</p>
  <div className="mt-12 grid grid-cols-3 gap-8">
    {features.map(f => (
      <div className="rounded-xl border p-6 shadow-sm text-center">
        <Icon className="mx-auto h-8 w-8 text-blue-600" />
        <h3 className="mt-4 font-semibold">{f.title}</h3>
        <p className="mt-2 text-sm text-gray-500">{f.body}</p>
      </div>
    ))}
  </div>
</section>
```
**The tell:** centered h2 + subhead + 3 identical icon-cards. The single most recognizable AI/template section on the internet.

**Agency:** kill the cards; let type and rhythm carry it:
```tsx
<section className="content-grid py-40 gap-y-0">
  <p className="text-xs uppercase tracking-[0.14em] text-ink-faint">Capabilities</p>
  <div className="mt-16 divide-y divide-line">
    {features.map((f) => (
      <div key={f.title} className="group grid grid-cols-12 items-baseline gap-4 py-10">
        <h3 className="font-display col-span-6 text-3xl tracking-tight">{f.title}</h3>
        <p className="col-span-5 col-start-8 max-w-[44ch] text-ink-muted">{f.body}</p>
      </div>
    ))}
  </div>
</section>
```
Editorial rows, left-aligned, divided by hairlines, asymmetric columns. Hierarchy comes from type scale and the eyebrow, not from a number on every row (see §16). ([composition.md](composition.md))

---

## 3. Scroll reveal

**Reflex:**
```tsx
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.3 }}>
```
**The tell:** opacity-only, no transform, no stagger, 300ms default ease. Content blinks into existence, all siblings simultaneously.

**Agency:**
```tsx
gsap.from("[data-reveal]", {
  y: 48, autoAlpha: 0, duration: 0.9, ease: "expo.out",
  stagger: 0.08,
  scrollTrigger: { trigger: container.current, start: "top 78%", once: true },
});
```
Transform + opacity, expo-out tail, 80ms rhythm between siblings. ([scroll-reveals.md](scroll-reveals.md))

---

## 4. Headline entrance

**Reflex:** the whole `<h1>` fades up as one block, or worse, a per-character typewriter with uniform linear timing.
**The tell:** text treated as a rectangle (or a teletype), not as lines.

**Agency:**
```tsx
SplitText.create(el, {
  type: "lines", mask: "lines", autoSplit: true,
  onSplit: (self) => gsap.from(self.lines, {
    yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.09,
    scrollTrigger: { trigger: el, start: "top 80%", once: true },
  }),
});
```
Lines rising from individual overflow masks. ([scroll-reveals.md](scroll-reveals.md) §3; the typographic side of SplitText lives in [typography.md](typography.md))

---

## 5. Hero

**Reflex:** centered h1, gray subhead, two buttons (one blue, one outline), then a product screenshot in a browser-chrome mockup, possibly tilted with a purple glow.
**The tell:** the symmetric "SaaS hero stack," gradient text on the keyword, floating screenshot.

**Agency (structure, not just styling):** left-aligned or compositionally split; h1 at `clamp(3rem,8vw,9rem)` doing the visual work; media bleeding off-grid or punching into the next section; meta-information (location, availability, scroll cue) placed at the hero's edges like a poster; scrub-tied departure ([pinning-scrub.md](pinning-scrub.md) §3). A hero is a *composition*, not a stack. For ready-made hero showpieces, see [showcase.md](showcase.md).

---

## 6. Parallax

**Reflex:** `background-attachment: fixed` banner, or one layer drifting at 0.5× scroll.
**The tell:** single-layer movement (and iOS breakage). Depth needs *relative* rates.

**Agency:** three siblings at `data-speed` 0.9 / 1.0 / 1.12 within one section, scrubbed, symmetric around natural position, plus photos panning inside `overflow-hidden` frames (`scale(1.18)`, `yPercent` from -8 to 8). ([depth-parallax.md](depth-parallax.md))

---

## 7. Sticky stacking

**Reflex:** bare `sticky top-0` cards papering over each other.
**The tell:** the covered card sits frozen at full scale/brightness. It looks glitched, not layered.

**Agency:** each covered card recedes (`scale: 0.92`, surface-colored veil to 50%), scrubbed to the *next* card's approach. ([depth-parallax.md](depth-parallax.md) §3)

---

## 7b. Pinned / horizontal-scroll handoff

**Reflex:** reach for `anticipatePin: 1` (and/or `scrub: true`) to "smooth" the moment a pinned or horizontal section engages.
**The tell:** a jerk/jump right at the vertical-to-horizontal (or pin-on) handoff, worst on a fast scroll-in. It snaps then corrects instead of easing in. With smooth scroll (Lenis), `anticipatePin` predicts from a *smoothed* velocity, overshoots, and pins a frame early; `scrub: true` then passes that spike straight through 1:1.

**Agency:** **no `anticipatePin`** with smooth scroll + `scrub: 1` (pairs with Lenis lerp ~0.09 so the track settles softly). If only the *first* scroll-in snaps, the cause is stale pin positions, so add the delayed initial `lenis.resize()` + `ScrollTrigger.refresh()` from [setup.md](setup.md) §2. Tuning `scrub` is not the fix; removing `anticipatePin` is. ([pinning-scrub.md](pinning-scrub.md) §2)

---

## 8. Section transitions

**Reflex:** every section a watertight `py-16` box; boundaries are just background-color changes at a hard line.
**The tell:** uniform vertical rhythm + zero cross-boundary elements. The page is a stack of slides.

**Agency:** padding varies by section role (8/16/24rem); at least one element trespasses each major seam (negative margin + z); one act-break uses a scrubbed curtain sweep. ([composition.md](composition.md), [transitions.md](transitions.md) §2)

---

## 9. Page navigation

**Reflex:** hard cut between routes, or a 200ms full-page opacity crossfade.
**The tell:** navigation is an event, not a moment. No surface moves, content just swaps.

**Agency:** quint-in-out curtain sweep (`scaleY` with flipping `transform-origin`) + incoming content rising with expo-out after a 0.25s overlap. Total ≤ 900ms. ([transitions.md](transitions.md) §1; for full-screen route transitions on multi-page sites see [route-transitions.md](route-transitions.md))

---

## 10. Buttons & hovers

**Reflex:**
```tsx
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 hover:scale-105">
```
**The tell:** color-darken + scale-up + `transition-all duration-300`, identical on every interactive element.

**Agency:** one primary CTA with a *scene*: fill swelling from the bottom edge, label rolling through a mask or trailing magnetically, elastic return. Secondary links get the origin-flipping underline. Cards get three-clock hovers + sibling dimming. Press = `scale 0.97` at 150ms. ([micro-interactions.md](micro-interactions.md))

---

## 11. Color & accent

**Reflex:** `bg-gradient-to-r from-blue-600 to-purple-600` (buttons, hero glow, `bg-clip-text` headline), accents in 4 hues, pure white page with gray-500 text.
**The tell:** the blue-purple gradient is the watermark of generated design; multiple accents mean no hierarchy decision was made.

**Agency:** temperature-shifted neutrals doing 95% of the work; **one** accent appearing at most once per viewport; headline color = ink, with hierarchy from scale. If a gradient exists at all it is a subtle same-hue tonal ramp on a surface, never on text. ([vibe-presets.md](vibe-presets.md))

---

## 12. Type scale

**Reflex:** h1 `text-4xl`, h2 `text-3xl`, h3 `text-2xl`, h4 `text-xl`: five steps between 20 and 36px, all `font-bold`, default tracking.
**The tell:** compressed mid-range hierarchy. Nothing leads, everything is "kind of big."

**Agency:** two extremes. Display at `clamp(3rem,8vw,9rem)` with `tracking-tight leading-[0.95]`, then body at 1 to 1.125rem, with 11px tracked-uppercase eyebrows between. Weight contrast over size proliferation: **hero/display runs light (300 to 400)**. Large + light is the agency signal; heavy display (600+) is a deliberate genre choice only, never the reflex. **Floor:** body ≥1rem, muted ≥0.875rem, nothing below 12px (labels excepted only when uppercase+tracked+short). **Contrast:** body ≥4.5:1 (WCAG AA), large/≥24px ≥3:1; the faintest ink tier is meta-only, never body copy. ([baseline-prompt.md](baseline-prompt.md); the full two-face system, light display weights and fluid scale are in [typography.md](typography.md))

---

## 13. Iconography & ornament

**Reflex:** 🚀✨💡 as feature icons; the AI-cliché trio (`Sparkles`, `Rocket`, `Zap`/lightning, in any set) standing in for "magic / launch / fast"; reflexive Lucide for everything; icons at 5 sizes/strokes in brand-blue circles with light-blue backgrounds; an animated icon looping forever in a dashboard, or a 500ms+ animation lagging a click; a complex decorative icon turned to mud at 16px.
**The tell:** icon-as-filler. `Sparkles`/`Rocket`/`Zap` are the visual signature of generated UI; the icon circle chip is the card-grid's sidekick; constant-loop animation reads as distraction, not delight.

**Agency:** icons only where they inform (UI affordances, scannability, button anchors, never decoration); **one coherent family chosen for the brand via Iconify** (not reflexive Lucide), one size, `strokeWidth={1.5}`, ink-colored; system icons small, decorative/animated big. Animated icons: ≤500ms on click, 1.5 to 3s on hover, never loop in standard UI, natural physics, reduced-motion falls back to static. Decoration jobs otherwise go to hairline rules, ghost type, a single oversized numeral as an accent (not a per-row counter, see §16), real photography/render. Often the strongest move is **no icon at all**. (Full doctrine: [iconography.md](iconography.md); drawn or morphing line art belongs to [svg-motion.md](svg-motion.md))

---

## 14. The exit problem

**Reflex:** choreographed entrances, then `display: none` exits: accordions snapping shut, modals vanishing, filtered items teleporting.
**The tell:** asymmetry of care. The system only performs in one direction.

**Agency:** every exit designed at ~60% of entrance duration with `power2.in` / `easeIn`, reverse stagger for groups, `AnimatePresence` for unmounts. ([transitions.md](transitions.md) §4)

---

## 15. Loading & lorem

**Reflex:** lorem ipsum, "John Doe, CEO at Acme", `https://via.placeholder.com/600x400`, spinner gif while content pops in.
**The tell:** placeholder *anything*. It signals nobody made content decisions, and layout was never tested against reality.

**Agency:** real (or convincingly written) copy with opinions; image areas with explicit aspect ratios; entrances double as load choreography (content reveals when ready, no spinner, no CLS).

---

## 16. Numbered everything

**Reflex:** `01 / 02 / 03 / 04` stamped on every section header, every feature, every list row (often oversized in a corner) as the page's wayfinding system.
**The tell:** uniform sequencing is reflexive, not editorial. No art director numbers *everything*; it is the same impulse as `py-16` on every section, applied to labels. It signals "I needed a decoration and reached for the nearest one."

**Agency:** wayfinding through variety: tracked uppercase eyebrows, hairline rules, scale jumps, surface changes. A numeral earns its place only as a **single deliberate accent** (one oversized `03` against a manifesto line), never as a per-row counter. If you can delete the numbers and lose no meaning, they were filler.

**The boundary:** ordinal numbering *inside one genuinely stepped component* (the phase kickers of a pinned sequence, see [pinning-scrub.md](pinning-scrub.md) §1, or a numbered process that really is ordered) is legitimate content, not this tell. The tell is *page-wide* stamping: numerals as the default decoration on every section, feature, and row.

---

## 17. Monospace as flavor

**Reflex:**
```tsx
<p className="font-mono text-xs uppercase tracking-widest">// System online</p>
<span className="font-mono text-sm">[ 2024 ]</span>
```
**The tell:** monospace on eyebrows, labels, stats, badges, timestamps, or body to look "technical / engineered / terminal." It is the aesthetic of a code editor, not a designed page, and it has become a default reach for "techy," which makes it read as generated.

**Agency:** a real text face carries all UI and copy; "precision" comes from tracking, `tabular-nums` on figures, and tight type, not from a typewriter font. **Mono is reserved for literal code** (snippets, inline `code`, terminal output on a dev-tool site where it is genuinely the subject). Anywhere else, it is a tell. The same logic kills the scramble/decode "terminal" loader ([loaders.md](loaders.md)).

---

## 18. Per-viewport pixel-fixing

**Reflex:**
```tsx
<h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl">
<section className="px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-32">
// fixed px widths everywhere; a fresh override added each time a new screen breaks
```
**The tell:** every size hand-tuned per breakpoint, layout authored in px, and it *still* drifts at 1440 and 2560, so each new viewport means another round of element-by-element fixes. The hours sink is real and it never converges.

**Agency:** one fluid root-rem knob (an a11y-safe `clamp` that keeps a rem term so zoom works), everything authored in rem, breakpoints reserved for **layout changes** (column count, stack/row) not resizing; display type carries its own `clamp()` on top. The whole UI scales proportionally at every width with zero per-element overrides. ([scaling.md](scaling.md))

---

## The 30-second tell scan

Before shipping, run these grep-level checks:
- `shadow-md|shadow-lg` on cards → §1 · `from-blue|to-purple|bg-clip-text` → §11
- `py-16` ≥3 times → §8 · `grid-cols-3` of identical children → §2
- `hover:scale-105|transition-all` → §10 · `duration-300` as the only duration → [feel-layer.md](feel-layer.md)
- `opacity` tweens with no transform partner → §3 · emoji in JSX → §13
- `anticipatePin` anywhere while Lenis/smooth scroll is mounted → §7b (jagged pin handoff)
- `Sparkles|Rocket|Zap` icon imports (any set) / icon in a colored chip / looping animated icon → §13 · `font-mono` outside a code block → §17
- `grep -P '0\d\s*[/.\-\u2014\u2013]'` (catches `01 /`, `01.`, `01 -` and the dash variants) / `0{i + 1}` numbering every section or row → §16
- `font-bold` on the hero/`h1` / largest size = `text-4xl` → §12 · faint text on body copy / contrast below AA → §12
- size ladders like `text-2xl md:text-4xl lg:text-6xl`, `px-`/`py-` tuned per breakpoint, fixed-`px` layout widths, or no fluid root font-size → §18
- `text-4xl` as the largest size on the page → §12 · "Lorem|Acme|John Doe" → §15
