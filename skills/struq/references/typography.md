# Typography: the single biggest lever

Type is most of what a visitor sees on a marketing site, and it decides in the first second whether the page reads as designed or generated. It costs no assets, no GPU and no scroll math, so spend the first hour of every build here. The baseline in [../SKILL.md](../SKILL.md) states the non-negotiables; this file is the system behind them.

Treat type as a **system, not a font choice**: a fixed set of roles, one scale, a weight budget and per-size optics. Picking two nice faces and then improvising sizes per section is how good fonts end up looking like a template.

Prerequisites: the GSAP registry, `useGSAP` rules and reduced-motion pattern from [setup.md](setup.md); the root-rem knob from [scaling.md](scaling.md); the token contract from [vibe-presets.md](vibe-presets.md). The masked line reveal is specified in [scroll-reveals.md](scroll-reveals.md) §3. This file builds on it and does not repeat it.

## Decide here

During planning ([direction.md](direction.md) §4) read only this section; the rest of the file is for the build. Three decisions go into STRUQ.md SYSTEM:

1. **The pairing, by temperament.** Read the brief's temperament word and take the Signature row that names it (§3.1). Extended (§3.2) only when no Signature temperament fits, or to keep two sites in one niche apart. "Unsure" is not a temperament; Inter and the other off-list faces (§3.4) are never the answer.

   | Temperament | Signature | Preset it anchors |
   |---|---|---|
   | Modern, open, calm (a declared one-family system) | S1 Urbanist + Urbanist | Soft Modern |
   | Warm, literate, editorial | S2 Fraunces + Urbanist | Warm Editorial |
   | Soft, friendly, optimistic | S3 Fraunces (SOFT 100) + Outfit | light brands of any preset |
   | Quiet luxury | S4 Cormorant Garamond + Jost | Luxury Minimal |
   | Cinematic, dark, literate | S5 Newsreader + Manrope | Dark Cinematic |
   | Essay-led, sans headlines over book text | S6 Urbanist + Lora | Warm Editorial, Luxury Minimal |
   | Product, precise, technical | S7 Sora + Instrument Sans | Dark Cinematic, Soft Modern |

   **Extended by the same word.** When the brief's temperament matches an Extended row word for word (a potter is "warm, crafted, hand-set", E1), take that row; sourcing cost alone is not a reason to fall back. If the face cannot be fetched in this run (Fontshare is a manual download), set the nearest Signature row, and record the Extended swap under ASSUMPTIONS so it lands when the files arrive.

   **A brand that owns one face** keeps it in the role the matching S row gives that face, and takes the row's partner for the other role (a brand set in Sora takes S7: Sora display, Instrument Sans text), unless the brand already sets its body copy in its own face too; then it is a declared one-family system. Log the partner under ASSUMPTIONS.

2. **The roles are fixed; the pairing only overrides values.** Every string is one of the roles in §2.1, each with its own token: `font-display text-display` (hero), `font-display text-statement` (the Orient line or manifesto), `font-display text-h2`, `type-h3 text-h3`, `text-lead`, `text-body`, `text-small`, `eyebrow text-eyebrow text-ink-muted`, `font-ui text-ui`, `stat text-stat`. The pairing's row writes its weights, tracking, leading, role faces and display clamp into `@theme`; components never change.

3. **One signature move** (§5): `weight-in`, `soft-scrub`, `type-mask-media`, `fit-width-wordmark` or a cropped display. Record it next to the pairing id, with the preset's hero entrance ([vibe-presets.md](vibe-presets.md)).

---

## 1. Principles, with the reasons

**Two faces, no more.** One display face, one text face. Each extra face is another voice the page has to referee. A single family used for both roles counts as one face and is a valid, quiet choice.

**Display runs large and light (300 to 400).** At 115px a light stem is about 7px wide and a bold stem about 17px. Light type at that size shows its drawing: curves, counters, the air between letters. Bold type at that size is a slab of ink. Template sites put `font-bold` on every heading because it is safe at 24px; award sites let scale carry the emphasis and keep the weight down. That inversion is the agency signal.

The cost: light display needs a face drawn for large sizes. Hairline serifs die at 16px and sing at 120px. Choose faces for their behaviour at hero size and use weight 300 only from 3rem up.

**Heavy display only as a declared genre.** Brutalist, poster, sport, streetwear: pages meant to shout. Then commit fully (700 to 900 or a single-weight black face, leading 0.85 to 0.92, up to 14vw cropped off canvas). The failure is the half measure, a 600 display that is neither quiet nor loud. In [vibe-presets.md](vibe-presets.md) only the Brutalist genre appendix declares it.

**Hierarchy by contrast, not steps.** Five sizes between 1.25rem and 2.25rem make a flat page. A few tiers with big gaps make a designed one. The gaps are the design.

---

## 2. The system: roles, weights, optics

### 2.1 The roles

Every piece of text on the page is one of these. If a string fits none, the design is improvising.

| Role | Token | 390px to 1440px | Face token | Use it for | Never |
|---|---|---|---|---|---|
| **Display** | `text-display` | 46 to 120px | `font-display` | The hero h1 and at most one other display line per page (the footer ask) | Section titles; anything over 3 lines |
| **Statement** | `text-statement` | 28 to 52px | `font-display` | The Orient beat's one sentence and the `manifesto-fill` paragraph: larger than lead, not a heading | Section titles; more than one per page outside the manifesto |
| **h2** | `text-h2` | 36 to 58px | `font-display` | Section openers, one per section | Two per viewport |
| **h3** | `text-h3` | 24 to 33px | `type-h3` (`--font-h3`) | Item titles in lists, cards, case rows | As a subhead under an h2 (use lead) |
| **Lead** | `text-lead` | 20 to 22px | `font-body` | The one paragraph under a hero or h2 | More than one paragraph in a row |
| **Body** | `text-body` | 16 to 18.7px | `font-body` | Running copy | Below 1rem; wider than 75ch |
| **Small** | `text-small` | 14 to 15.4px | `font-body` | Captions, meta, footnotes, legal | Body-length copy; below 0.875rem |
| **Eyebrow** | `text-eyebrow` | 12 to 13.2px | `eyebrow` (`--font-eyebrow`), uppercase | Section wayfinding labels, one per section | Numbered `01 / 02` stamps; mono |
| **UI** | `text-ui` | 15 to 16.5px | `font-ui` (`--font-ui`) | Buttons, nav links, form labels, tabs | Sentence-length strings |
| **Numerals** | `text-stat` | 48 to 82px | `stat` (`--font-stat`), `tabular-nums` | Stats, counters, prices | Monospace |

Sizes are read at the knob's two ends: the root is 16px at 390px and about 17.6px at 1440px, and freezes at 18px from about 1640px ([scaling.md](scaling.md)). Body spans 1rem to 1.0625rem depending on the text face (§3.1).

**The root and the scale.** The skill's root is `html { font-size: clamp(1rem, 0.92rem + 0.2vw, 1.125rem); }`. On it sits a 1.333 scale with skipped steps, so every tier is a real jump: body 1, lead 1.25, h3 about 1.78, h2 about 3.16, display 7 to 8. Every `clamp()` in this file keeps a `rem` term in its middle argument, so browser zoom and the user's font-size preference still scale it; a bare `vw` middle ignores both.

