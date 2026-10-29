# Typography: the single biggest lever

Type is most of what a visitor sees on a marketing site, and most of what separates a custom build from a template. It is also free: no assets, no GPU, no scroll math. Spend the first hour of any build here. The baseline block in [../SKILL.md](../SKILL.md) states the non-negotiables; this file is the full craft behind them: why they hold, which faces to pick, the scale as tokens, how to load fonts without a shift, the choreography recipes that make type move well, and the tell list of what generated sites do by default.

Prerequisites: the GSAP registry, `useGSAP` rules and reduced-motion pattern from [setup.md](setup.md); the fluid root-rem knob from [scaling.md](scaling.md); the token contract from [vibe-presets.md](vibe-presets.md). The masked line reveal is already specified in [scroll-reveals.md](scroll-reveals.md) section 3. This file builds on it and never repeats it.

---

## 1. The principles, with the reasons

**Two faces, no more.** One display face and one text face. Every extra face adds a voice the page has to referee, and each voice dilutes the one that matters. Hierarchy comes from scale contrast (huge against small), not from changing fonts. A single family used at two optical cuts (display and text) counts as one face and is a valid, quiet choice.

**Display runs light and large.** Weight 300 to 400, sizes from 8vw up. Three reasons:

1. At 115px, a 300-weight stem is about 7px and a 700-weight stem is about 17px. Light type at that size shows its drawing: the curves, the counters, the air between letters. Heavy type at that size is a wall of ink that shouts instead of speaks.
2. Whitespace reads as confidence. A light 115px line surrounded by 12rem of nothing says the brand has nothing to prove. A bold line in the same space reads as a billboard.
3. It is the agency signal. Template sites default to `font-bold` on every heading because it is safe at 24px. Award sites go the other way and let scale do the emphasis.

The cost: light display needs a face that is drawn well at large sizes (optical-size axis, fine curves, even colour). Cormorant at 16px dies; at 120px it sings. Pick faces for their large-size behaviour, and set weight 300 only at 3rem and above.

**When heavy display is the right call.** Brutalist, poster, sports, events, streetwear, music: genres where the page is meant to shout. Then commit completely: weight 700 to 900, uppercase or tight mixed case, leading 0.85 to 0.92, sizes up to 14vw cropped off canvas. The failure is the half measure, a bold 600 display that is neither quiet nor loud. The vibe preset that owns this is Brutalist ([vibe-presets.md](vibe-presets.md)); heavy display is declared per preset, never a reflex.

**Hierarchy by contrast, not by steps.** Five type sizes between 1.25rem and 2.25rem make a page flat. The page needs a hero near 115px, a body near 19px, a small tier near 14px and a tracked eyebrow near 12px. The gaps between those four are the design.

---

## 2. A curated pairing library

Sixteen pairings, grouped by register. Everything here is on Google Fonts or Fontshare, so it is free to use and self-hostable. "Preset" is the vibe preset in [vibe-presets.md](vibe-presets.md) the pairing suits best. Weights are the weights the family ships; the display weight listed is the one to start from.

How to read the source column: **GF** is Google Fonts (load with `next/font/google`, section 4). **FS** is Fontshare (download the family, self-host the WOFF2 with `next/font/local`, section 4). Fontshare ships most families as a variable file; when a family only offers static cuts, self-host just the two or three weights you use.

### Editorial serif display

| Display (weight) | Text face | Source | Reads as | Preset |
|---|---|---|---|---|
| **Fraunces** 300 to 400, `opsz` axis on | Hanken Grotesk 400 | GF + GF | Bookish at text sizes, razor sharp at 100px+. Warm, literate, a little wry. | Warm Editorial |
| **Instrument Serif** 400 (only weight; italic exists) | Instrument Sans 400, 500 | GF + GF | Condensed, high-contrast, fashion-magazine. The single weight reads light because of its fine strokes. | Warm Editorial, Dark Cinematic |
| **Newsreader** 300 to 400 (`opsz` up to 72) | Schibsted Grotesk 400 | GF + GF | Newsroom authority without the stuffiness. Strong italic for pull quotes. | Warm Editorial |
| **Gambetta** 300 to 400 | General Sans 400 | FS + FS | Soft, inky serif with calligraphic warmth. Feels hand-set. | Warm Editorial |

