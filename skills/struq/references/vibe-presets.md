# Aesthetic Architecture: Tokens & Vibe Presets

The skeleton (composition, motion techniques, type *scale*) stays constant; the vibe lives entirely in a token layer. Components only ever reference **semantic** utilities (`bg-surface-1`, `text-ink-muted`, `ease-out-expo`, `font-display`), never raw colors, faces, or curves, so swapping one CSS block + the font imports re-skins the whole build.

**Typography is the most important lever in this skill.** The face pairing decides more of a vibe than the palette does. Every preset below names its pairing (one display face and one text face, or one family in both roles), all free Google Fonts drawn from the **Struq Signature** set in [typography.md](typography.md) §3.1, and the display face runs **light (300 to 400)**. None of them uses Inter, Space Grotesk or another starter default; when a brand has no fonts of its own, swap within Signature, never back to a default. For pairing alternatives, the fluid scale, tracking and leading per tier, and SplitText typography, see [typography.md](typography.md).

## The token contract

Every preset defines exactly this surface area. Components may use nothing outside it (plus neutral utilities like grid/flex/spacing):

| Token | Role |
|---|---|
| `--color-surface-0…3` | the elevation ladder; 0 = page, each step = one layer closer |
| `--color-ink / -muted` | the two text steps: ink for everything that must be read, muted for eyebrows, meta, captions. No gray-400/500/600 improvisation |
| `--color-ink-faint` | **never text.** Hairline emphasis, disabled states, placeholder rules, inactive dots. As text it fails contrast |
| (inverted surfaces) | On an `ink` panel (the menu, an inverted footer) the ladder flips: `surface-0` is the text, `surface-2` the muted tier (eyebrows, meta), `surface-3` hairlines only. `ink-muted` on `ink` fails contrast. Check surface-2 on ink at 4.5:1 per preset; no new tokens needed |
| `--color-accent` | the one accent |
| `--color-line` | hairline borders/dividers (a low-alpha ink, not a gray) |
| `--font-display / --font-body` | the pairing (one display + one text face, max; one family may fill both) |
| `--font-h3 / --font-eyebrow / --font-ui / --font-stat` | role faces, mapped in `@theme inline` per the pairing's row in [typography.md](typography.md) §3.1 (defaults = S1) |
| `--font-mono` | **optional, code only**: literal snippets, `code`, terminal output. Not a preset face. Never for eyebrows, labels, stats, or body (that's the terminal-aesthetic tell, see [anti-patterns.md](anti-patterns.md) §17) |
| `--radius-base` | corner philosophy in one number |
| `--ease-out-expo / --ease-out-quart / --ease-in-out-quint` | the motion vocabulary ([transitions.md](transitions.md)) |

Plus two values that live in JS (per-preset constants, since Lenis/GSAP don't read CSS): **Lenis lerp** and the **GSAP ease pair** ([feel-layer.md](feel-layer.md)). The Lenis default is **0.1**; a preset moves it only for a reason it can name (Luxury's syrup, Dark Cinematic's weight), and every preset states its value.

**Surface direction (light vs dark: decide it, don't improvise it):** dark ladders step **lighter** per layer (closer = brighter; Dark Cinematic is the reference). Light ladders pick one of two directions and hold it: the page is the lightest layer and panels step subtly **deeper** (Soft Modern's mineral greys, Warm Editorial's cream → `#DFD3BF`, Luxury Minimal's greige), or the page is toned and panels **lift to white** (the Brutalist appendix's `#FFFFFF` surface-1 on `#EFEFEA`). Either way, separation in light mode leans harder on `--color-line` hairlines (a low-alpha *ink*, never gray-200) because light tone steps are subtler than dark ones, and shadows stay banned as an elevation system in both modes.

**Typography lock (applies across all presets):** hero/display weight runs **light (300 to 400)** unless a declared genre calls for heavy (the Brutalist appendix is the one intentional exception); body ≥1rem, nothing below 12px; and every preset's `ink-muted` must clear **WCAG AA (≥4.5:1)** on every surface it is used on. Where it does not (noted per preset), muted text stays off that surface. `ink-faint` is never text. Presets choose the *faces and weights*; the floor and contrast rules sit on top, non-negotiable. ([anti-patterns.md](anti-patterns.md) §12)

**Heroes do not converge.** Each preset names its hero entrance. Two Struq sites with different presets must not open the same way; the masked line rise is a technique, not a default ([typography.md](typography.md) §5).

## Wiring (Tailwind `@theme` + next/font)

```css
/* app/globals.css */
@import "tailwindcss";
@import "./theme.css";   /* ← the preset. Swap this file to change vibe. */

::selection { background: var(--color-accent); color: var(--color-surface-0); }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }
```

```tsx
// app/fonts.ts: Soft Modern (Signature S1, the token defaults). Same code as typography.md §4.
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-body-face", display: "swap" });
export const display = urbanist; // one family, both roles
export const body = urbanist;

// Other presets REPLACE the block above (display var --font-display-face, body var --font-body-face):
// Warm Editorial: Fraunces({ axes: ["opsz", "SOFT"], ... }) + Urbanist({ ... })                     (S2)
// Dark Cinematic: Newsreader({ axes: ["opsz"], ... }) + Manrope({ ... })                            (S5)
// Luxury Minimal: Cormorant_Garamond({ weight: ["300", "400"], ... }) + Jost({ ... }),
//                 plus Cormorant_Garamond({ weight: "300", style: "italic", preload: false, ... })  (S4)
// Brutalist appendix: Archivo_Black({ weight: "400", ... }) + Archivo({ ... })

// app/layout.tsx
// <html className={body.variable}>   (two-face presets: `${display.variable} ${body.variable}`)
//   <body className="bg-surface-0 font-body text-ink antialiased">
```

The theme maps semantic tokens onto those vars with `@theme inline` (required when a token references another variable). Utilities generated automatically: `bg-surface-2`, `text-ink-muted`, `border-line`, `font-display`, `font-ui`, `rounded-base`, `ease-out-expo`.

---

## Preset 1: Soft Modern

Calm, cool and exact: mineral greys, one family, a deep green accent. For product studios, SaaS that wants to look considered, architecture and wellness brands that should feel quiet rather than warm. The token defaults in [typography.md](typography.md) §2.4 are this preset's type.

```css
/* theme.css: SOFT MODERN */
@theme {
  --color-surface-0: #F3F4F1;
  --color-surface-1: #ECEEEA;
  --color-surface-2: #E3E6E1;
  --color-surface-3: #D8DCD5;

  --color-ink: #15171A;
  --color-ink-muted: #5C6168;
  --color-ink-faint: #9AA0A6;          /* non-text only: hairlines, disabled, placeholder rules */
  --color-accent: #1F5A4A;             /* deep mineral green */
  --color-line: rgb(21 23 26 / 0.1);

  --radius-base: 6px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
}
@theme inline {
  --font-display: var(--font-body-face), system-ui, sans-serif;  /* Urbanist */
  --font-body: var(--font-body-face), system-ui, sans-serif;     /* Urbanist */
  /* role faces: the S1 defaults from typography.md §2.4, nothing to override */
}
```

| Axis | Spec |
|---|---|
| Fonts | **Urbanist** in both roles, Signature S1: display 300, text 400 at 1.0625rem, eyebrows 500 at 0.12em. Accent word by weight (300 to 500) or the accent colour, never italic. Role values in [typography.md](typography.md) §3.1 |
| Spacing bias | even and generous: sections 8-12rem, lead 44ch, body 62ch, grids with real gutters |
| Border/shadow | hairlines at 10% ink, 6px radius on media and inputs; no shadows |
| Motion personality | *soft-precise*: `expo.out` 0.9 to 1.2s entrances, stagger 0.08; Lenis lerp **0.1**; scrub 1 |
| Hero entrance | **weight-in** ([typography.md](typography.md) §5): the h1's weight rises from 100 to 300 with a short lift, once |
| Signature move | weight-in |
| Contrast note | `ink-muted` on `surface-3` is 4.49:1, a hair under AA: keep muted text off surface-3 |
| Distinctive moves | index lists with the 300 to 450 weight hover, one accent-green word per section at most, quiet image frames at the 6px radius |

---

## Preset 2: Warm Editorial

Magazine confidence: cream paper, warm ink, a serif with personality. For studios, writing-led brands, agencies, food/culture.

```css
/* theme.css: WARM EDITORIAL */
@theme {
  --color-surface-0: #FAF6F0;
  --color-surface-1: #F3EDE2;
  --color-surface-2: #EAE1D2;
  --color-surface-3: #DFD3BF;

  --color-ink: #1E1A16;
  --color-ink-muted: #5E554C;          /* clears 4.5:1 on every surface, surface-3 included */
  --color-ink-faint: #A59C8F;          /* non-text only */
  --color-accent: #7A2230;             /* oxblood: links, one numeral, selection */
  --color-line: rgb(30 26 22 / 0.14);

  --radius-base: 2px;                  /* near-sharp; print doesn't round corners */

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
}
@theme inline {
  --font-display: var(--font-display-face), Georgia, serif;   /* Fraunces */
  --font-body: var(--font-body-face), system-ui, sans-serif;  /* Urbanist */
}
```

| Axis | Spec |
|---|---|
| Fonts | **Fraunces** (display, `opsz` axis: bookish at h3 size, razor at the hero; `SOFT` around 50 for warmth) + **Urbanist** (text, 400 at 1.0625rem). Signature S2. Display weight 300-400, not bold: the serif's shapes do the work. Accent word in Fraunces italic. Role values in [typography.md](typography.md) §3.1 |
| Spacing bias | generous but bounded: sections 8-14rem; text measure lead 44ch, body 62ch; dense hairline-divided lists ([anti-patterns.md](anti-patterns.md) §2 layout is native here) |
| Border/shadow | hairlines everywhere, zero shadows; `divide-y divide-line` is the signature texture |
| Motion personality | *editorial-calm*: `power3.out` entrances 0.7 to 0.9s, stagger 0.1; Lenis lerp **0.1**; scrub 1; no springs anywhere. **Declared deviation:** the baseline entrance ease is `expo.out`; this preset swaps it for the gentler `power3.out` inside the reveal band. A site on this preset records it in STRUQ.md under `Motion: deviations: entrances power3.out 0.7 to 0.9s (Warm Editorial's editorial-calm)` ([direction.md](direction.md) §4) |
| Hero entrance | **soft-scrub plus line rise**: the h1 rises line by line on load, then softens (`SOFT` 0 to 100) as the reader scrolls away ([typography.md](typography.md) §5). The rise is allowed here because the scrub is the signature: the rise delivers it, it is not the hero's only gesture. The h1 rests at `SOFT 0`; other display lines pin 50 |
| Signature move | soft-scrub |
| Distinctive moves | drop caps, a single oversized serif numeral in accent (as a one-off flourish, never a per-section counter), italic opsz pull-quotes at `wide` bleed with oldstyle figures, image frames with 2px radius |

The oxblood is chosen against the cream-plus-terracotta reflex ([typography.md](typography.md) §7): if a brand genuinely owns a terracotta, use it, but never as the default warm accent.

---

## Preset 3: Dark Cinematic

Film-title gravity: a warm near-black tonal ladder, soft light, one signal accent. For creative tech, film/music, launches, portfolio showpieces.

```css
/* theme.css: DARK CINEMATIC */
@theme {
  --color-surface-0: #0C0B0A;
  --color-surface-1: #131210;
  --color-surface-2: #1B1A17;
  --color-surface-3: #252320;

  --color-ink: #EFEBE4;
  --color-ink-muted: #A39D94;
  --color-ink-faint: #5E5A54;          /* non-text only */
  --color-accent: #FF5C28;             /* signal orange: sparingly, it burns */
  --color-line: rgb(239 235 228 / 0.08);

  --radius-base: 4px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
}
@theme inline {
  --font-display: var(--font-display-face), Georgia, serif;          /* Newsreader */
  --font-body: var(--font-body-face), system-ui, sans-serif;          /* Manrope */
}
```

| Axis | Spec |
|---|---|
| Fonts | **Newsreader** display (`opsz` automatic, 300 at display and h2, its larger display clamp; tracking `-0.02em`, leading 0.94) + **Manrope** (text, 400 at 1rem). Signature S5. Accent word in Newsreader italic. Meta/labels are **tracked uppercase Manrope** (0.14em) in `ink-muted`, not mono: the cinematic register comes from scale, darkness, and spacing, never a terminal font (mono is code-only, see [anti-patterns.md](anti-patterns.md) §17) |
| Spacing bias | extreme: heroes 16-20rem, full-viewport breathers with a single line of type; darkness needs emptiness to read as cinema |
| Border/shadow | tonal ladder does *all* elevation (this is the preset the surface system was born for); hairlines at 8% warm white; glow only as `accent/20` blur behind one hero element, max |
| Motion personality | *cinematic-heavy*: `expo.out` 1.0 to 1.4s entrances, `quint-in-out` curtains; Lenis lerp **0.08**; scrub 1 to 1.5; departure scrubs and curtains are core, nothing bounces |
| Hero entrance | **image-to-type match cut**: the hero opens on a full-bleed image for about a second, then cuts on a shared shape (a horizon, an edge, a bright band) to the h1 sitting exactly where that shape was. A hard cut or a 0.3s crossfade, never a slow dissolve; the type itself does not rise. Recipe: `match-cut-hero` in [page-entrances.md](page-entrances.md) |
| Signature move | type-mask-media or a cropped display |
| Distinctive moves | ghost type at `text-ink/[0.05]` in muted solid (never outlined), scrubbed veils, tracked-uppercase label wayfinding, the footer-reveal ([composition.md](composition.md) §5) |

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
  --color-ink-faint: #ACA69D;          /* non-text only */
  --color-accent: #76603F;             /* bronze: borderline neutral; luxury whispers */
  --color-line: rgb(25 25 25 / 0.1);

  --radius-base: 0px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
}
@theme inline {
  --font-display: var(--font-display-face), Didot, Georgia, serif;    /* Cormorant Garamond 300-400 */
  --font-body: var(--font-body-face), system-ui, sans-serif;          /* Jost */
}
```

| Axis | Spec |
|---|---|
| Fonts | **Cormorant Garamond** light display, weight 300-400, at its larger display clamp with leading 0.92 (large sizes only, because hairline serifs die small); its italic 300 is loaded as the accent word + **Jost** (text, 400 at 1.0625rem, leading 1.7; Signature S4); labels at the 12px floor, Jost 500 uppercase at 0.18em. Cormorant never sets running text below 1.125rem |
| Spacing bias | maximal: sections 16-24rem, one idea per viewport, measures ≤ `40ch`; the emptiness *is* the brand |
| Border/shadow | almost none: hairlines only at content boundaries (header rule, footer rule); imagery sits frameless on the surface; no cards, ever |
| Motion personality | *heavy-luxurious*: `expo.out` at 1.2 to 1.6s, stagger 0.12 to 0.15; Lenis lerp **0.06 to 0.07** (the syrup is on-brand here and nowhere else); window-parallax on every image at gentle ±6%; absolutely no springs, no marquees |
| Hero entrance | **1.6s single-line clip**: one line of display type, revealed by a single slow `clip-path` wipe, no split, no stagger. Recipe: `clip-line-hero` in [page-entrances.md](page-entrances.md) |
| Signature move | a cropped display or fit-width-wordmark |
| Contrast note | `ink-muted` on `surface-3` is 3.7:1: muted text never sits on surface-3 |
| Distinctive moves | single centered serif lines in vast space, image + one caption line per viewport, accent used only for ~2 words per page, slow crossfade galleries |

---

## Using and extending

1. **Swap = `theme.css` + font imports + 2 JS constants** (lerp, ease pair). If a vibe swap requires touching a component, that component broke the token contract. Fix the component.
2. **Deriving a new preset:** answer the seven axes in order: temperature (warm/cool/stark) → light or dark ladder (and its direction, per the surface-direction rule above) → display face genre (grotesk / serif / slab; mono *only* for a genuine dev-tool/terminal brand, otherwise banned per [anti-patterns.md](anti-patterns.md) §17), picked from the Signature set in [typography.md](typography.md) §3.1 first, Extended only when Signature has no match → accent voltage (whisper like bronze ↔ scream like electric blue) → corner + border philosophy → spacing compression ↔ extravagance → motion weight (lerp + ease pair + duration tier from [feel-layer.md](feel-layer.md)). Then name the hero entrance and the signature move, different from the presets above. Seven decisions = a coherent vibe; skipping one is where incoherence enters.
   **Second accent:** allowed only as a deliberate genre choice (playful / consumer / kids brands where two voices are the brand). Declare it as `--color-accent-2` in the token layer, give each accent the same ≤1-per-viewport budget, and never let it appear because "the page needed more color." That's the same shape as the display-weight exception: genre choice, never reflex.
3. **Sanity rule:** any preset must still pass the baseline non-negotiables ([baseline-prompt.md](baseline-prompt.md)). Presets change the *answers*, never the *questions*.

---

## Genre appendix: Brutalist

Not a default and not offered unless the brief declares the genre. Honest structure as decoration: paper white, solid 2px rules, electric accent, type as architecture. For experimental portfolios, fashion, events, dev-culture brands. This is the one deliberate heavy-display genre in the skill.

```css
/* theme.css: BRUTALIST (genre appendix) */
@theme {
  --color-surface-0: #EFEFEA;
  --color-surface-1: #FFFFFF;
  --color-surface-2: #E2E2DA;
  --color-surface-3: #111111;          /* inverted panels are a surface, not a "dark mode" */

  --color-ink: #111111;
  --color-ink-muted: #3D3D3D;
  --color-ink-faint: #8A8A85;          /* non-text only */
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
| Fonts | **Archivo Black** display (uppercase, `tracking-[-0.01em]`, sizes to 14vw, cropped off-canvas) + **Archivo** (text); the genre exception in [typography.md](typography.md) §3.3. Tables and specs use Archivo with `tabular-nums`, not a mono face |
| Spacing bias | compressed and gridded: sections 4-8rem, content pushed to edges, visible structure; whitespace appears as sudden full-viewport voids, not gentle padding |
| Border/shadow | `border-2 border-line` on everything that's a thing; tables with full gridlines; the one allowed shadow is the hard offset `shadow-[6px_6px_0_#111]`; cells invert to `surface-3` + white ink on hover |
| Motion personality | *kinetic-abrupt*: `power4.out` at 0.2 to 0.45s, stagger 0.04; instant hover inversions (`duration-100` or none); Lenis lerp **0.14 or omit Lenis entirely** (native scroll is on-genre); marquees and slot-machine text swaps ARE on-genre here |
| Hero entrance | **hard cut**: the type wall is there at first paint; no reveal at all is the on-genre entrance |
| Distinctive moves | exposed grid lines, index/table layouts as hero content, oversized arrows `→`, counters (`01/12`), full-bleed type walls |