### 2.2 Weight rules

- **Display, h2, h3: 300 to 400.** Lighter on dark grounds (light on dark reads heavier by irradiation; run a variable face 20 to 40 units lighter, for example 340 on light and 310 on dark). Never below 300, never faked with opacity.
- **Text roles: 400.** Body, lead, small at 400. The text face at 300 is too pale for 4.5:1 on toned surfaces.
- **Emphasis is 500, not 700.** UI labels, eyebrows, an inline `<strong>`: 500. A 700 inside light typography is a hole in the page.
- **At most three weights per family loaded**, typically 300, 400 and 500. With a variable file it is one request, but the rule still holds for what the CSS uses: a fourth weight is a fourth voice.
- **`font-synthesis: none` on `body`**, so a single-weight face (Instrument Serif, Archivo Black) is never smeared into a fake bold.

### 2.3 Optics per size

- **Tracking tightens as size grows.** Spacing drawn for 16px reads loose at 115px. Grotesks take about -0.04em at display size, -0.02em at h2, 0 at body. Serifs and wide geometrics carry their own horizontal rhythm and want 40 to 60% less, or letters touch.
- **Leading tightens as size grows.** The eye reads the white between lines, which scales with size. Body wants 1.6 to 1.7 to track a 62ch line back; a three-line headline at 1.65 falls apart. Below 0.95, descenders hit ascenders.
- **Uppercase flips both.** Capitals have no descenders, so leading can drop to 0.88, and tracking wants 0 to +0.02em on display and +0.12 to +0.2em at eyebrow size, never a negative value.
- **Small tiers loosen.** +0.005em on small, +0.01em on UI. Tracked uppercase is how a 12px line earns its place.
- **Measure.** Body 55 to 75 characters (`max-w-[62ch]`), lead 40 to 50ch, hero 14 to 18ch, h2 18 to 22ch. Cap widths in `ch`, never in px: `ch` follows the face and the knob.

### 2.4 The tokens

Tailwind (v4 or later, for `@theme`) lets a `--text-*` token carry its line height, tracking and weight, so `text-h2` applies all four and components never assemble them by hand. Roles that can change face per pairing (h3, eyebrow, UI, numerals) also get a **role font token**, so a pairing swap never touches a component. These defaults equal the S1 row in §3.1 exactly (Urbanist in both roles); every other pairing's row lists the values to override in the preset's `@theme`, including its four role faces.

```css
/* app/theme.css: type layer, next to the preset's colour tokens. Defaults = S1. */
@theme {
  --text-eyebrow: 0.75rem;   --text-eyebrow--line-height: 1.2;  --text-eyebrow--letter-spacing: 0.12em;  --text-eyebrow--font-weight: 500;
  --text-small: 0.875rem;    --text-small--line-height: 1.55;   --text-small--letter-spacing: 0.01em;
  --text-ui: 0.9375rem;      --text-ui--line-height: 1;         --text-ui--letter-spacing: 0.02em;       --text-ui--font-weight: 500;
  --text-body: 1.0625rem;    --text-body--line-height: 1.65;
  --text-lead: 1.25rem;      --text-lead--line-height: 1.5;

  --text-h3: clamp(1.5rem, 1.34rem + 0.65vw, 1.875rem);  --text-h3--line-height: 1.2;   --text-h3--letter-spacing: -0.01em;  --text-h3--font-weight: 400;
  --text-h2: clamp(2.25rem, 1.8rem + 1.82vw, 3.3rem);    --text-h2--line-height: 1.06;  --text-h2--letter-spacing: -0.02em;  --text-h2--font-weight: 300;
  --text-statement: clamp(1.75rem, 1.2rem + 2.2vw, 3.25rem); --text-statement--line-height: 1.2; --text-statement--letter-spacing: -0.015em; --text-statement--font-weight: 300;
  --text-stat: clamp(3rem, 2.2rem + 3vw, 5rem);          --text-stat--line-height: 1;    --text-stat--letter-spacing: -0.03em; --text-stat--font-weight: 300;

  /* The top of the scale, and ghost texture type. Both keep a rem term in the middle (zoom). */
  --text-display: clamp(2.875rem, 1.2rem + 6.86vw, 8rem);  --text-display--line-height: 0.98;  --text-display--letter-spacing: -0.03em;  --text-display--font-weight: 300;
  --text-ghost: clamp(6rem, 2rem + 20vw, 24rem);           --text-ghost--line-height: 0.85;
}

/* Role faces. --font-display and --font-body come from the preset; these default to S1. */
@theme inline {
  --font-h3: var(--font-display);
  --font-eyebrow: var(--font-body);
  --font-ui: var(--font-body);
  --font-stat: var(--font-display);
}

@utility eyebrow { text-transform: uppercase; font-family: var(--font-eyebrow); font-feature-settings: "case"; }
@utility stat { font-family: var(--font-stat); font-variant-numeric: lining-nums tabular-nums; }
@utility type-h3 { font-family: var(--font-h3); }

body { font-synthesis: none; }
h1, h2, h3 { text-wrap: balance; }
p, li, blockquote { text-wrap: pretty; }
```

`text-statement` takes the pairing's h2 weight and tracking unless its row says otherwise; it is the only role a manifesto paragraph or an Orient sentence ever needs, so neither recipe carries an arbitrary `text-[clamp(...)]`.

Usage: `<h1 class="font-display text-display max-w-[16ch]">`, `<p class="font-display text-statement max-w-[30ch]">`, `<h3 class="type-h3 text-h3">`, `<p class="text-body max-w-[62ch]">`, `<span class="eyebrow text-eyebrow text-ink-muted">`, `<button class="font-ui text-ui">`, `<span class="stat text-stat">`. The scale has no h1 token on purpose: the page's h1 is the display role. `"case"` shifts punctuation and dashes up to cap height, which uppercase eyebrows need. Eyebrows and meta take `text-ink-muted`; `ink-faint` is never text ([vibe-presets.md](vibe-presets.md)).

**Wrapping.** `balance` evens headline lines so the last is not an orphan; engines cap it at a handful of lines, which suits headings only. `pretty` avoids one-word last lines in paragraphs. Both are progressive enhancement. SplitText measures the balanced layout, so balance and line masks agree.

---

## 3. The pairing library

A short, curated set, not a catalogue. The Struq taste profile: **open, geometric, soft-modern sans** (clean round forms, generous apertures, elegant at light weights) set against **refined serifs** (high-contrast or warm). Not neutral grotesks, not quirky display gimmicks.

**How to choose.** Pick by brand temperament: warm and literate, soft and friendly, quiet luxury, cinematic, product and precise. Take the **Signature** pairing that matches. Use **Extended** only when the brief names a temperament Signature does not cover, or when two Struq sites in the same niche would otherwise share a face. **Unsure is not a temperament.** Pick from the brief's temperament word. S1 only when the brief declares a one-family system. Two Struq sites in the same niche never share a display face. **Never fall back to Inter or another default** (§3.4); "unsure" is exactly when a default sneaks in. The presets in [vibe-presets.md](vibe-presets.md) are built from Signature, and the type step of [brief-router.md](brief-router.md) defers to this section: Signature first, always.