Instrument Serif has exactly one weight (400). Never set `font-weight: 700` on it: the browser will synthesise a fake bold. Section 6 covers `font-synthesis: none`.

### Neo-grotesk minimal

| Display (weight) | Text face | Source | Reads as | Preset |
|---|---|---|---|---|
| **Switzer** 300 | Switzer 400 | FS | Swiss, neutral, quiet. One family does everything. | Luxury Minimal, Dark Cinematic |
| **Inter Tight** 300 | Albert Sans 400 | GF + GF | Tighter-spaced display cut of the grotesk everyone knows, paired with a less common text face so the page does not read as default. | Dark Cinematic |

### Luxury

| Display (weight) | Text face | Source | Reads as | Preset |
|---|---|---|---|---|
| **Cormorant Garamond** 300 (large sizes only) | Figtree 400 | GF + GF | Hairline Garamond, restrained. This is the Luxury Minimal preset's own pairing. | Luxury Minimal |
| **Bodoni Moda** 400 (`opsz` axis) | Jost 300, 400 | GF + GF | High-contrast fashion-house. Jost is a Futura-style geometric that takes tracked uppercase well. Display sizes only; the hairlines vanish below 40px. | Luxury Minimal |
| **Sentient** 300 | Satoshi 400 | FS + FS | Modern luxury. Warmer and less brittle than a Didone. | Luxury Minimal, Warm Editorial |

### Expressive and experimental

| Display (weight) | Text face | Source | Reads as | Preset |
|---|---|---|---|---|
| **Clash Display** 300 to 500 | Supreme 400 | FS + FS | Sharp, confident, slightly futurist. Light cuts keep it elegant. | Dark Cinematic |
| **Archivo Black** 400 (only weight) | Archivo 400 | GF + GF | Poster weight, uppercase, cropped off canvas. This is the Brutalist preset's own pairing. | Brutalist |
| **Unbounded** 300 | DM Sans 400 | GF + GF | Wide, rounded, forward-looking. The light weights keep the width from becoming a toy. | Dark Cinematic |

### Warm humanist

| Display (weight) | Text face | Source | Reads as | Preset |
|---|---|---|---|---|
| **Bricolage Grotesque** 300 (`opsz` axis at its high end) | DM Sans 400 | GF + GF | Quirky ink-trap grotesque with personality. Friendly without being childish. | Warm Editorial |
| **Erode** 300 | Satoshi 400 | FS + FS | Warm, slightly calligraphic serif for food, craft and community brands. | Warm Editorial |

### Technical but not mono

| Display (weight) | Text face | Source | Reads as | Preset |
|---|---|---|---|---|
| **Space Grotesk** 300 to 400 | IBM Plex Sans 400 | GF + GF | Engineered character in the letterforms (the `a`, the `G`) without ever using a monospace. The Dark Cinematic preset's display face. | Dark Cinematic |
| **Geist** 300 | Geist 400 | GF | Clean, systems-y, single family. Reads as developer-grade without a mono eyebrow. | Dark Cinematic |

### Commercial references and their free stand-ins

You will see these on award sites. Do not reach for them without a licence; use the stand-in.

| Commercial face | Free stand-in |
|---|---|
| Canela, PP Editorial New | Instrument Serif, Gambetta |
| PP Neue Montreal, Neue Haas Grotesk | Switzer, General Sans |
| Soehne | Hanken Grotesk, Inter Tight |
| GT Sectra | Fraunces |

### Three tests before committing to a pair

1. **Structure contrast.** Serif display with a grotesk text face, or a grotesk display with a clearly different grotesk. Two similar sans faces (two geometrics, two humanists) read as a mistake, not a pairing.
2. **The 96 and 16 test.** Set the headline at 96px and a paragraph at 16px on the real surface colour. If the headline is beautiful and the paragraph is tiring, the text face is wrong. Text faces earn their place at 16px, not at 96px.
3. **The squint test.** Blur your eyes. The headline should still be the first shape; the eyebrow should recede to a texture. If two tiers compete, the scale gap is too small, not the fonts.

---

