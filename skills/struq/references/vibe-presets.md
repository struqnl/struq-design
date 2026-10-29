# Aesthetic Architecture: Tokens & Vibe Presets

The skeleton (composition, motion techniques, type *scale*) stays constant; the vibe lives entirely in a token layer. Components only ever reference **semantic** utilities (`bg-surface-1`, `text-ink-muted`, `ease-out-expo`, `font-display`), never raw colors, faces, or curves, so swapping one CSS block + two font imports re-skins the whole build.

**Typography is the most important lever in this skill.** The face pairing decides more of a vibe than the palette does. Every preset below names exactly two faces (one display, one text), all free to use (Google Fonts or Fontshare), and the display face runs **light (300 to 400)** unless the preset is a deliberate heavy genre. For pairing alternatives, the fluid scale, tracking and leading per tier, and SplitText typography, see [typography.md](typography.md).

More curated palettes, with live previews, are at struq.nl.

## The token contract

Every preset defines exactly this surface area. Components may use nothing outside it (plus neutral utilities like grid/flex/spacing):

| Token | Role |
|---|---|
| `--color-surface-0…3` | the elevation ladder; 0 = page, each step = one layer closer |
| `--color-ink / -muted / -faint` | text hierarchy: three steps, no gray-400/500/600 improvisation |
| `--color-accent` | the one accent |
| `--color-line` | hairline borders/dividers (a low-alpha ink, not a gray) |
| `--font-display / --font-body` | the pairing (one display + one text face, max) |
| `--font-mono` | **optional, code only**: literal snippets, `code`, terminal output. Not a preset face. Never for eyebrows, labels, stats, or body (that's the terminal-aesthetic tell, see [anti-patterns.md](anti-patterns.md) §17) |
| `--radius-base` | corner philosophy in one number |
| `--ease-out-expo / --ease-out-quart / --ease-in-out-quint` | the motion vocabulary ([transitions.md](transitions.md)) |

Plus two values that live in JS (per-preset constants, since Lenis/GSAP don't read CSS): **Lenis lerp** and the **GSAP ease pair** ([feel-layer.md](feel-layer.md)).

**Surface direction (light vs dark: decide it, don't improvise it):** dark ladders step **lighter** per layer (closer = brighter; Dark Cinematic is the reference). Light ladders pick one of two directions and hold it: the page is the lightest layer and panels step subtly **deeper** (Warm Editorial's cream → `#DFD3BF`, Luxury Minimal's greige), or the page is toned and panels **lift to white** (Brutalist's `#FFFFFF` surface-1 on `#EFEFEA`). Either way, separation in light mode leans harder on `--color-line` hairlines (a low-alpha *ink*, never gray-200) because light tone steps are subtler than dark ones, and shadows stay banned as an elevation system in both modes.

**Typography lock (applies across all presets):** hero/display weight runs **light (300 to 400)** unless the preset's genre deliberately calls for heavy (Brutalist's Archivo Black is the one intentional exception below); body ≥1rem, nothing below 12px; and every preset's `ink-muted`/`surface-0` pair must clear **WCAG AA (≥4.5:1)** for body-length text. `ink-faint` is meta-only. Presets choose the *faces and weights*; the floor and contrast rules sit on top, non-negotiable. ([anti-patterns.md](anti-patterns.md) §12)

## Wiring (Tailwind v4 + next/font)

```css
/* app/globals.css */
@import "tailwindcss";
@import "./theme.css";   /* ← the preset. Swap this file to change vibe. */

::selection { background: var(--color-accent); color: var(--color-surface-0); }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }
```

```tsx
// app/layout.tsx: fonts expose CSS vars the theme maps onto
import { Fraunces, Inter } from "next/font/google";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display-face", axes: ["opsz"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body-face" });

// <html className={`${display.variable} ${body.variable}`}>
//   <body className="bg-surface-0 font-body text-ink antialiased">
```

The theme maps semantic tokens onto those vars with `@theme inline` (required when a token references another variable). Utilities generated automatically: `bg-surface-2`, `text-ink-faint`, `border-line`, `font-display`, `rounded-base`, `ease-out-expo`.

---

## Preset 1: Warm Editorial

Magazine confidence: cream paper, warm ink, a serif with personality. For studios, writing-led brands, agencies, food/culture.

```css
/* theme.css: WARM EDITORIAL */
@theme {
  --color-surface-0: #FAF6F0;
  --color-surface-1: #F3EDE2;
  --color-surface-2: #EAE1D2;
  --color-surface-3: #DFD3BF;

  --color-ink: #1C1917;
  --color-ink-muted: #6B6259;
  --color-ink-faint: #A59C8F;
  --color-accent: #A33B20;            /* sienna: appears in links, numerals, selection */
  --color-line: rgb(28 25 23 / 0.14);

  --radius-base: 2px;                  /* near-sharp; print doesn't round corners */

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
}
@theme inline {
  --font-display: var(--font-display-face), Georgia, serif;   /* Fraunces */
  --font-body: var(--font-body-face), system-ui, sans-serif;  /* Inter */
}
```

| Axis | Spec |
|---|---|
| Fonts | **Fraunces** (display, opsz axis: goes from bookish to razor at size) + **Inter** (text). Display weight 300-400, not bold: the serif's shapes do the work |
| Spacing bias | generous but bounded: sections 8-14rem; text measures tight (`max-w-[44ch]`); dense hairline-divided lists ([anti-patterns.md](anti-patterns.md) §2 layout is native here) |
| Border/shadow | hairlines everywhere, zero shadows; `divide-y divide-line` is the signature texture |
| Motion personality | *editorial-calm*: `power3.out` entrances 0.7 to 0.9s, stagger 0.1; Lenis lerp **0.1**; scrub 1; no springs anywhere |
| Distinctive moves | drop caps, a single oversized serif numeral in accent (as a one-off flourish, never a per-section counter), italic opsz pull-quotes at `wide` bleed, image frames with 2px radius |

---

## Preset 2: Dark Cinematic

Film-title gravity: near-black tonal ladder, cool light, one signal accent. For creative tech, film/music, launches, portfolio showpieces.

```css
/* theme.css: DARK CINEMATIC */
@theme {
  --color-surface-0: #0A0A0B;
  --color-surface-1: #111113;
  --color-surface-2: #19191C;
  --color-surface-3: #232328;

  --color-ink: #F2F2F0;
  --color-ink-muted: #9C9CA4;
  --color-ink-faint: #5A5A63;
  --color-accent: #FF5C28;             /* signal orange: sparingly, it burns */
  --color-line: rgb(255 255 255 / 0.08);

  --radius-base: 4px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
}
@theme inline {
  --font-display: var(--font-display-face), system-ui, sans-serif;   /* Space Grotesk */
  --font-body: var(--font-body-face), system-ui, sans-serif;          /* Inter */
}
```

| Axis | Spec |
|---|---|
| Fonts | **Space Grotesk** display at weight 300-400 (tight tracking, `leading-[0.92]`) + **Inter** (text). Meta/labels are **tracked uppercase Inter** (0.14em+), not mono: the cinematic register comes from scale, darkness, and spacing, never a terminal font (mono is code-only, see [anti-patterns.md](anti-patterns.md) §17) |
| Spacing bias | extreme: heroes 16-20rem, full-viewport breathers with a single line of type; darkness needs emptiness to read as cinema |
| Border/shadow | tonal ladder does *all* elevation (this is the preset the surface system was born for); hairlines at 8% white; glow only as `accent/20` blur behind one hero element, max |
| Motion personality | *cinematic-heavy*: `expo.out` 1.0 to 1.4s entrances, `quint-in-out` curtains; Lenis lerp **0.08**; scrub 1 to 1.5; departure scrubs and curtains are core, nothing bounces |
| Distinctive moves | ghost type at `text-ink/[0.05]`, scrubbed veils, tracked-uppercase label wayfinding, the footer-reveal ([composition.md](composition.md) §5) |

---

## Preset 3: Brutalist

Honest structure as decoration: paper white, solid 2px rules, electric accent, type as architecture. For experimental portfolios, fashion, events, dev-culture brands. This is the one deliberate heavy-display genre in the set.

```css
/* theme.css: BRUTALIST */
@theme {
  --color-surface-0: #EFEFEA;
  --color-surface-1: #FFFFFF;
  --color-surface-2: #E2E2DA;
  --color-surface-3: #111111;          /* inverted panels are a surface, not a "dark mode" */

  --color-ink: #111111;
  --color-ink-muted: #3D3D3D;
  --color-ink-faint: #8A8A85;
  --color-accent: #1400FF;             /* electric blue, used flat and loud */
  --color-line: #111111;               /* borders are INK: 1-2px solid, no alpha */

  --radius-base: 0px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
}
@theme inline {
  --font-display: var(--font-display-face), Impact, sans-serif;       /* Archivo Black */
  --font-body: var(--font-body-face), system-ui, sans-serif;          /* Archivo */
}
```

| Axis | Spec |
|---|---|
| Fonts | **Archivo Black** display (uppercase, `tracking-[-0.01em]`, sizes to 14vw, cropped off-canvas) + **Archivo** (text). Tables and specs use Archivo with `tabular-nums`, not a mono face |
| Spacing bias | compressed and gridded: sections 4-8rem, content pushed to edges, visible structure; whitespace appears as sudden full-viewport voids, not gentle padding |
| Border/shadow | `border-2 border-line` on everything that's a thing; tables with full gridlines; the one allowed shadow is the hard offset `shadow-[6px_6px_0_#111]`; cells invert to `surface-3` + white ink on hover |
| Motion personality | *kinetic-abrupt*: `power4.out` at 0.2 to 0.45s, stagger 0.04; instant hover inversions (`duration-100` or none); Lenis lerp **0.14 or omit Lenis entirely** (native scroll is on-genre); marquees and slot-machine text swaps ARE on-genre here |
| Distinctive moves | exposed grid lines, index/table layouts as hero content, oversized arrows `→`, counters (`01/12`), full-bleed type walls |

---

## Preset 4: Luxury Minimal

Almost nothing, perfectly placed: warm greige, hairline serif, bronze accent, slow air. For premium product, architecture, jewelry, hospitality.

```css
/* theme.css: LUXURY MINIMAL */
@theme {
  --color-surface-0: #F6F5F2;
  --color-surface-1: #EFEDE9;
  --color-surface-2: #E6E3DD;
  --color-surface-3: #DBD6CE;

  --color-ink: #191919;
  --color-ink-muted: #6E6A63;
  --color-ink-faint: #ACA69D;
  --color-accent: #8A7350;             /* bronze: borderline neutral; luxury whispers */
  --color-line: rgb(25 25 25 / 0.1);

  --radius-base: 0px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
}
@theme inline {
  --font-display: var(--font-display-face), Didot, Georgia, serif;    /* Cormorant Garamond 300-400 */
  --font-body: var(--font-body-face), system-ui, sans-serif;          /* Figtree */
}
```

| Axis | Spec |
|---|---|
| Fonts | **Cormorant Garamond** light display, weight 300-400 (large sizes only, because hairline serifs die small; `leading-[1.05]`, normal-case or generously tracked uppercase) + **Figtree** (text); labels 10-11px `tracking-[0.2em]` uppercase |
| Spacing bias | maximal: sections 16-24rem, one idea per viewport, measures ≤ `40ch`; the emptiness *is* the brand |
| Border/shadow | almost none: hairlines only at content boundaries (header rule, footer rule); imagery sits frameless on the surface; no cards, ever |
| Motion personality | *heavy-luxurious*: `expo.out` at 1.2 to 1.6s, stagger 0.12 to 0.15; Lenis lerp **0.06 to 0.07** (the syrup is on-brand here and nowhere else); window-parallax on every image at gentle ±6%; absolutely no springs, no marquees |
| Distinctive moves | single centered serif lines in vast space, image + one caption line per viewport, accent used only for ~2 words per page, slow crossfade galleries |

---

## Using and extending

1. **Swap = `theme.css` + font imports + 2 JS constants** (lerp, ease pair). If a vibe swap requires touching a component, that component broke the token contract. Fix the component.
2. **Deriving a new preset:** answer the seven axes in order: temperature (warm/cool/stark) → light or dark ladder (and its direction, per the surface-direction rule above) → display face genre (grotesk / serif / slab; mono *only* for a genuine dev-tool/terminal brand, otherwise banned per [anti-patterns.md](anti-patterns.md) §17), picked from the pairings in [typography.md](typography.md) → accent voltage (whisper like bronze ↔ scream like electric blue) → corner + border philosophy → spacing compression ↔ extravagance → motion weight (lerp + ease pair + duration tier from [feel-layer.md](feel-layer.md)). Seven decisions = a coherent vibe; skipping one is where incoherence enters.
   **Second accent:** allowed only as a deliberate genre choice (playful / consumer / kids brands where two voices are the brand). Declare it as `--color-accent-2` in the token layer, give each accent the same ≤1-per-viewport budget, and never let it appear because "the page needed more color." That's the same shape as the display-weight exception: genre choice, never reflex.
3. **Sanity rule:** any preset must still pass the baseline non-negotiables ([baseline-prompt.md](baseline-prompt.md)). Presets change the *answers*, never the *questions*.