**Reading the role rows.** Size tokens are fixed by the system (§2.4): display `text-display`, h2 `text-h2`, h3 `text-h3`, eyebrow `text-eyebrow`, body `text-body`, small `text-small`, UI `text-ui`, numerals `text-stat`. Each row gives `weight / tracking (em) / leading` per role; those are the overrides you write into the preset's `@theme`. Display and h2 use the display face, body and small the text face. h3, eyebrow, UI and numerals take whatever face the pairing's role font tokens name (the third table): write those four `--font-*` values into the preset's `@theme inline`, plus the display clamp and body size where the row differs from the standard. **GF** is Google Fonts (`next/font/google`); **FS** is Fontshare (self-host with `next/font/local`, §4). Every weight listed ships in the family.

### 3.1 Struq Signature (the default set)

| # | Pairing | Source | Temperament | Why it is not generic | Preset |
|---|---|---|---|---|---|
| S1 | **Urbanist** + **Urbanist** | GF | Modern, open, calm | A geometric with round, open forms that stays elegant at 300; one family, one file, a page that feels drawn rather than defaulted | Soft Modern (its pairing); only when the brief declares a one-family system |
| S2 | **Fraunces** (`opsz`, `SOFT`) + **Urbanist** | GF | Warm, literate, editorial | A soft-serif display with optical sizing over a round geometric: warmth and precision in one line, unlike the usual serif-plus-grotesk | Warm Editorial (its pairing) |
| S3 | **Fraunces** (`SOFT` 100, `opsz` auto) + **Outfit** | GF | Soft, friendly, optimistic | Fraunces at full softness reads round and kind without a novelty rounded face, and Outfit's clean geometry keeps the text crisp | Light brands of any preset |
| S4 | **Cormorant Garamond** + **Jost** | GF | Quiet luxury | Hairline Garamond at size, over a Futura-lineage geometric that takes wide-tracked caps and stays legible on toned paper | Luxury Minimal (its pairing) |
| S5 | **Newsreader** (`opsz`) + **Manrope** | GF | Cinematic, dark, literate | An optical-size news serif that turns razor-fine at hero size on black, over an engineered text sans: film-title gravity with a reading voice | Dark Cinematic (its pairing) |
| S6 | **Urbanist** + **Lora** | GF | Essay-led editorial sans | The reversed pair: light geometric headlines over a warm book serif for long reading. Editorial without any serif headline | Warm Editorial, Luxury Minimal |
| S7 | **Sora** + **Instrument Sans** | GF | Product, precise, technical | A wide geometric display over a compact, slightly condensed grotesk: technical by letterform, never by monospace | Dark Cinematic, Soft Modern |

| # | Display | h2 | h3 | Eyebrow | Body | Small | UI | Numerals |
|---|---|---|---|---|---|---|---|---|
| S1 | 300 / -0.03 / 0.98 | 300 / -0.02 / 1.06 | 400 / -0.01 / 1.2 | 500 / 0.12 / 1.2 | 400 / 0 / 1.65 | 400 / 0.01 / 1.55 | 500 / 0.02 / 1 | Urbanist 300, tabular |
| S2 | 300 / -0.025 / 0.95 | 300 / -0.015 / 1.06 | 400 / -0.005 / 1.2 | 500 / 0.12 / 1.2 | 400 / 0 / 1.65 | 400 / 0.01 / 1.55 | 500 / 0.02 / 1 | Fraunces 300, -0.02 |
| S3 | 400 / -0.02 / 0.96 | 300 / -0.012 / 1.06 | 400 / -0.005 / 1.2 | 500 / 0.12 / 1.2 | 400 / 0 / 1.65 | 400 / 0.01 / 1.55 | 500 / 0.02 / 1 | Outfit 400, tabular |
| S4 | 300 / -0.01 / 0.92 | 300 / -0.005 / 1.04 | 400 / 0 / 1.2 | 500 / 0.18 / 1.2 | 400 / 0 / 1.7 | 400 / 0.01 / 1.55 | 500 / 0.06 / 1 | Jost 400, tabular |
| S5 | 300 / -0.02 / 0.94 | 300 / -0.012 / 1.04 | 400 / -0.005 / 1.15 | 500 / 0.14 / 1.2 | 400 / 0 / 1.6 | 400 / 0.005 / 1.5 | 500 / 0.01 / 1 | Manrope 400, tabular |
| S6 | 300 / -0.03 / 0.98 | 300 / -0.02 / 1.06 | 400 / -0.01 / 1.2 | 500 / 0.12 / 1.2 | Lora 400 / 0 / 1.7 | Urbanist 400 / 0.01 / 1.5 | 500 / 0.02 / 1 | Urbanist 300, tabular |
| S7 | 300 / -0.025 / 1.0 | 300 / -0.015 / 1.08 | 400 / -0.01 / 1.2 | 500 / 0.12 / 1.2 | 400 / 0 / 1.6 | 400 / 0.005 / 1.5 | 500 / 0.01 / 1 | Sora 300, tabular |

Per-pairing columns: the role faces (write them into `@theme inline`), the display size, the body size and the accent move. "Standard" display is the §2.4 token. `display` and `body` here mean `var(--font-display)` and `var(--font-body)`.

| # | `--font-h3` | `--font-eyebrow` | `--font-ui` | `--font-stat` | `--text-display` | `--text-body` | Accent move |
|---|---|---|---|---|---|---|---|
| S1 | display | body | body | display | standard | 1.0625rem | Weight shift 300 to 500 on one word, or the accent colour |
| S2 | display | body | body | display | standard | 1.0625rem | One word in Fraunces italic |
| S3 | display | body | body | body | standard | 1.0625rem | One word in Fraunces italic (SOFT 100 keeps it round) |
| S4 | display | body | body | body | `clamp(3.25rem, 1.4rem + 7.8vw, 9rem)` | 1.0625rem | One word in Cormorant italic 300; the italic is loaded (§4) |
| S5 | display | body | body | body | `clamp(3.25rem, 1.4rem + 7.8vw, 9rem)` | 1rem | One word in Newsreader italic |
| S6 | display | display | display | display | standard | 1.0625rem (Lora) | Weight shift 300 to 500 on one word, or the accent colour |
| S7 | display | body | body | display | `clamp(2.5rem, 1rem + 6vw, 7rem)`, hero `max-w-[18ch]` | 1rem | Weight shift 300 to 500 on one word, or the accent colour |

The display clamps compensate for x-height and width: Cormorant and Newsreader have small x-heights and read a size smaller than a geometric at the same `font-size`, so they set larger; Sora runs wide and sets smaller with a wider measure. **A face with no italic (Sora, Comfortaa, Archivo Black) never gets an `<em>` accent.** Urbanist does ship an italic, but a slanted geometric reads as a style toggle, not a voice, so S1, S6 and S7 move weight or colour instead.

Honest notes, per face:

- **Urbanist** (100 to 900) is geometric and wide-set, so it wants less negative tracking than a neo-grotesk and slightly looser leading; its round `o` and `e` collide first. At 400 it is a genuine text face, set at 1.0625rem because its x-height is modest. Eyebrows at 0.12em.
- **Fraunces**: use the axes on purpose. `opsz` follows size automatically through `next/font`, so the hero gets the sharp cut and the h3 the sturdier one. `SOFT` (0 to 100) rounds the terminals: around 50 suits warm brands (S2), 100 is the soft and friendly voice of S3, 0 keeps it crisp. Pin it with `font-variation-settings: "SOFT" 50` (or 100) on the display roles only, and load the axis (§4). Write the pin inside `@layer base` (`@layer base { .font-display, .type-h3, .stat { font-variation-settings: "SOFT" 50; } }`): an unlayered rule after `@import "tailwindcss"` beats every utility, including the start value of `soft-scrub`. On a `soft-scrub` site the hero h1 rests at `SOFT 0` (the scrub's start); every other display line pins 50. Leaving `opsz` out of `font-variation-settings` keeps optical sizing automatic.
- **Cormorant Garamond** needs size. Display and h2 only, at its own larger clamp and leading 0.92; if it ever sets running text (a pull quote, a lead), never below 1.125rem. Hairlines vanish on cheap screens below that. Its h3 can move to Jost 500 in dense lists. Load the italic: it is the accent.
- **Newsreader** (200 to 800, `opsz` 6 to 72) is S5's display face. Leave `opsz` automatic so the hero gets the fine display cut and h3 the sturdier text cut; run it 300 on dark grounds. Like Cormorant it sets a size larger than a geometric.
- **Sora** (100 to 800) runs wide. It takes less negative tracking than its weight suggests (-0.025em at display, -0.015em at h2) because tight tracking on a wide face clots the counters; carry the width with a smaller clamp and a hero `max-w-[18ch]`, or headlines break into single words.
- **Manrope** (200 to 800): 200 is too thin for anything but one giant word. As text at 400 it holds up down to 0.875rem; body at 1rem, eyebrows at 0.14em.
- **Lora** (400 to 700) is a text serif: body and lead only, never display. Body 1.0625rem at leading 1.7, because serif text on screen wants more air than sans.
- **Outfit** (100 to 900) is a clean geometric; body at 1.0625rem, eyebrows at 0.12em. On dark grounds keep body and small at 400, not 300.
- **Jost** (100 to 900) is a Futura-lineage geometric. Body 1.0625rem at 1.7 under Cormorant; its caps want the widest eyebrow tracking in the set (0.18em) and UI at 0.06em.
- **Instrument Sans** (400 to 700, `wdth` axis) is compact and even: body 1rem at 1.6, eyebrows at 0.12em. Keep `wdth` at 100; condensing it under a wide Sora display tips the contrast into a mismatch.

**House pairing: Comfortaa + Urbanist.** This is Struq's own brand pairing, not a default for other brands, and it is not in the Signature set. Comfortaa sets the wordmark and the h1 only; h2 and everything below runs in Urbanist 300 and up. Comfortaa is a rounded display face that charms at 40px and up and tires in a paragraph, so it never sets h3, body, small or UI.

### 3.2 Extended (distinctive alternatives, same spirit)

Less-seen faces for when Signature does not fit, or to keep two sites in the same niche apart. Mostly Fontshare: free, self-hosted, and rarely seen on generated sites.

| # | Pairing | Source | Temperament | Why it is not generic | Preset |
|---|---|---|---|---|---|
| E1 | **Gambetta** + **Albert Sans** | FS + GF | Warm, crafted, hand-set | A soft, inky serif with calligraphic warmth over a clean, slightly warm geometric grotesk | Warm Editorial |
| E2 | **Zodiak** + **General Sans** | FS | Confident editorial | A high-contrast serif with sharp wedges, set light, over a clean sans with open apertures | Warm Editorial, Dark Cinematic |
| E3 | **Sentient** + **General Sans** | FS | Modern luxury | Warmer and less brittle than a Didone; reads expensive at 300 without hairline fragility | Luxury Minimal |
| E4 | **Boska** + **Albert Sans** | FS + GF | Fashion, editorial | Sharp, high-contrast display serif whose light weights stay graceful at 120px | Luxury Minimal, Dark Cinematic |
| E5 | **Bodoni Moda** (`opsz`) + **Albert Sans** | GF | Fashion house | A Didone with optical sizing over a quiet grotesk that lets the hairlines carry the voice | Luxury Minimal |
| E6 | **Instrument Serif** (400 only) + **Outfit** | GF | Film title, poster | A condensed high-contrast serif against a soft geometric: poster gravity without a heavy weight. Never with the italic accent word inside a sans headline (the 2025 to 2026 template tell) | Dark Cinematic |

| # | Display | h2 | h3 | Eyebrow | Body | Small | UI | Numerals |
|---|---|---|---|---|---|---|---|---|
| E1 | 300 / -0.02 / 0.96 | 300 / -0.01 / 1.06 | 400 / 0 / 1.2 | 500 / 0.14 / 1.2 | 400 / 0 / 1.65 | 400 / 0.005 / 1.55 | 500 / 0.01 / 1 | Albert Sans 400, tabular |
| E2 | 300 / -0.02 / 0.95 | 300 / -0.015 / 1.05 | 400 / -0.005 / 1.2 | 500 / 0.14 / 1.2 | 400 / 0 / 1.65 | 400 / 0.005 / 1.55 | 500 / 0.01 / 1 | General Sans 400, tabular |
| E3 | 300 / -0.02 / 0.98 | 300 / -0.01 / 1.06 | 400 / 0 / 1.2 | 500 / 0.18 / 1.2 | 400 / 0 / 1.7 | 400 / 0.005 / 1.55 | 500 / 0.02 / 1 | Sentient 300, -0.01 |
| E4 | 300 / -0.02 / 0.96 | 300 / -0.01 / 1.04 | 400 / 0 / 1.2 | 500 / 0.16 / 1.2 | 400 / 0 / 1.65 | 400 / 0.005 / 1.55 | 500 / 0.02 / 1 | Albert Sans 400, tabular |
| E5 | 400 / -0.015 / 1.0 | 400 / -0.01 / 1.08 | 400 / 0 / 1.2 | 500 / 0.16 / 1.2 | 400 / 0 / 1.7 | 400 / 0.01 / 1.55 | 500 / 0.04 / 1 | Albert Sans 400, tabular |
| E6 | 400 / -0.01 / 0.92 | 400 / -0.005 / 1.02 | 400 / 0 / 1.15 | 500 / 0.12 / 1.2 | 400 / 0 / 1.65 | 400 / 0.005 / 1.5 | 500 / 0.01 / 1 | Outfit 400, tabular |

Role faces for Extended: `--font-h3` is the display face; eyebrow, UI and numerals use the text face, except E3, whose numerals use Sentient. Every Extended row takes the standard display clamp and a 1rem body (1.0625rem for Outfit in E6). Bodoni Moda starts at 400, which reads light because of its hairlines; hairlines vanish under 40px, so h3 can move to Albert Sans 500. **Instrument Serif** has one weight, 400, plus an italic: set every display-role weight to 400, never ask it for 700, and keep its italic inside its own serif headlines.

### 3.3 Genre exception: heavy display

Outside the profile on purpose, for the one preset that shouts. **Archivo Black** (400 only, a black weight) + **Archivo** (GF) for Brutalist: display `400 caps / -0.01 / 0.88`, h2 `400 caps / 0 / 0.92`, h3 Archivo `500 / -0.01 / 1.15`, eyebrow `500 / 0.08 / 1.2`, body `400 / 0 / 1.55`, small `400 / 0 / 1.45`, UI `500 caps / 0.04 / 1`, numerals Archivo 500 tabular. Use it only when the brief declares the genre.

### 3.4 Off the list, on purpose

**Inter, Roboto, Open Sans, Poppins, Montserrat and Lato** are the defaults of starters, UI kits and generators; on a marketing page they read as "nobody chose this". **Space Grotesk and Geist** are good faces that became the reflex for anything "technical" or anything scaffolded by a Next.js starter, so they carry the same signal. Use one only when the brand already owns it. None appears in a preset, and none is ever the fallback when a choice feels hard.

**Commercial faces seen on award sites.** Use them only with a licence; otherwise take the free stand-in.

| Commercial | Free stand-in |
|---|---|
| Canela | Newsreader, Gambetta |
| PP Editorial New | Instrument Serif (E6), Gambetta |
| PP Neue Montreal, Neue Haas Grotesk | General Sans |
| Söhne | General Sans, Manrope |
| GT Sectra | Fraunces, Zodiak |

### 3.5 Three tests before committing

1. **Structure contrast.** Serif against geometric, or one family in two roles. Two similar sans faces from different families read as a mistake. (S7 passes because Sora's width against Instrument Sans's compact text is the contrast.)
2. **96 and 16.** Set the headline at 96px and a paragraph at 16px on the real surface. If the paragraph tires you, the text face is wrong.
3. **Squint.** Blur your eyes. The headline is the first shape; the eyebrow recedes to texture. If two tiers compete, the gap is too small, not the fonts.

---

## 4. Loading: variable, preloaded, no shift

1. **Variable files wherever the family has one.** One request carries every weight and the `opsz` axis.
2. **`display: "swap"`.** Fallback text paints immediately; invisible text costs more than a swap.
3. **Preload two files: display roman and body roman.** Italics and anything else get `preload: false`.
4. **Subset `latin`.** It covers English, Dutch, German, French and Spanish (`ë ï ü ö ä ß é`). Add `latin-ext` only for Polish, Czech, Turkish and similar.
5. **`adjustFontFallback`** generates a metric-matched fallback (`size-adjust`, ascent and descent overrides), so the swap shifts almost nothing. That matters twice: CLS, and SplitText line breaks.

```tsx
// app/fonts.ts: ONE pairing. Default: S1, Urbanist in both roles (Soft Modern).
import { Urbanist } from "next/font/google";

// One variable file carries every weight; both role variables point at it.
const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-body-face", display: "swap" });
export const display = urbanist; // adjustFontFallback defaults to true for Google fonts
export const body = urbanist;

/* Another pairing REPLACES the block above; never load two pairings.

// S2 (Warm Editorial): a variable display with axes, plus its italic as its own call.
// import { Fraunces, Urbanist } from "next/font/google";
// export const display = Fraunces({
//   subsets: ["latin"], axes: ["opsz", "SOFT"], variable: "--font-display-face", display: "swap",
// });
// export const displayItalic = Fraunces({
//   subsets: ["latin"], style: "italic", axes: ["opsz", "SOFT"],
//   variable: "--font-display-italic-face", display: "swap", preload: false, // the accent word, not LCP
// });
// export const body = Urbanist({ subsets: ["latin"], variable: "--font-body-face", display: "swap" });

// S4 (Luxury Minimal): a static family states its weights.
// import { Cormorant_Garamond, Jost } from "next/font/google";
// export const display = Cormorant_Garamond({ weight: ["300", "400"], subsets: ["latin"], variable: "--font-display-face", display: "swap" });
// export const displayItalic = Cormorant_Garamond({ weight: "300", style: "italic", subsets: ["latin"], variable: "--font-display-italic-face", display: "swap", preload: false });
// export const body = Jost({ subsets: ["latin"], variable: "--font-body-face", display: "swap" });

// Fontshare (Extended): download the family, commit the web-kit WOFF2 (the variable file when offered).
// import localFont from "next/font/local";
// export const display = localFont({
//   src: [{ path: "../fonts/Gambetta-Variable.woff2", weight: "300 700", style: "normal" }],
//   variable: "--font-display-face", display: "swap",
//   adjustFontFallback: "Times New Roman", // "Arial" for a sans, "Times New Roman" for a serif
//   fallback: ["Georgia", "serif"],
// });
*/
```

```css
/* S1 theme: one family fills both role tokens */
@theme inline {
  --font-display: var(--font-body-face), system-ui, sans-serif;
  --font-body: var(--font-body-face), system-ui, sans-serif;
}
/* Pairings with a separate italic call: the accent word picks it up */
:where(h1, h2, .font-display) em { font-family: var(--font-display-italic-face), var(--font-display); font-style: italic; }
```

Wire the variables onto `<html>` exactly as in [vibe-presets.md](vibe-presets.md): `${body.variable}` for S1, `${display.variable} ${body.variable}` (plus `${displayItalic.variable}`) for a two-face pairing. The italic gets its own call with `preload: false`, so the roman display and body stay the only two preloaded files; one call with `style: ["normal", "italic"]` also works and is simpler, but preloads the italic too. If a Fontshare family ships only static cuts, list each weight you use (three at most) as its own `src` entry. Read the licence on the family page once; Fontshare's free licence covers commercial use. Fraunces also has a `WONK` axis; leave it off unless the brand is genuinely playful. `SOFT` must be listed in `axes` before `font-variation-settings` can use it (§3.1).

**`lang` is not decoration.** It drives hyphenation, quote selection and fallback choice. Set it on `<html>` and on any element whose copy switches language.

### Fonts and SplitText

- **Lines: `autoSplit: true`, animation returned from `onSplit`.** SplitText re-splits when fonts finish loading and when the element's width changes, reverting the returned animation first and carrying its progress into the new one. This API needs GSAP 3.13 or later; never `new SplitText()` plus a manual resize listener.
- **Words or chars without `autoSplit`: split after `document.fonts.ready`, inside the matchMedia context** (char recipe in §5): `document.fonts.ready.then(() => live && ctx.add(() => { ... }))`. `ctx.add` puts the late split and tween in the same context the media query reverts, and `live` stops a resolve that lands after unmount or a media change. Split before the fonts land and it measures the fallback face.
- **`adjustFontFallback` makes the re-split nearly invisible:** pre-swap breaks land within a word of the final ones.
- **The options this skill uses:** `type`, `linesClass`, `mask`, `autoSplit`, `onSplit`, `aria`. `aria` defaults to `"auto"`: the split element gets an `aria-label` with its full text and the fragments are hidden from assistive tech. A label flattens markup, so do not split a heading that contains links.
- **Where the accessible name lives.** `aria-label` is only reliable on a heading, a link, a button or another element with a role; on a `span`, `div` or `p` (generic roles) screen readers may ignore it. So: split a heading directly and `"auto"` is right (`line-rise-hero`). For a link or button, put `aria-label` on that element and split inner `aria-hidden` spans with `aria: "none"` (SwapLink). For a paragraph or a bare word, render an `sr-only` copy next to an `aria-hidden` visual copy and split the visual one with `aria: "none"` (Manifesto, CharWord). `aria: "hidden"` hides the fragments without adding a label, for a split whose text already exists elsewhere.
- **Line masks and descenders.** With `mask: "lines"` each line sits in a wrapper with the class `linesClass + "-mask"` (`split-line-mask` here), which clips at tight leading. Pad the mask and pull the margin back so layout does not move: `.split-line-mask { padding-block: 0.1em; margin-block: -0.1em; }`. Every other way a descender or an italic overhang gets clipped, and the 10-second test: [pitfalls.md](pitfalls.md) §1.
- **Chars drop kerning.** Each character becomes an inline block, so pairs like `To`, `AV` and `Ty` open up at 8rem. Use chars only on short words and revert the split when the animation ends.

---

## 5. Choreography recipes

All recipes import from `@/lib/gsap` ([setup.md](setup.md)), live in a `"use client"` leaf with a scope ref, and create animation only inside the `no-preference` branch of `gsap.matchMedia()`. Reduced-motion users get the server markup as the final state with no animation work.

### The typographic signature move

**Every STRUQ.md declares one signature move**, the single typographic gesture the site is remembered by. Pick one:

- **`weight-in`**: the hero's `wght` rises from 100 to its resting 300 together with a short y-rise, once, on load (below).
- **`soft-scrub`**: Fraunces `SOFT` scrubbed from 0 to 100 across the hero's departure, so the headline softens as it leaves (below).
- **`type-mask-media`**: the display word is a window onto a photograph or video (the media clipped to the glyphs with `background-clip: text`, or an SVG `<mask>` for video), with the same words in the DOM.
- **`fit-width-wordmark`**: the wordmark set edge to edge at the exact container width, its size computed once from a measurement and on resize, never guessed in `vw`.
- **A cropped display**: one display line deliberately cut by the canvas edge, the rest of the word implied.

One per site, written into STRUQ.md next to the pairing. `manifesto-fill` (below) only when the copy is a genuine manifesto. The masked line rise is a technique, not a signature. It is allowed as the delivery of a named entrance (Warm Editorial rises, then soft-scrubs) and as the fallback entrance. **The tell is precise:** the rise as the hero's *only* gesture, with no signature move on the hero and no preset entrance behind it (§7).

### `weight-in`: the weight arrives with the line

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function WeightInHeadline({ children }: { children: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const h1 = root.current!.querySelector<HTMLElement>("[data-split-hero]")!;
      SplitText.create(h1, {
        type: "lines",
        autoSplit: true,
        onSplit(self) {
          h1.dataset.ready = "1"; // same pre-split guard as line-rise-hero
          return gsap.from(self.lines, {
            fontWeight: 100, yPercent: 40, autoAlpha: 0,
            duration: 1.6, ease: "expo.out", stagger: 0.09,
          });
        },
      });
    });
  }, { scope: root });

  return (
    <div ref={root}>
      <h1 data-split-hero className="font-display text-display max-w-[16ch]">{children}</h1>
    </div>
  );
}
```

- The lines are measured at the resting weight, then animated *from* 100, which is narrower, so no line can overflow and rewrap mid-move.
- It needs a variable face whose `wght` axis reaches 100: Urbanist, Fraunces, Outfit, Sora and Jost do; Cormorant (300), Newsreader and Manrope (200) do not, so start from their minimum. The 100 is a transit value and does not count against the three-weight budget (§2.2).
- Animating weight is a layout per frame. That is acceptable once, on load, on one element; never on scroll and never on body copy.

### `soft-scrub`: the headline softens as it leaves

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function SoftScrubHero({ children }: { children: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo("[data-soft]", { fontVariationSettings: '"SOFT" 0' }, {
        fontVariationSettings: '"SOFT" 100',
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
      });
    });
  }, { scope: root });

  return (
    <section ref={root} className="min-h-svh">
      <h1 data-soft className="font-display text-display max-w-[16ch] [font-variation-settings:'SOFT'_0]">{children}</h1>
    </section>
  );
}
```