## 3. The fluid scale as tokens

The scale sits on top of the root-rem knob ([scaling.md](scaling.md)). The knob already scales every rem by roughly 25 percent between a 390px phone (root about 15.1px) and a 1440px desktop (root 19px). So:

- **Small steps are plain rem.** They ride the knob alone, ratio 1.25.
- **Large steps carry their own clamp on top.** Their ratio opens from 1.25 at 390px to 1.333 at 1440px, because display type has to grow faster than UI text.
- **The hero leaves the scale on purpose.** `clamp(3rem, 8vw, 9rem)` is the baseline hero value. The scale exists so everything else has a defined relationship to it.

```css
/* app/globals.css: the knob first, then the type layer */
@import "tailwindcss";
@import "./theme.css";

html { font-size: clamp(0.9375rem, 0.836rem + 0.45vw, 1.1875rem); }
```

```css
/* app/theme.css (type layer). "static" because the role utilities below read these vars. */
@theme static {
  /* Small steps: ride the knob. Ratio 1.25. */
  --text-eyebrow: 0.75rem;                       --text-eyebrow--line-height: 1.2;
  --text-small:   0.875rem;                      --text-small--line-height: 1.55;
  --text-body:    1rem;                          --text-body--line-height: 1.65;
  --text-lead:    1.25rem;                       --text-lead--line-height: 1.5;

  /* Large steps: own clamp, ratio opens 1.25 (390px) to 1.333 (1440px). */
  --text-h4: clamp(1.56rem, 1.45rem + 0.43vw, 1.78rem);  --text-h4--line-height: 1.25;
  --text-h3: clamp(1.95rem, 1.74rem + 0.83vw, 2.37rem);  --text-h3--line-height: 1.15;
  --text-h2: clamp(2.44rem, 2.07rem + 1.43vw, 3.16rem);  --text-h2--line-height: 1.08;
  --text-h1: clamp(2.75rem, 2rem + 2.92vw, 4.21rem);     --text-h1--line-height: 1.02;

  /* The hero and the ghost line break the scale deliberately. */
  --text-display: clamp(3rem, 8vw, 9rem);                --text-display--line-height: 0.95;
  --text-ghost:   clamp(6rem, 22vw, 24rem);              --text-ghost--line-height: 0.85;

  /* Tracking tightens as size grows. Letter-spacing is relative, so it scales for free. */
  --tracking-eyebrow: 0.14em;
  --tracking-h4: -0.005em;  --tracking-h3: -0.01em;  --tracking-h2: -0.02em;
  --tracking-h1: -0.03em;   --tracking-display: -0.04em;
}

@theme inline {
  --font-display: var(--font-display-face), Georgia, serif;
  --font-body: var(--font-body-face), system-ui, sans-serif;
}

:root { --display-weight: 300; }
```

Role utilities bundle the five properties that must always travel together (size, leading, tracking, weight, wrap) so components never assemble them by hand:

```css
@utility type-display {
  font-family: var(--font-display);
  font-size: var(--text-display);
  line-height: var(--text-display--line-height);
  letter-spacing: var(--tracking-display);
  font-weight: var(--display-weight);
  text-wrap: balance;
  hyphens: manual;
}
@utility type-eyebrow {
  font-family: var(--font-body);
  font-size: var(--text-eyebrow);
  line-height: var(--text-eyebrow--line-height);
  letter-spacing: var(--tracking-eyebrow);
  font-weight: 500;
  text-transform: uppercase;
}
@utility type-body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  text-wrap: pretty;
  max-width: 62ch;
}
/* type-h1, type-h2, type-h3, type-h4, type-lead, type-small and type-ghost follow the same
   shape: their own size, leading and tracking tokens, weight 300 to 400 for headings,
   text-wrap: balance for headings and pretty for text. type-ghost sets only size and leading. */
```

### What each tier measures on screen

