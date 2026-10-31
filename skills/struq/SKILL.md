---
name: struq
description: "Award-tier web design for coding agents. Builds cinematic, agency-grade marketing sites, landing pages and portfolios: two-face typography with light display weights, curated palettes, art-directed CC0 photography from the Struq beeldbank, Lenis smooth scroll on one GSAP clock, SplitText headlines, masked reveals, a pinned or horizontal showpiece, a WebGL hero layer with a poster fallback, and a magnetic CTA. Ships tested copy-in components and a self-check script. Use when designing, building, redesigning, animating or auditing a marketing or narrative site, or when a page must feel premium, custom, cinematic or award-winning instead of templated. Stack: Next.js App Router + Tailwind v4 (Vite supported)."
argument-hint: "[brief] | redesign <path> | audit <path-or-url> | direct <brief>"
---

# Struq

A site looks like a template because every choice in it is the likeliest one. Struq replaces those choices with the ones an award-winning studio makes, and ships them as **tested components and two scripts**, so the build spends its effort on the page, not on plumbing. Follow the Build checklist below in order. The references are depth for when a step needs it; you do not need to read them to finish a good build.

`<skill-dir>` below is the folder this SKILL.md is in (Claude Code prints it as "Base directory for this skill"). Typical paths: `.claude/skills/struq`, `~/.claude/skills/struq`, `.agents/skills/struq`.

## Modes

| Invocation | Mode |
|---|---|
| `/struq <brief>` | **Build**: the Build checklist below, start to finish. |
| `/struq redesign <path>` | **Redesign**: keep the brand, copy and components; read [references/triage.md](references/triage.md), then run the checklist from step 3 on the existing project. |
| `/struq audit <path-or-url>` | **Audit**: change nothing. Run `node <skill-dir>/scripts/check.mjs` on the project and report its FAIL and WARN lines, a score (100, minus 5 per FAIL, minus 2 per WARN) and the three fixes with the most visual payoff. |
| `/struq direct <brief>` | **Directed**: one continuous WebGL experience across chapters. Run the checklist through step 5, then [cinematic/README.md](cinematic/README.md). |

Register: this is for marketing, landing, portfolio and narrative sites. For dashboards and product UI keep the type, palette and surface rules and drop Lenis, showpieces and the hero canvas.

## Three rules that never bend

1. **Never an empty frame.** Every image slot holds a real image. Without photos from the user, the Struq beeldbank pack is used automatically: it is free, CC0, made for this, and needs no permission. If struq.nl is unreachable, the script writes graded fallback plates in the site palette. A grey box, a "photo to come" caption or a placeholder component never ships.
2. **Never invent facts.** No testimonials, client logos, stats, awards, prices, addresses, opening hours, bios or quotes the brief did not give. Write real, specific running copy from what the brief says; anything the layout needs that is not known (an address, hours) is left out or written as a plain invitation ("Bel of mail voor een tafel"), and listed under Assumptions in STRUQ.md. A beeldbank photo shows the world around the client, never their own room, team or product: never caption it as theirs.
3. **Never the AI tells.** No eyebrows (small uppercase tracked labels above headings), no gradients, no tinted translucent fills or glass, no pills (above all a pill with a dot), no monospace as decoration, no Inter, Roboto, Arial or Geist, no blue or purple unless the brand is that colour, no drop-shadow cards, no three identical icon cards, no emoji, no em or en dashes in copy. `check.mjs` finds them all.

## The Build checklist

Copy this block into `STRUQ.md` in the project root (under the short plan, step 2) and tick each line (`- [x]`) as you finish it. `check.mjs` fails while any line is open. Do not report the build as done until every line is ticked and `check.mjs` prints `RESULT: PASS`.