- Fraunces only (S2, S3), with `SOFT` in the font's `axes` (§4). `opsz` stays automatic because it is not in the settings string.
- `SOFT` reshapes terminals without changing advance widths, so this is a repaint, not a layout. Still one per page.
- Reduced motion keeps the resting `SOFT 0`; nothing animates. The hero rests at the scrub's start, so it never flashes from a pinned 50 to 0 on hydrate; keep the site-wide `SOFT 50` pin in `@layer base` (§3.1 Fraunces note) so this utility wins on the hero.

### Index-list hover: weight, not colour

A list of case titles or services in `type-h3`: on hover the row's title moves from `wght` 300 to 450 over 0.4s. It reads as the line leaning toward the pointer, which a colour change never does.

```css
.index-row .type-h3 { font-weight: 300; }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .index-row .type-h3 { transition: font-weight 0.4s var(--ease-out-quart); }
}
.index-row:hover .type-h3, .index-row:focus-visible .type-h3 { font-weight: 450; }
```

Keep each title on one line with room to its right: the heavier weight is wider, and a title that wraps on hover jumps the whole list.

### `line-rise-hero`: masked line rise on load

The hero variant of [scroll-reveals.md](scroll-reveals.md) §3: it fires on load, not on scroll, and it must not flash.

```css
/* globals.css: hide only while motion is allowed and the split has not happened */
@media (prefers-reduced-motion: no-preference) {
  [data-split-hero]:not([data-ready]) { visibility: hidden; }
}
/* descender room inside each line mask (class = linesClass + "-mask"), with no layout jump */
.split-line-mask { padding-block: 0.1em; margin-block: -0.1em; }
```

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function HeroHeadline({ children }: { children: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const h1 = root.current!.querySelector<HTMLElement>("[data-split-hero]")!;
      SplitText.create(h1, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          h1.dataset.ready = "1"; // lines are in their start pose; safe to show
          return gsap.from(self.lines, { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.11 });
        },
      });
    });
  }, { scope: root });

  return (
    <div ref={root}>
      <h1 data-split-hero className="font-display text-display max-w-[16ch]">{children}</h1>
    </div>
  );
}
```

- The h1 is split directly, so the default `aria: "auto"` puts the full text in an `aria-label` on a heading, where screen readers honour it.
- Add `<noscript><style>{"[data-split-hero]{visibility:visible!important}"}</style></noscript>` to the root layout's `<head>` so a JS failure never hides the h1.
- **Not the hero's only gesture.** This is one entrance among several. Each preset names its own ([vibe-presets.md](vibe-presets.md)); use the rise when the preset's entrance includes it (Warm Editorial) or as a declared fallback, and pair it with the site's signature move. A hero that only rises line by line, on every Struq site, is a template.
- This is the one place CSS hides content until JS runs, and it has a price: the hero is usually the LCP element, so its paint waits for hydration. Keep this component a small leaf with no heavy imports and measure LCP in verify ([seo.md](seo.md) §6).
- With a loader, start the rise as the loader exits ([page-entrances.md](page-entrances.md), [loaders.md](loaders.md)).
- **When not to:** every section headline. Those use the scroll-triggered version from scroll-reveals. The hero earns the loud one.

### Char stagger for one short word

For a single word of 3 to 12 characters: a section title, a number, a brand name. Never a sentence.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function CharWord({ word }: { word: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
      let live = true;
      document.fonts.ready.then(() => live && ctx.add(() => { // measure the real face, not the fallback
        const split = SplitText.create(root.current!.querySelector("[data-word]"), {
          type: "lines,chars", mask: "lines", aria: "none", // the sr-only copy carries the name
        });
        gsap.from(split.chars, {
          yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.035,
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
          onComplete: () => split.revert(), // restores kerning and ligatures
        });
      }));
      return () => { live = false; };
    });
  }, { scope: root });

  return (
    <div ref={root}>
      <p className="font-display text-display">
        <span className="sr-only">{word}</span>
        <span data-word aria-hidden className="block">{word}</span>
      </p>
    </div>
  );
}
```