| Role | 390px | 1440px | Leading | Tracking, sans | Tracking, serif | Weight |
|---|---|---|---|---|---|---|
| display (hero) | 45px | 115px | 0.95 | -0.04em | -0.025em | 300 |
| h1 | 42px | 80px | 1.02 | -0.03em | -0.02em | 300 to 400 |
| h2 | 37px | 60px | 1.08 | -0.02em | -0.015em | 300 to 400 |
| h3 | 30px | 45px | 1.15 | -0.01em | -0.01em | 400 |
| h4 | 24px | 34px | 1.25 | -0.005em | 0 | 400 to 500 |
| lead | 19px | 24px | 1.5 | 0 | 0 | 400 |
| body | 15px | 19px | 1.65 | 0 | 0 | 400 |
| small | 13px | 17px | 1.55 | +0.005em | +0.005em | 400 |
| eyebrow | 11px | 14px | 1.2 | +0.14em | +0.14em | 500, uppercase |

Why each optical tweak exists:

- **Tracking tightens as size grows** because spacing designed for 16px reads loose at 115px; the eye perceives gaps in proportion to letter size. -0.04em at the hero is the grotesk figure. Serifs add their own horizontal rhythm and need about 40 percent less tightening, or the serifs touch.
- **Leading tightens as size grows** because the line gap the eye perceives is the white between lines, and it scales with size. Body at 1.65 needs the air to track across a 62ch line; a 3-line headline at 1.65 falls apart into separate lines. Below 0.95 descenders hit ascenders; keep the hero at 0.95 or higher unless you control the copy.
- **Uppercase display needs the opposite tweak.** Capitals have no descenders, so leading can drop to 0.88 to 0.92, and they want tracking from 0 to +0.02em rather than negative. Never apply the lowercase tracking number to a capitalised headline.
- **Small and eyebrow tiers loosen** because small type needs more room to stay legible, and tracked uppercase is how a 12px line earns its place as wayfinding (baseline: tracked uppercase 11 to 12px eyebrows instead of mid-size subheads).
- **Light and dark grounds shift optical weight.** Light-on-dark reads slightly heavier than dark-on-light. With a variable face, run `--display-weight` 20 to 40 units lighter on a dark preset (for example 340 on light, 310 on dark) and judge by eye. Never go below 300 and never fake it with opacity.

### Wrapping

- `text-wrap: balance` on every heading. It distributes words across lines so the last line is not a single orphan. Browsers cap it at a handful of lines (about 6 in Chromium), which is fine for headlines and wrong for paragraphs.
- `text-wrap: pretty` on body copy. It avoids short last lines in paragraphs. Treat both as progressive enhancement: older engines ignore them and fall back to normal wrapping.
- SplitText measures the balanced layout, so `balance` and the line masks agree.
- Cap headline width in characters, not pixels: `max-width: 16ch` to `20ch` for a hero, `62ch` for body (section 6).

---

## 4. Loading fonts: variable, preloaded, no shift

### Rules

1. **Variable files wherever the family offers one.** One file carries every weight (and `opsz`), so three static weights collapse into one request.
2. **`display: "swap"`.** Text paints in the fallback immediately; the real font swaps in. Flash of invisible text costs more than flash of fallback.
3. **Preload exactly two files:** display roman and body roman. Italics, extra weights and any third family load on demand (`preload: false`).
4. **Subset to `latin`.** That covers Dutch, German, French, Spanish and English: `ë ï ü ö ä ß é è` all live in Latin and Latin-1 Supplement. Add `latin-ext` only for Polish, Czech, Turkish and similar.
5. **Let `adjustFontFallback` do the metric matching.** `next/font` generates a fallback face with `size-adjust`, `ascent-override` and `descent-override` so the swap is near-zero layout shift. This matters twice here: layout shift, and SplitText line breaks (below).

### Google fonts

```tsx
// app/fonts.ts
import { Fraunces, Hanken_Grotesk } from "next/font/google";

export const display = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],                   // optical size: bookish at text sizes, razor at hero sizes
  variable: "--font-display-face",
  display: "swap",                  // adjustFontFallback defaults to true for Google fonts
});

export const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});
```

Fraunces also has `SOFT` and `WONK` axes. Check the specimen at your display size and pin them with `font-variation-settings` if the default letterforms are not what you want.

A single-weight family needs the weight stated: `Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], ... })`. Request `italic` only if the design uses it; each style is a separate file.

### Fontshare fonts (self-hosted)