```
## Build checklist
- [ ] 1 Project: Next.js App Router + Tailwind v4 in place (scaffolded if the folder was empty)
- [ ] 2 Plan: the short plan above is written; the plan message is sent; building on without waiting
- [ ] 3 Recipes: node <skill-dir>/scripts/recipes.mjs printed "OK recipes ready"
- [ ] 4 Images: node <skill-dir>/scripts/images.mjs <pack> printed "OK"
- [ ] 5 System: palette tokens in app/globals.css, two faces in app/fonts.ts, title and lang in app/layout.tsx
- [ ] 6 Hero: HeroCanvas layer, SplitHeadline h1, one line of lead, MagneticButton CTA, the hero photo
- [ ] 7 Sections: 5 to 7 sections on the arc, every image in a MediaFrame, text groups in Reveal, two grid breaks
- [ ] 8 Showpiece: one HorizontalGallery or PinnedZoom at the act break
- [ ] 9 Footer: designed as hard as the hero, with the image credit
- [ ] 10 Build: npm run build passes
- [ ] 11 Look: screenshots at 390 and 1440 and one full scroll, fixes made (or "not seen: no browser" written under Verify)
- [ ] 12 Check: node <skill-dir>/scripts/check.mjs prints RESULT: PASS
```

### Step 1: Project

Empty folder: `npx create-next-app@latest . --ts --tailwind --app --eslint --yes`. Existing project: read `package.json`; when the installed version's types disagree with a recipe, the installed version wins (adapt the recipe, keep its intent). Vite: translate each step through [references/stack-targets.md](references/stack-targets.md).

### Step 2: Plan (five minutes, not fifty)

Write this at the top of `STRUQ.md`, then the checklist under it:

```
# STRUQ.md: <name>
Brief: <one line: what it is, for whom, where>
Idea: <the one idea the site is about, and the one visual motif that carries it>
Palette: <preset from the table, or the brand's own colours>
Type: <pairing id>: <display face> + <text face>
Images: pack <slug> (or: the client's photos)
Hero: <contours | ripple | dots | the MCP background>
Showpiece: <HorizontalGallery | PinnedZoom>, after section <n>
Arc: 1 hero, 2 <...>, 3 <...>, 4 showpiece, 5 <...>, 6 invite, footer
Assumptions: <every drafted line and every fact left out>
Verify: <filled in at step 11>
```

Then send **one plan message**: the plan in five lines, and "Building with these choices now. Veto anything, or send a logo, photos or real numbers, and I will swap them in." **Do not wait for an answer**; keep building. Stop to ask first only when the brief does not say what the business is. When the user does answer later, swap what they veto or send.

### Step 3: Recipes

```bash
node <skill-dir>/scripts/recipes.mjs
```

Copies the tested components into the project and installs `gsap @gsap/react lenis three @types/three`. On a fresh scaffold it also writes `app/globals.css`, `app/layout.tsx` and `app/fonts.ts`; on your own files it prints what to merge. The components (all in `components/struq/`):

| Component | What it gives the page |
|---|---|
| `SmoothScroll` | Lenis on `gsap.ticker`, one clock for the whole page. Already in the layout. `getLenis()?.stop()` / `.start()` for menus. |
| `SplitHeadline` | SplitText line-mask rise. `as="h1"` for the hero, `on="scroll"` for a statement further down. Plain text children. |
| `Reveal` | Staggered rise of its direct children on scroll (`on="load"` in the hero). |
| `MediaFrame` | The only way an image goes on the page: curtain reveal, photo settle, scrubbed parallax. Props `image`, `ratio`, `sizes`, `priority` (the hero image only), `reveal`. |
| `HeroCanvas` | The WebGL hero layer: `scene="contours"`, `"ripple"` (needs `image`) or `"dots"`. Lazy three.js chunk, poster first, DPR cap, pixel budget, pause offscreen, still frame under reduced motion, colours read from the tokens. |
| `HorizontalGallery` | Showpiece: pinned section, a track of photos sliding sideways, each photo panning. Native swipe row on phones. |
| `PinnedZoom` | Showpiece: a small framed photo opens to full bleed while the statement lifts away. |
| `MagneticButton` | The primary CTA: leans to the pointer, ink fill rises on hover. `variant="line"` for the secondary. |
| `Cursor` | Dot and trailing ring, inverted against the page. Already in the layout; delete it for a booking tool or a dense shop. |