- `ctx.add` runs the late split inside the matchMedia context, so the media query flipping or the component unmounting reverts it with everything else; `live` stops a resolve that lands after either.
- The `sr-only` copy is the accessible text; the visual copy is `aria-hidden` and split with `aria: "none"`, so assistive tech reads one clean word, never a list of letters.
- `stagger: { each: 0.035, from: "center" }` suits a centred word. Never `from: "random"` on anything a client reads twice.
- **When not to:** body copy, phrases longer than two words (a typewriter toy), more than one per viewport.

### `scrub-headline`: oversized headline on scroll

An oversized line that slides and scales with scroll and runs off the canvas. With modest travel it stays readable, so it can be the real heading, set in the display role (the page's one other display line). As pure texture it takes `text-ghost` instead (last bullet).

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function ScrubHeadline({ children }: { children: string }) {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", small: "(max-width: 767px)" }, (ctx) => {
      const { motion, small } = ctx.conditions!;
      if (!motion) return;
      const travel = small ? 4 : 10; // percent; authored smaller on phones
      gsap.fromTo("[data-big]",
        { xPercent: travel, scale: 0.94, transformOrigin: "0% 50%" },
        { xPercent: -travel, scale: 1.04, ease: "none",
          scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: 1 } });
    });
  }, { scope: section });

  return (
    <section ref={section} className="overflow-clip py-[14rem]">
      <h2 data-big className="font-display text-display whitespace-nowrap">
        {children}
      </h2>
    </section>
  );
}
```

- Scrubbed tweens use `ease: "none"`; `scrub: 1` supplies the weight ([feel-layer.md](feel-layer.md)).
- `xPercent` and `scale` stay on the compositor. Scrubbing `letter-spacing` or a `wght` axis costs a layout per frame; budget at most one, on a short line.
- Past about 15% travel the line is unreadable mid-move. Then it is texture: `font-display text-ghost`, `aria-hidden`, ghost colour, and the real h2 below it.
- The `scale` up to 1.04 sits on top of the token's clamp, so the line reads larger than the hero for a moment without a second arbitrary size. `text-display` already carries the pairing's leading and tracking.
- **When not to:** more than one per page, or on a line people must read to understand the section.

### `manifesto-fill`: word-by-word color fill

A large paragraph "reads itself": words go from faint to full ink as the reader scrolls.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function Manifesto({ children }: { children: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      SplitText.create(root.current!.querySelector("[data-fill]"), {
        type: "words",
        aria: "none",   // the visual copy is aria-hidden; the sr-only copy is what is read
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(self.words, { opacity: 0.16 }, {
            opacity: 1, ease: "none", stagger: 0.1,
            scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
          }),
      });
    });
  }, { scope: root });

  return (
    <div ref={root}>
      <p className="sr-only">{children}</p>
      <p data-fill aria-hidden className="font-display text-statement max-w-[30ch]">
        {children}
      </p>
    </div>
  );
}
```