Fontshare fonts are not on `next/font/google`. Download the family from its Fontshare page, take the WOFF2 files from the web kit (the variable file if one is offered), commit them into your project, and load them with `next/font/local`. Read the licence text on the family page once; it covers commercial use and self-hosting.

```tsx
// app/fonts.ts (continued)
import localFont from "next/font/local";

export const displayLocal = localFont({
  src: [{ path: "../fonts/Gambetta-Variable.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-display-face",
  display: "swap",
  adjustFontFallback: "Times New Roman",   // pick the closest system face: "Arial" for sans, "Times New Roman" for serif
  fallback: ["Georgia", "serif"],
});
```

If the family only offers static cuts, list each weight you use as its own `src` entry (`{ path, weight: "300", style: "normal" }`, and so on). Do not ship weights the design never uses.

### Wire it into the layout

```tsx
// app/layout.tsx
import { display, body } from "./fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* No-JS safety for the hero guard in section 5 */}
        <noscript><style>{`[data-split-hero]{visibility:visible!important}`}</style></noscript>
      </head>
      <body className="bg-surface-0 font-body text-ink antialiased">{children}</body>
    </html>
  );
}
```

`lang` is not decoration. It drives hyphenation, quote marks and font fallback selection. Set it per document, and per element when copy switches language (section 6).

### Fonts and SplitText

SplitText measures lines. A font swap changes line breaks. The interplay:

- **Use `autoSplit: true` and put the animation in `onSplit`.** SplitText re-splits when `document.fonts.ready` resolves and when the container width changes, so the lines always match the final font. Returning the animation from `onSplit` lets SplitText revert it before the re-split and carry progress over to the new one. This is the 3.13 API; never use the old `new SplitText()` plus manual resize listeners.
- **`adjustFontFallback` makes the re-split nearly invisible.** With matched fallback metrics, pre-swap line breaks are within a word or two of the final ones. Without it, the first split can be wildly wrong and the user sees lines rise twice.
- **Hide the hero until it has split.** The unsplit headline painting for a frame and then snapping to its start pose is a visible flash (section 5, recipe 1).
- **Only these SplitText options appear in this skill:** `type`, `linesClass`, `mask`, `autoSplit`, `onSplit`, `aria`. They are the stable surface. `aria` defaults to `"auto"`: the element gets an `aria-label` with its full text and the fragments are hidden from assistive tech. Because `aria-label` flattens inline markup, do not split a heading that contains links or meaningful nested elements; split the plain-text headings.
- **Chars drop kerning.** Each character becomes its own inline-block, so kerning pairs between letters stop applying (`To`, `AV`, `Ty` visibly open up at 8rem). Use chars only on short display words, and revert after the animation when you can (recipe 2).

---

## 5. Typographic choreography recipes

All of these assume the registry from [setup.md](setup.md) (`import { gsap, useGSAP, SplitText } from "@/lib/gsap"`), a `"use client"` leaf, a scope ref, and a `gsap.matchMedia()` guard. In each, the animation is created only inside the `no-preference` branch, so reduced-motion users get the final state from the server markup with zero JS.

### Recipe 1. Masked line rise for the hero

The hero version of the line reveal in [scroll-reveals.md](scroll-reveals.md) section 3: it fires on load instead of on scroll, and it must not flash.