### Step 4: Images (automatic, every build)

```bash
node <skill-dir>/scripts/images.mjs <pack-slug>
```

It downloads the pack's 24 images to `public/images/`, verifies every file is a real image, and writes `lib/struq-images.ts`. It prints every image with what it shows: read those lines and give each slot the photo that fits it. Use them as `images.hero[0]`, `images.card[3]`, and so on; `imageCredit` goes in the footer. With the user's own photos: put them in `public/images/` and use them first; fill the rest from the pack.

Pick the pack by what the business is (the table goes by what the photos show):

| The brief is | Pack | The photos |
|---|---|---|
| Restaurant, bistro, bakery, café, wine bar, catering | `proof` | wood-fire kitchen, dining room before service, bread, plates |
| Shop, ceramics, cosmetics, homeware, product brand | `vitrine` | objects on stone under soft light |
| Architect, real estate, makelaar, property, interiors studio | `datum` | concrete, glass and timber, corrected verticals, no people |
| Construction, trades, installation, renovation | `mortar` | scaffold, timber frame, tools, backs and hands |
| Hotel, holiday home, travel, terrace, pool | `portico` | limewash, shutters, still water, late warm light |
| Law, accountancy, consultancy, finance, notary | `ledger` | oak desks, closed volumes, brass |
| Design studio, agency, print, illustration, writer | `quire` | studio desk mid-project, paper, ink, swatches |
| Software, SaaS, AI, anything with nothing to photograph | `halide` | glass, machined metal and light in darkness |
| Electronics, hardware, devices, engineering, deep tech | `circuit` | copper, solder and connectors at macro range |
| Mobility, e-bikes, logistics, transport, delivery | `transit` | depots, wet road, containers under sodium light |
| Sport, gym, running, coaching for performance | `cadence` | training spaces after dark, chalk and steel |
| Yoga, physio, spa, wellness, movement | `vessel` | studio floor, still water, linen, sand tones |
| Care, therapy, coaching, psychology, a small B&B | `linen` | calm rooms, linen, quiet hands |
| Hair salon, beauty, barber, nails | `sable` | salon light in taupe and brass |
| Fashion, textile, tailoring, clothing | `bolt` | cloth, rails, folds and seams, no bodies |
| Farm, growers, farm shop, food provenance | `loam` | soil, crops, greenhouse in low morning light |
| Nature, outdoor, coast, landscape, sustainability | `brume` | Atlantic coast under overcast, fog, stone |
| Crafts, metalwork, furniture making, workshop | `forge` | hot steel, worn tools, warm darkness |
| School, childcare, education | `primer` | empty rooms at child height, birch and felt |
| Events, venues, theatre, conferences | `assembly` | the room before it fills, chairs and stage light |

Nothing fits closely: take the pack whose light matches the palette (warm and light `linen`, warm and dark `forge`, cool and dark `halide`, cool and light `datum`). Never skip images. `node <skill-dir>/scripts/images.mjs --list` prints every pack. One pack per site. Translate the alts in `lib/struq-images.ts` when the site is not Dutch.

### Step 5: System

