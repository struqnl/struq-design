# The Scaling System: fluid root-rem, one knob

The single most expensive recurring mistake is building a layout that looks right at
one width and then fixing every element by hand at every other width. That tax comes
from authoring in pixels and treating breakpoints as *resize* tools. This file kills it:
**one root-level knob scales everything proportionally**, and breakpoints are reserved
for genuine *layout changes* (column count, stack to row), never for resizing.

The mental model: design once at a reference width; the whole interface (type, padding,
gaps, component sizes) breathes in and out together as the viewport changes. No
per-element viewport patching.

---

## 1. The knob: scale the root font-size with the viewport

Everything authored in `rem` is measured against `html`'s font-size. Scale that one
value with the viewport and *every rem in the build scales with it at once.*

```css
/* app/globals.css (Next) or src/index.css (Vite): the ONE knob */
html {
  font-size: clamp(0.9375rem, 0.836rem + 0.45vw, 1.1875rem);
  /* ≈ 15px @ 360w  →  ~17px @ 768w  →  ~19px @ 1600w, frozen at 19px beyond */
}
```

### Why this exact form (the a11y-safe part, do not skip)

A pure-`vw` root (`font-size: 2.6vw`) scales beautifully **but breaks browser zoom and
the user's font-size preference**: `vw` ignores both, so zoom does nothing to text and
accessibility is gone. The fix is to **always keep a `rem` term in the expression**:

```
clamp( MIN_rem ,  REM_BASE_rem  +  SLOPE_vw ,  MAX_rem )
                  └── zoomable anchor ──┘  └ fluid part ┘
```

The `REM_BASE` term responds to zoom and OS font settings; the `vw` term adds the fluid
scaling on top. Result: proportional scaling **and** working zoom. This is the only
acceptable form. A clamp whose middle term is `vw`-only is the same bug as pure-`vw`.

> Deriving the middle term: pick two anchors, (minViewport, minRoot) and
> (maxViewport, maxRoot), both in px. `slope_vw = 100 * (maxRoot - minRoot) / (maxVp - minVp)`,
> `base_rem = (minRoot - slope_vw/100 * minVp) / 16`. Or just use a fluid-clamp
> calculator and paste. The two clamp ends are your readable floor and ceiling.

---

## 2. Keep the root band narrow, layer the drama on top

The root knob also scales **body text**, so a wide band makes body huge on 4K or tiny on
mobile. Keep the band **modest and readable** (≈15px to 19px across 360 to 1600). The body
should feel basically the same size everywhere; what you want scaling dramatically is the
*display* type and *section rhythm*, not paragraphs.

So the system is two layers:

1. **Root knob (narrow band)** carries proportional scaling of all spacing, gaps,
   component sizes, and body text. Set once, never touched again.
2. **Per-element `clamp()` on the extremes**: the hero/display type keeps its own
   aggressive fluid clamp *on top* of the root:
   ```css
   .hero-title { font-size: clamp(3rem, 8vw, 9rem); }  /* drama lives here, not in the root */
   ```
   These two compose cleanly: the root scales the rem baseline gently; the hero's own
   clamp adds the big swing. They don't fight because the hero clamp is viewport-driven
   in its own right.

Rule of thumb: **if it's body, labels, padding, gaps, radii, use plain rem and let the root
carry it. If it's a display headline or a showpiece measurement, give it its own
`clamp()`.** The full display-type scale (sizes, tracking, leading per tier) lives in
[typography.md](typography.md).

---

## 3. Author in rem: no px for anything that should scale

This is the discipline that makes the knob work:

- **Type:** rem (Tailwind `text-*` is already rem ✓). Display type: its own `clamp()`.
- **Spacing / padding / gap / margin:** rem (Tailwind `p-*`, `gap-*`, `space-*`, `m-*`
  are already rem ✓). Section padding stays role-varied per the
  [baseline](baseline-prompt.md), just expressed in rem so it scales.
- **Component sizing, max-widths, radii:** rem / `ch` / `%`. `max-w-[44ch]` scales with
  type; `rounded-[0.5rem]` scales with the knob.
- **Hairlines & true 1px details:** `px` is correct. Borders, focus rings, and
  decorative hairlines should stay crisp at 1px and must NOT scale. This is the one place
  px is right.
- **Media:** width in `%`/`rem`/`vw`, height via aspect-ratio (also prevents CLS).

Tailwind v4 cooperates for free: its spacing scale and font sizes are rem-based, so once
the root is wired, every utility inherits the scaling. You mostly just *stop reaching for
arbitrary px values*.

---

## 4. Breakpoints change layout, never size

With the knob doing the resizing, breakpoints (`md:`, `lg:`) are freed for their real
job: **structural** changes that fluid scaling can't express.

- column count: `grid-cols-1 md:grid-cols-12`
- direction: `flex-col lg:flex-row`
- show/hide: a nav collapsing to a menu
- composition swaps: a 50/50 split becoming full-bleed

You should rarely write `text-2xl md:text-4xl lg:text-6xl` ladders again. That's the
manual-resize anti-pattern the root knob replaces. One fluid value, no ladder.

---

## 5. Bounds and the test matrix

- **Ceiling:** the upper `clamp()` arm freezes growth so 2560px+ monitors don't keep
  inflating. Past ~1600 to 1920 the design should *stop scaling and start adding margin*,
  not get bigger. (Cap the content container with a rem/`ch` max-width.)
- **Floor:** the lower arm holds the readable minimum; never let the knob drive body
  below ~15px effective or labels below the 12px floor ([anti-patterns.md](anti-patterns.md) §12).
- **Test at 360 / 768 / 1280 / 1920 / 2560.** If every element looks proportional at all
  five *without per-width overrides*, the system is working. If you're adding `lg:`
  size overrides to fix spacing, something was authored in px: find it and convert.
- **Zoom test:** Ctrl/Cmd-+ to 150% must enlarge text. If it doesn't, a `vw`-only value
  leaked into the root or into a font-size. Fix it (see §1).

---

## 6. Wiring per stack

The knob is just CSS, so it's framework-agnostic. Only the file differs:

```css
/* Next App Router → app/globals.css   |   Vite → src/index.css (imported in main.tsx) */
@import "tailwindcss";

html { font-size: clamp(0.9375rem, 0.836rem + 0.45vw, 1.1875rem); }
```

Full stack-detection and the rest of the primitive translations are in
[stack-targets.md](stack-targets.md). Nothing else about scaling changes between Vite and
Next: it's one CSS rule in the global stylesheet either way.

---

❌ **Cheap tell:** px-everything layout with `sm: md: lg: xl:` size ladders on type and
padding, hand-tuned per breakpoint, that still drifts at 1440 and 2560 and needs a fresh
override every time a new screen is tested.
✅ One a11y-safe root clamp, everything in rem, breakpoints only for structural change,
display type on its own `clamp()`: proportional at every width with zero per-element fixes.