```css
/* globals.css: hide only while motion is on and the split has not happened yet */
@media (prefers-reduced-motion: no-preference) {
  [data-split-hero]:not([data-ready]) { visibility: hidden; }
}
.split-line { padding-bottom: 0.08em; }  /* gives descenders room inside the mask */
```

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function HeroHeadline({ children }: { children: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const h1 = root.current!.querySelector<HTMLElement>("[data-split-hero]")!;
        SplitText.create(h1, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit(self) {
            h1.dataset.ready = "1";                    // reveals the wrapper, lines are now in their start pose
            return gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.11,
            });
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <h1 data-split-hero className="type-display">{children}</h1>
    </div>
  );
}
```

- Start this when the loader's exit begins, not at mount; the choreography belongs in [page-entrances.md](page-entrances.md).
- Hero leading is 0.95, which clips long descenders inside the mask. The `padding-bottom: 0.08em` on the line fixes that; if the rhythm shifts, nudge the leading to 1.0 on the split headline only.
- This is the one place where CSS hides content until JS runs (the baseline rule in [setup.md](setup.md) is to avoid that). The justification: an unsplit headline flashing before its start pose is worse. The guard only applies under `no-preference` and the `noscript` rule in section 4 covers JS failure.
- **When not to:** every section headline. Use the plain scroll-triggered version from scroll-reveals for those; the hero earns the loud one.

### Recipe 2. Character stagger for a short display word

For one word of 3 to 12 characters: a section title, a number, a brand name. Never a sentence.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function CharWord({ word }: { word: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current!.querySelector<HTMLElement>("[data-word]")!;
        const split = SplitText.create(el, { type: "lines,chars", mask: "lines" });
        gsap.from(split.chars, {
          yPercent: 110,
          duration: 1,
          ease: "expo.out",
          stagger: { each: 0.035, from: "start" },
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
          onComplete: () => split.revert(),            // restores kerning and ligatures
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <p data-word className="type-display">{word}</p>
    </div>
  );
}
```

- `onComplete: () => split.revert()` puts the original text node back, so kerning pairs return the moment the animation ends. There is no `autoSplit` here on purpose: a single short word on one line does not need re-splitting on resize, and reverting an auto-splitting instance is not something to rely on.
- Try `from: "center"` for a symmetric word, `from: "end"` for a right-aligned one. Avoid `from: "random"` on anything a client will read twice.
- **When not to:** body text, headlines longer than a few words (it becomes a typewriter toy), or more than one char-split element per viewport.

### Recipe 3. Scrub-tied oversized headline

A giant word that drifts and scales with scroll position. It is texture, not content: the real h2 sits below it.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function ScrubHeadline({ children }: { children: string }) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-big]",
          { xPercent: 6, scale: 0.9, transformOrigin: "0% 50%" },
          {
            xPercent: -6,
            scale: 1.08,
            ease: "none",                              // scrubbed motion is linear; the scrub supplies the feel
            scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
      });
    },
    { scope: section }
  );

  return (
    <section ref={section} className="relative overflow-hidden py-[16rem]">
      <p data-big aria-hidden className="type-ghost whitespace-nowrap text-ink/[0.06]">{children}</p>
    </section>
  );
}
```

- Use `xPercent` and `scale`, both compositor-only. Animating `letter-spacing` or a variable font's `wght` axis would track the scroll too, but every frame triggers layout. If you must (one short headline), budget it as the single filter-class cost in the viewport.
- `scrub: 1` follows the position with a one-second ease behind the scroll; `scrub: true` is a mechanical 1:1. Feel values are in [feel-layer.md](feel-layer.md).
- Decorative duplicate, so `aria-hidden`.
- **When not to:** more than one per page, or on the headline that carries the section's actual message. Scrubbed type is hard to read mid-move.

### Recipe 4. Word-by-word colour fill (manifesto paragraph)

The paragraph "reads itself" as the user scrolls: words go from faint to full ink in sequence.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function Manifesto({ children }: { children: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(root.current!.querySelector("[data-fill]"), {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 40%", scrub: 0.6 },
              }
            ),
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <p data-fill className="max-w-[34ch] font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-light leading-[1.25]">{children}</p>
    </div>
  );
}
```

- Opacity on `text-ink` is the compositor-cheap way to do a colour fill, and it stays inside the token palette. The start state (0.16) fails contrast on purpose; it exists only while motion is on and resolves with scroll. Never park the user in it: the fill must complete before the section scrolls away (or pin it, see [pinning-scrub.md](pinning-scrub.md)).
- Split into `words`, not chars: 60 to 90 words is fine, 400 is not.
- Reduced motion: no tween is created, so the paragraph is simply fully inked.
- **When not to:** more than one manifesto per site, or any text people need to skim (pricing, terms).

### Recipe 5. Ghost marquee tied to scroll