**Palette.** Paste one preset into the `STRUQ TOKENS` block of `app/globals.css` (or the brand's own colours in the same names). Neutrals do 95% of the work; the accent appears on the key CTA and at most one highlight per screen.

| Preset | For | surface-0 / 1 / 2 / 3 | ink / ink-muted | accent / accent-ink |
|---|---|---|---|---|
| Paper | food, craft, editorial | #F5EFE6 #EDE4D6 #E1D4BF #CDBB9F | #1E1A15 #5D5446 | #8A3B22 #FBF6EE |
| Limestone | architecture, law, studios | #F1F0EC #E7E5DF #D9D6CE #C2BEB3 | #181816 #56544E | #9C4A2B #F7F5F1 |
| Clay | hospitality, wellness, ceramics | #EFE6DA #E6D9C8 #D8C4AC #C3A784 | #2A1F17 #66574A | #A9482A #FBF4EC |
| Ink | dark cinematic: architecture, night hospitality, film | #0E0D0C #161513 #1F1D1A #2A2723 | #EDE7DC #A39B8E | #C8A46A #14110D |
| Forest | nature, outdoor, calm wellness | #0F1411 #151C18 #1D2620 #27322B | #E8E6DC #A2A898 | #C97B4A #0F1411 |
| Sodium | mobility, logistics, tech, sport | #111213 #18191B #212225 #2C2E31 | #ECEAE5 #9FA0A0 | #FF6A1A #111213 |

A blue or purple brand: write `Cool hue: declared because <the brand colour>` in STRUQ.md, or the check fails.

**Type.** Two faces, swapped into `app/fonts.ts` (keep the variable names `--face-display` and `--face-body`). Set `--display-weight` in globals.css to the weight given here.

| Id | Display + text | Temperament, for | fonts.ts | Weight |
|---|---|---|---|---|
| S2 | Fraunces + Urbanist | warm, literate: food, craft, books | `Fraunces({ subsets: ["latin"], axes: ["SOFT", "opsz"], variable: "--face-display", display: "swap" })`, `Urbanist({ subsets: ["latin"], variable: "--face-body", display: "swap" })` | 300 |
| S3 | Fraunces + Outfit | soft, friendly: wellness, care, kids | as S2 with `Outfit` for the body | 300 |
| S4 | Cormorant Garamond + Jost | quiet luxury: hotel, fashion, salon | `Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"], variable: "--face-display", display: "swap" })`, `Jost({ ... "--face-body" })` | 300 |
| S5 | Newsreader + Manrope | cinematic, dark, literate: architecture, law, film | `Newsreader({ subsets: ["latin"], axes: ["opsz"], style: ["normal", "italic"], variable: "--face-display", display: "swap" })`, `Manrope({ ... })` | 300 |
| S6 | Urbanist + Lora | essay-led: consultancy, research, studios | `Urbanist` as display, `Lora` as body | 300 |
| S7 | Sora + Instrument Sans | product, precise: tech, mobility, logistics | `Sora({ ... "--face-display" })`, `Instrument_Sans({ ... "--face-body" })` | 300 |
| E5 | Bodoni Moda + Albert Sans | fashion house | `Bodoni_Moda({ subsets: ["latin"], axes: ["opsz"], ... })`, `Albert_Sans({ ... })` | 400 |
| E6 | Instrument Serif + Outfit | poster, film title: events, venues, culture | `Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], ... })`, `Outfit({ ... })` | 400 |

Every string takes a role: `font-display text-display` (the h1), `font-display text-h2`, `font-display text-h3`, `text-lead`, `text-body`, `text-small`. Never `text-xl` or `text-5xl`, never `font-bold` on a heading: hierarchy comes from scale. The accent move is one word in the display italic, or the accent colour on one word. Depth: [references/typography.md](references/typography.md).

### Step 6: The hero

```tsx
<section className="relative flex min-h-svh flex-col justify-end overflow-hidden px-6 pb-16 pt-40 md:px-[8vw]">
  <HeroCanvas scene="ripple" image={images.hero[0]} scrim={0.35} priority />
  <div className="relative z-10 grid gap-10 text-on-photo md:grid-cols-12">
    <SplitHeadline as="h1" className="font-display text-display md:col-span-9">Vis en groente, van het seizoen.</SplitHeadline>
    <Reveal on="load" delay={0.5} className="flex flex-col gap-8 md:col-span-4 md:col-start-9">
      <p className="text-lead">Veertig plekken in Amsterdam-Noord. Reserveren kost een minuut.</p>
      <div><MagneticButton href="#reserveren">Reserveer een tafel</MagneticButton></div>
    </Reveal>
  </div>
</section>
```

- **Pick the scene:** `ripple` when one strong photo carries the brand (food, hospitality, hotels, fashion, wellness); `contours` for calm and precise (architecture, studios, consultancy, nature, research), with the hero photo in a `MediaFrame` beside or below the headline; `dots` for movement and scale (mobility, logistics, tech, sport, energy), with the photo in the next section.
- Type over a photo (`ripple`, `PinnedZoom`, a full-bleed band) is `text-on-photo` with `scrim={0.3}` to `0.45`; type over `contours` or `dots` is the normal `text-ink`. The headline must read at 4.5:1.
- The h1 is the site's promise in 8 words or fewer, set large and light. No label above it.

### Step 7: Sections on the arc

Five to seven sections after the hero, in this order of beats: **orient** (what it is, one statement beside a big image), **prove** (the real specifics: the menu, the services, the projects, typeset), the **showpiece**, **deepen** (detail photos and short text), **invite** (the one CTA again). Then the footer. Patterns with code: [references/sections.md](references/sections.md).

- Every image in a `MediaFrame` from `lib/struq-images.ts`, declared ratios only (16/9, 3/2, 4/5, 1/1, 21/9), never the same photo twice.
- Text groups in `<Reveal>`: a heading and its paragraph rise together.
- Break the grid at least twice: an image bleeding off the viewport edge, an image overlapping the next section (`-mb-[12vh] relative z-10`), oversized type running off the canvas.
- Vary the layouts: after a 5/7 split comes a full-bleed band or hairline rows, never three equal cards.
- Section padding varies by role: dense 6 to 8rem, breathers 12 to 20rem. One section should feel too empty by SaaS standards.
- Wayfinding without eyebrows: the heading itself, a hairline rule (`border-t border-line`), a change of surface step, a jump in scale.

### Step 8: The showpiece

One per site, at the act break (after the proof, before the invitation). `HorizontalGallery` when there is a set of things (dishes, projects, rooms, products); `PinnedZoom` when there is one moment (the room, the place, the material). Never two pins back to back. The Struq MCP or a brief may budget more; never fewer than one.

### Step 9: The footer

Designed as hard as the hero: the name set huge in the display face (it may crop at the edge), the one CTA, the contact facts the brief gave (and only those), a hairline, the image credit as one quiet `text-small` link: `<a href={imageCredit.href}>{imageCredit.label}</a>`.

### Steps 10 to 12: Build, look, check

- `npm run build` must pass. Fix type errors in your own code; never delete a recipe to get green.
- **Look**, when you have a browser tool: serve the production build (`npx next start -p 4321`), screenshot 390 and 1440, scroll the page once top to bottom. Check: the headline reads, no frame is blank after its reveal, the showpiece engages and releases without a jump, nothing overflows sideways at 390. No browser tool: write `Verify: not seen, no browser` in STRUQ.md. Never claim you saw what you did not.
- **Check**: `node <skill-dir>/scripts/check.mjs`. Fix every FAIL at its file and line, run it again, and repeat until `RESULT: PASS`. Then tick line 12 and report.

## With the Struq MCP (Pro)

When the `struq_*` tools are connected, their plan wins for palette, type, arc, copy budget and motion values: write what they return into the short plan and build it with these recipes. The floor in this file still holds on top of it: images from the beeldbank pack the plan names (the plan's pack, or the table above), one showpiece at least, the hero canvas, every check passing.

**When `struq_achtergrond` returns a background, build that one.** It is the hero layer. Write it as `components/struq/scenes/<name>.ts` with the same `createScene` contract as the three shipped scenes ([references/hero-scenes.md](references/hero-scenes.md)), take its colours from the palette passed in (so it is recoloured to the site's tokens), add it to the `SCENES` map in `HeroCanvas.tsx`, and use `<HeroCanvas scene="<name>" />`. Never skip it because it is hard to check without a browser: HeroCanvas keeps the poster when the scene fails, so building it can never leave the hero empty.

## The taste baseline

What the recipes and the check enforce, and what you keep when you write your own code:

- **Type:** two faces; display large and light (300 to 400), leading 0.92 to 1.0, tracking tighter at size; body 1 to 1.0625rem at 1.6+; nothing under 12px; body at 4.5:1. Headings `text-wrap: balance`, body `pretty`. Mono only for literal code.
- **Scale:** one fluid root-rem knob (in globals.css). Author in rem; breakpoints change layout, never size.
- **Surface:** elevation is a tonal step plus a hairline (`border-line`), never a drop shadow. Radius 0 to 4px.
- **Colour:** temperature-shifted neutrals, one accent, flat fills. No gradient anywhere, no gradient text, no glass.
- **Motion:** every entrance moves and fades (never opacity alone), expo.out, stagger 0.06 to 0.1s, reveals 0.6 to 1.0s, hero 1.0 to 1.6s; scroll-tied effects scrub; one clock; reduced motion keeps opacity and drops transforms.
- **Composition:** break the grid twice, vary section layouts, one too-empty section, the footer designed as hard as the hero.
- **Details:** real running copy, custom `::selection`, designed `:focus-visible`, one icon family if any icons at all ([references/iconography.md](references/iconography.md)), never Sparkles, Rocket or Zap.

Before and after pairs for every tell: [references/anti-patterns.md](references/anti-patterns.md).

## When something goes wrong

- **The page does not scroll:** `<html>` has `lenis-stopped`? An overlay called `stop()` without `start()`. Otherwise the ticker is not driving Lenis: keep `SmoothScroll` as shipped. [references/setup.md](references/setup.md) §2.
- **A pin jerks on engage:** never `anticipatePin` with smooth scroll; `scrub: 1`. [references/pinning-scrub.md](references/pinning-scrub.md) §2.
- **Descenders clipped in the split headline:** the `.struq-line-mask` rule in globals.css gives them room; keep it.
- **Content stays invisible:** something removed `data-ready` handling or the `js` class script. Restore the layout and globals.css from `<skill-dir>/recipes/app/`.
- **Anything else in motion:** [references/pitfalls.md](references/pitfalls.md), symptom first.

## Depth, when a step needs it

Typography [typography.md](references/typography.md) · palettes and presets [vibe-presets.md](references/vibe-presets.md) · page arc and footer [page-architecture.md](references/page-architecture.md) · composition [composition.md](references/composition.md), on phones [mobile-composition.md](references/mobile-composition.md) · imagery and grading [imagery.md](references/imagery.md), the beeldbank [struq-imagery.md](references/struq-imagery.md) · reveals [scroll-reveals.md](references/scroll-reveals.md) · more showpieces [showcase.md](references/showcase.md), [pinning-scrub.md](references/pinning-scrub.md) · the feel layer [feel-layer.md](references/feel-layer.md) · nav and menus [nav-header.md](references/nav-header.md) · route transitions [route-transitions.md](references/route-transitions.md), loaders [loaders.md](references/loaders.md) · SVG motion [svg-motion.md](references/svg-motion.md) · pointer [micro-interactions.md](references/micro-interactions.md) · WebGL beyond the hero [webgl-r3f.md](references/webgl-r3f.md), [webgl-scenes.md](references/webgl-scenes.md), hero scenes [hero-scenes.md](references/hero-scenes.md) · brand from nothing [brand.md](references/brand.md) · SEO [seo.md](references/seo.md) · performance [performance.md](references/performance.md) · a long, interactive planning session [direction.md](references/direction.md).