- **Only for a genuine manifesto:** copy written as a statement of belief, read slowly. Pasting a features paragraph into it is the tell.
- The `sr-only` paragraph is what assistive tech reads; the split copy is `aria-hidden` with `aria: "none"`, so no generic `p` is left carrying an `aria-label`.
- Opacity on `text-ink` is the compositor-cheap fill and stays inside the palette. The 0.16 start fails contrast on purpose, so the fill must complete before the paragraph leaves the viewport; for long copy, pin it ([pinning-scrub.md](pinning-scrub.md)).
- Split words, not chars: 60 to 90 words is fine, 400 is not.
- **When not to:** more than one per site, or text people skim (pricing, terms, specs).

### Ghost marquee

The scroll-drift mechanic and its code live in [depth-parallax.md](depth-parallax.md) §4. The type setup on top: `text-ghost` size, the display face at its lightest loaded weight, `text-ink/[0.05]` (0.04 to 0.06; higher competes with content, lower vanishes on cheap panels), `whitespace-nowrap`, the phrase repeated three times so the window never runs dry, `aria-hidden` on the wrapper. Keep it muted solid type; outlined ghost type (`-webkit-text-stroke` with a transparent fill) is a dated template move, so it is not offered here. **When not to:** light surfaces where 5% ink reads as a smudge, or pages that already run a marquee.

### Text-swap hover

The CSS slot-machine label is in [micro-interactions.md](micro-interactions.md) §3c. The per-char upgrade needs SplitText and belongs on exactly one element, the main CTA or the logo:

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function SwapLink({ href, label }: { href: string; label: string }) {
  const root = useRef<HTMLAnchorElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      // the <a> carries the name; both visual copies are aria-hidden, so the split adds nothing
      const a = SplitText.create(root.current!.querySelector("[data-a]"), { type: "chars", aria: "none" });
      const b = SplitText.create(root.current!.querySelector("[data-b]"), { type: "chars", aria: "none" });
      tl.current = gsap.timeline({ paused: true, defaults: { duration: 0.5, ease: "expo.out", stagger: 0.015 } })
        .set("[data-b]", { autoAlpha: 1 }, 0)
        .to(a.chars, { yPercent: -110 }, 0)
        .fromTo(b.chars, { yPercent: 110 }, { yPercent: 0 }, 0);
      return () => { tl.current = null; };
    });
  }, { scope: root });

  return (
    <a ref={root} href={href} aria-label={label} className="font-ui text-ui relative inline-flex overflow-hidden"
       onPointerEnter={() => tl.current?.play()} onPointerLeave={() => tl.current?.reverse()}
       onFocus={() => tl.current?.play()} onBlur={() => tl.current?.reverse()}>
      <span data-a aria-hidden>{label}</span>
      <span data-b aria-hidden className="invisible absolute inset-0">{label}</span>
    </a>
  );
}
```

The timeline exists only on hover-capable devices with motion allowed; elsewhere the handlers are no-ops and the link is plain. Handlers only `play()` and `reverse()` a timeline built inside `useGSAP`, so they need no `contextSafe`. **When not to:** every nav link. If every label rolls, none is special.

---

## 6. Details that sell it

**Real punctuation.** Type the real characters in copy: `’` for apostrophes, `“ ”` for English quotes, `„ “` for German, `…` for an ellipsis. Straight `"` and `'` are keyboard artefacts. Browsers pick `<q>` quote marks from `lang`.