Oversized, near-invisible type drifting sideways with scroll. The scrub-drift mechanic is specified in [depth-parallax.md](depth-parallax.md) section 4; this is the typographic setup.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function GhostMarquee({ text }: { text: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-marquee]", {
          xPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden className="overflow-hidden">
      <p data-marquee className="type-ghost whitespace-nowrap text-ink/[0.05]">
        {`${text} ${text} ${text}`}
      </p>
    </div>
  );
}
```

- Repeat the phrase three times so the visible window never runs out of type at the end of the drift.
- Ghost opacity stays 0.04 to 0.06. Higher, and it competes with real content; lower, and it is invisible on cheap screens.
- **When not to:** light surfaces where the ghost reads as a dirty smudge (raise opacity or skip); pages that already have a marquee. A looping CSS marquee is only for genuinely continuous content such as a logo wall.

### Recipe 6. Text-swap hover on a link

The slot-machine label from [micro-interactions.md](micro-interactions.md) section 3c, upgraded to per-character stagger. Worth it on exactly one element (the main CTA or the logo).

```css
.swap { position: relative; display: inline-flex; overflow: hidden; }
.swap [data-b] { position: absolute; inset: 0; visibility: hidden; }
```

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function SwapLink({ href, label }: { href: string; label: string }) {
  const root = useRef<HTMLAnchorElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
        const a = root.current!.querySelector<HTMLElement>("[data-a]")!;
        const b = root.current!.querySelector<HTMLElement>("[data-b]")!;
        const sa = SplitText.create(a, { type: "chars" });
        const sb = SplitText.create(b, { type: "chars" });
        tl.current = gsap
          .timeline({ paused: true, defaults: { duration: 0.5, ease: "expo.out" } })
          .set(b, { autoAlpha: 1 }, 0)
          .to(sa.chars, { yPercent: -110, stagger: 0.015 }, 0)
          .fromTo(sb.chars, { yPercent: 110 }, { yPercent: 0, stagger: 0.015 }, 0);
        return () => { tl.current = null; };
      });
    },
    { scope: root }
  );

  return (
    <a
      ref={root}
      href={href}
      className="swap type-small"
      onPointerEnter={() => tl.current?.play()}
      onPointerLeave={() => tl.current?.reverse()}
      onFocus={() => tl.current?.play()}
      onBlur={() => tl.current?.reverse()}
    >
      <span data-a>{label}</span>
      <span data-b aria-hidden>{label}</span>
    </a>
  );
}
```

- The timeline only exists on hover-capable devices with motion allowed; everywhere else the handlers are no-ops and the link is a plain link with a visible label.
- The second copy is `aria-hidden` and `visibility: hidden` until the timeline starts, so no one ever sees both labels overlap.
- Handlers call `play()` and `reverse()` on a timeline made inside `useGSAP`, so they create no new animations and need no `contextSafe` wrapper.
- **When not to:** every nav link. Pick one. If every label rolls, nothing is special.

---

## 6. Details that sell it

These cost nothing and are the difference between "looks designed" and "looks set in type."

**Line length.** Body 55 to 75 characters per line: `max-width: 62ch` is the default. Longer and the eye loses its return; shorter and the rhythm breaks. `ch` is relative to the font's zero width, so it scales with the knob and with the face you picked.

**Real quotes and apostrophes.** Straight `"` and `'` are keyboard artefacts. Use curly characters in copy (`’` for apostrophes, `“ ”` for English quotes) or let CSS choose by language:

```css
q { quotes: "“" "”" "‘" "’"; }
:lang(de) q { quotes: "„" "“" "‚" "‘"; }
```

**Hanging punctuation.** Opening quotes and bullets sit outside the text edge so the left margin of the text stays clean. `hanging-punctuation: first` works only in Safari; elsewhere fake it on pull quotes with a negative `text-indent` of about 0.4em on the first line (tune per face).

**Tabular numerals for stats.** Counters and tables need digits of equal width so a number does not wobble while it counts. The right tool is a font feature, not a monospace face (mono is banned for stats in the baseline):

```css
.stat { font-variant-numeric: lining-nums tabular-nums; }
```

Check the face's specimen for tabular figures first. If a display face lacks them, set the stats in the text face.

**Ligatures and kerning.** Leave `font-variant-ligatures` and `font-kerning` at their defaults. Never turn on discretionary ligatures site-wide. Remember that SplitText chars disable both (section 4).

**`::selection`.** Part of the token contract ([vibe-presets.md](vibe-presets.md)): `::selection { background: var(--color-accent); color: var(--color-surface-0); }`. Selected text is the one place users stare at your type, and the default blue is a free "we did not finish this" signal.

**Stop faux bold.** `font-synthesis: none` on `body`. A single-weight face (Instrument Serif, Archivo Black) asked for 700 will otherwise be smeared into a fake bold.

**Dutch and German long words.** Compound words (`Gegevensbeschermingsverordening`, `Duurzaamheidsrapportage`) overflow narrow columns. Set the document language and let the browser hyphenate body copy, never headlines:

```css
:lang(nl) .prose, :lang(de) .prose { hyphens: auto; hyphenate-limit-chars: 7 3 3; } /* limit is progressive enhancement */
h1, h2, h3, [data-split-hero] { hyphens: manual; overflow-wrap: break-word; }
```

In a headline, place a soft hyphen by hand in the one long word (`Duurzaam&shy;heid`). Never put `&shy;` in a word you split into chars; the soft hyphen becomes its own character. Hyphenation dictionaries differ by browser and device, so check a real phone, and check the hero at 390px with the longest real word the copy contains.

**An italic accent word.** Setting one word of a headline in the display face's italic is the cheapest high-end move there is. Wrap it in `<em>`; SplitText keeps nested elements intact.

**Eyebrow copy is wayfinding.** Short, tracked, uppercase, one per section ([anti-patterns.md](anti-patterns.md) covers the numbered-sections tell). Source copy stays in sentence case; CSS uppercases it.

---

## 7. Typography tell list

What generated sites do by default, and what replaces it. Sweep before shipping, alongside [anti-patterns.md](anti-patterns.md).

| Tell | Why it reads as generated | Replace with |
|---|---|---|
| Inter on every surface, display included | The default of every starter template | A pairing from section 2; Inter Tight only as a display cut with a different text face |
| `font-bold` or 700 on every heading | Safe at 24px, loud at 115px | Weight 300 to 400, hierarchy by size |
| Five medium sizes (`text-lg` to `text-4xl`) at similar weights | Flat page, no focal point | Four tiers with big gaps: hero, body, small, eyebrow |
| Monospace eyebrows, labels, stats or badges | Dev-tool filler masquerading as "technical" | Tracked uppercase in the text face; tabular numerals |
| Everything centred | No axis, no reading line | Left-aligned text on a strong edge; centre only single short lines |
| Gradient text (`bg-clip-text`) | The 2021 SaaS tell, and it fails contrast | Solid ink; the accent on one word at most |
| Uniform `tracking-tight` on all sizes | Not optical, just a utility class | Tracking by size (section 3 table) |
| Faux bold or italic from a missing cut | Smeared strokes | `font-synthesis: none`; load the real italic or avoid it |
| Straight quotes, double hyphens, `...` | Keyboard text, not typeset text | Curly quotes, a real ellipsis character, no hyphen standing in for punctuation |
| Orphans and one-word last lines | No `text-wrap` | `balance` for headings, `pretty` for body |
| Body below 1rem, muted text below 0.875rem | Fails the floor in the baseline | Body 1rem to 1.125rem; muted at least 0.875rem; contrast at least 4.5:1 |
| Mismatched line height (1.65 on headlines, 1.2 on paragraphs) | Leading was never designed | Leading tightens as size grows (section 3 table) |

---

## 8. 30 second type audit

1. Two faces at most? Display weight 300 to 400 unless the preset is deliberately heavy?
2. Hero at `clamp(3rem, 8vw, 9rem)` with tracking and leading from the table, not the browser defaults?
3. Only four visible tiers (hero, body, small, eyebrow) plus the occasional h2?
4. Body at least 1rem, line length 55 to 75ch, `text-wrap: pretty`?
5. Fonts loaded through `next/font`, two preloaded files, fallback metrics adjusted, zero visible shift on reload?
6. Hero headline hidden until split, no flash, `lang` set, longest real word checked at 390px?
7. Stats in tabular numerals, quotes curly, `::selection` set, `font-synthesis: none`?
8. Reduced motion: type is fully visible and static with no JS running?