**Numbers: `tabular-nums`, not mono.** Counters and tables need equal-width digits so a ticking number does not wobble. That is a font feature (`font-variant-numeric: lining-nums tabular-nums`, Tailwind `tabular-nums lining-nums`), not a monospace face. Check the face ships tabular figures; if the display face lacks them, set stats in the text face, which is why the numerals column in §3 names a face. **Running text is the opposite:** in Cormorant and Fraunces paragraphs, pull quotes and leads, a year or a figure set in lining tabular digits stands up like a capital. Use oldstyle proportional figures there (`font-variant-numeric: oldstyle-nums proportional-nums`) and keep lining tabular for counters, prices and tables.

**Optical margin alignment.** A display or h2 line that starts with a round or open letter (`O`, `C`, `G`, `T`, `W`, a quote mark) looks indented next to the body copy's straight edge, because the side bearing and the curve's overshoot add white. Pull the heading back a hair: `margin-inline-start: -0.04em` to `-0.07em`, tuned per face at display size. Round starts need the most; serifs with a flat stem start need the least. Set it per pairing on the display and h2 roles, never on body text.

**Ligatures and kerning.** Leave both at their defaults; never switch on discretionary ligatures site-wide. SplitText chars disable both (§4).

**`::selection`.** `::selection { background: var(--color-accent); color: var(--color-surface-0); }` is part of the token contract ([vibe-presets.md](vibe-presets.md)). Selection is the moment people stare at your type, and default blue says "unfinished".

**Hanging punctuation.** `hanging-punctuation: first` works only in Safari. On pull quotes elsewhere, fake it with a negative `text-indent` of about 0.4em, tuned per face.

**Dutch and German compounds.** Words like `Duurzaamheidsrapportage` overflow narrow columns. Set `lang` and hyphenate body copy, never headlines:

```css
:lang(nl) .prose, :lang(de) .prose { hyphens: auto; hyphenate-limit-chars: 7 3 3; } /* limit: progressive */
h1, h2, h3 { hyphens: manual; overflow-wrap: break-word; }
```

In a headline, place one soft hyphen by hand (`Duurzaam&shy;heid`), never inside a word you split into chars. Dictionaries differ per browser and device: check the hero at 390px on a real phone with the longest real word in the copy.

**One accent word.** One word of a headline in the display italic is the cheapest high-end move there is, when the display face has a real italic and it is loaded (S2, S3, S4, S5). Wrap it in `<em>`; SplitText keeps nested inline elements. Geometric pairings (S1, S6, S7) shift that one word from 300 to 500 or set it in the accent colour instead. The accent word stays in the headline's own family: a serif italic `<em>` dropped into a sans headline is the template tell of the moment (§7).

**Eyebrows are wayfinding.** Short, tracked, uppercase via CSS (source copy stays sentence case), one per section, never a stamped `01 / 02 / 03` ([anti-patterns.md](anti-patterns.md)).

---

## 7. Typography tell list

Sweep before shipping, alongside [anti-patterns.md](anti-patterns.md).

| Tell | Why it reads as generated | Replace with |
|---|---|---|
| Inter, Roboto, Open Sans, Poppins, Montserrat or Lato anywhere | Starter and UI-kit defaults | A pairing from §3 |
| Space Grotesk or Geist as the "technical" reflex | The generator's idea of modern | S7 (Sora + Instrument Sans) or S1 (Urbanist) |
| `tracking-tight`, `text-xs` or `text-3xl` to `text-5xl` on headings or eyebrows | The role tokens were bypassed; the size and optics are improvised | `text-h2`, `text-h3`, `text-eyebrow` and the role faces (§2.4) |
| `text-ink-faint` on any text | `ink-faint` is for hairlines, disabled states and placeholder rules; as text it fails contrast | `text-ink-muted` for eyebrows and meta |
| An Instrument Serif `<em>` inside a sans headline | The 2025 to 2026 template tell | The pairing's own accent move (§3.1) |
| Cream surface plus terracotta accent with no brand reason | The default "warm, human" palette of every generator | A palette argued from the brand ([vibe-presets.md](vibe-presets.md)) |
| The masked line rise as the hero's only gesture (no signature move on it, no preset entrance behind it) | One entrance on every site is a template | The preset's named hero entrance and the site's signature move (§5); the rise may deliver them |
| An arbitrary `text-[clamp(...)]` on a manifesto, statement or oversized line | The role tokens were bypassed | `text-statement`, `text-display` or `text-ghost` (§2.4) |
| `font-bold` on every heading | Safe at 24px, loud at 115px | Weight 300 to 400, hierarchy by size |
| 700 for emphasis inside light type | A hole in the page | 500 |
| Four or more weights of one family | Extra voices, extra bytes | Three at most (300, 400, 500) |
| Five similar sizes (`text-lg` to `text-4xl`) | Flat page, no focal point | The roles with real gaps (§2) |
| Mono eyebrows, labels, stats or badges | Dev-tool cosplay | Tracked uppercase text face; `tabular-nums` |
| A rounded or hairline display face used for body | Charming at 60px, tiring at 16px | Display faces stay at display sizes |
| Everything centred | No axis, no reading edge | Left-aligned on a strong edge; centre only short single lines |
| Gradient text | The 2021 SaaS tell, and it fails contrast | Solid ink; accent on one word at most |
| One `tracking-tight` on all sizes | A utility, not optics | Tracking per role and face (§2.3, §3) |
| Faux bold or italic | Smeared strokes | `font-synthesis: none`; load the real cut |
| Straight quotes, `...`, `--` | Keyboard text, not typeset text | Real quotes, `…`, proper punctuation |
| Orphans and one-word last lines | No wrap control | `balance` on headings, `pretty` on body |
| Body under 1rem, muted under 0.875rem | Fails the baseline floor | Body 1rem to 1.125rem, contrast 4.5:1+ |
| Char-split sentences | Typewriter toy | Lines for sentences, chars for one word |
| Hero flashes unsplit, then jumps | No pre-split guard | The `line-rise-hero` guard (§5) |

## 8. Thirty-second type audit

1. Two faces, display at 300 to 400 unless the preset declares heavy, three weights per family at most?
2. Every string on the page maps to one of the roles in §2.1, with that role's token?
3. Hero at the pairing's display clamp (standard `clamp(2.875rem, 1.2rem + 6.86vw, 8rem)`) with its tracking and leading, not defaults? One signature move declared?
4. Body 400, at least 1rem, 55 to 75ch, `text-wrap: pretty`; emphasis at 500?
5. `next/font`, two preloaded files, zero visible shift on a hard reload?
6. Hero hidden until split, no flash, `lang` set, longest real word checked at 390px?
7. `tabular-nums` on stats, real quotes, `::selection`, `font-synthesis: none`?
8. Reduced motion: every line of type visible and static with no animation work?
