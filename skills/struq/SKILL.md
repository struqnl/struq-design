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
| `/struq redesign <path>` | **Redesign**: keep the brand, copy and components; read [references/triage.md](references/triage.md), then run the checklist from step 3 on the existing project. The log starts with what you found. |
| `/struq audit <path-or-url>` | **Audit**: change nothing. Run `node <skill-dir>/scripts/check.mjs` on the project and report its FAIL and WARN lines, a score (100, minus 5 per FAIL, minus 2 per WARN) and the three fixes with the most visual payoff. The check appends its result to the project's STRUQ-LOG.md; log the audit itself there too. |
| `/struq direct <brief>` | **Directed**: one continuous WebGL experience across chapters. Run the checklist through step 5, then [cinematic/README.md](cinematic/README.md), logging every chapter to the same STRUQ-LOG.md. |

Register: this is for marketing, landing, portfolio and narrative sites. For dashboards and product UI keep the type, palette and surface rules and drop Lenis, showpieces and the hero canvas.

## Three rules that never bend

1. **Never an empty frame.** Every image slot holds a real image. Without photos from the user, the Struq beeldbank pack is used automatically: it is free, CC0, made for this, and needs no permission. If struq.nl is unreachable, the script writes graded fallback plates in the site palette. A grey box, a "photo to come" caption or a placeholder component never ships.
2. **Never invent facts.** No testimonials, client logos, stats, awards, prices, addresses, opening hours, bios or quotes the brief did not give. Write real, specific running copy from what the brief says; anything the layout needs that is not known (an address, hours) is left out or written as a plain invitation ("Bel of mail voor een tafel"), and listed under Assumptions in STRUQ.md. A beeldbank photo shows the world around the client, never their own room, team or product: never caption it as theirs.
3. **Never the AI tells.** The one combined list (Struq's tells, the slop audit and Roy's rules), each with its fix in [references/anti-patterns.md](references/anti-patterns.md) and each detected by `check.mjs`:
   - **Type and labels:** eyebrows and any uppercase label or marquee; monospace as a design face; Inter, Roboto, Arial, Helvetica, Open Sans, Poppins, Montserrat, Lato, Geist, Space Grotesk; heavy display; 01 / 02 / 03 numbering; raw text sizes and breakpoint size ladders.
   - **Colour and surface:** gradients of any kind; gradient text; tinted translucent fills and glass; pastel status badges; pills, above all a pill with a dot; pulsing live dots; blue or purple unless the brand is that colour; drop-shadow elevation; side-stripe borders.
   - **Layout and motion:** three identical cards; uniform section padding; opacity-only entrances; the same hover on everything; single-layer parallax; `anticipatePin` with smooth scroll; empty or placeholder frames.
   - **Copy and icons:** emoji and the cliche icons (sparkles, rocket, lightning, bulb, wand, flame); lorem, Acme and leftover template text; em and en dashes in any form; generic CTAs ("Learn more", "Lees meer"); generic headings ("Our Services", "Over ons"); hype words ("seamless", "naadloos"). Judged by eye, not by the script: the hero-metric template, category-reflex colours, a heading the paragraph restates.

## The Build checklist

Copy this block into `STRUQ.md` in the project root (under the short plan, step 2) and tick each line (`- [x]`) as you finish it. `check.mjs` fails while any line is open.

**The site log.** Every site also keeps `STRUQ-LOG.md` in the project root, from the first step on: append only, one entry per step, a heading with the step name and the local time, then two to five short lines of what and why. Log the brief received, the canon picks and why, the approval asked and the answer, each section built (files, recipe), every check run, every fix after a failure, every deviation and assumption, and the final state. `canon.mjs`, `images.mjs`, `recipes.mjs` and `check.mjs` append their own entries; you add the rest with `log.mjs`. `check.mjs` fails when the log is missing or a ticked step has no entry. STRUQ.md stays the plan; the log is what happened. Do not report the build as done until every line is ticked and `check.mjs` prints `RESULT: PASS`.

```
## Build checklist
Rule: keep STRUQ-LOG.md at every step: node <skill-dir>/scripts/log.mjs "Step N Name" "what" "why" (canon, images, recipes and check log themselves)
- [ ] 1 Project: Next.js App Router + Tailwind v4 in place (scaffolded if the folder was empty)
- [ ] 2 Plan and approval: palette, pairing, design system and pack picked from the canon (canon.mjs list); STRUQ.md written; the one stop for approval sent and answered
- [ ] 3 Recipes: node <skill-dir>/scripts/recipes.mjs printed "OK recipes ready"
- [ ] 4 Canon: canon.mjs palette and canon.mjs type wrote the tokens and the fonts of the approved picks
- [ ] 5 Images: images.mjs --brief printed "OK"; only photos whose alt fits the client are used, captions written from the alts; title and lang set in app/layout.tsx
- [ ] 6 Hero: the full-bleed HeroOpener (photo edge to edge, line at 14 to 20vw, lead, large CTA, header with the data-wordmark name), or a hand-built hero under the same rules
- [ ] 7 Sections: 5 to 7 sections on the arc, every image in a MediaFrame, text groups in Reveal, two grid breaks; one contrast scene (scene-inverse or scene-field), at most two
- [ ] 8 Showpieces: the lead toonstuk from the picker (or the one the user named) and at most one supporting move
- [ ] 9 Footer: toonstuk-wordmark-finale, with the image credit
- [ ] 10 Build: npm run build passes
- [ ] 11 Look: screenshots at 390 and 1440 and one full scroll, fixes made (or "not seen: no browser" written under Verify)
- [ ] 12 Check: node <skill-dir>/scripts/check.mjs prints RESULT: PASS
```

### Step 1: Project

Empty folder: `npx create-next-app@latest . --ts --tailwind --app --eslint --yes`. Existing project: read `package.json`; when the installed version's types disagree with a recipe, the installed version wins (adapt the recipe, keep its intent). Vite: translate each step through [references/stack-targets.md](references/stack-targets.md).

### Step 2: Plan, then the one stop for approval

Run `node <skill-dir>/scripts/canon.mjs list` (it reads the canon and changes nothing) and pick the palette, the pairing, the design system and the beeldbank pack as step 4 and step 5 describe. Then write this at the top of `STRUQ.md`, with the checklist under it:

```
# STRUQ.md: <name>
Brief: <one line: what it is, for whom, where>
Idea: <the one idea the site is about, and the one visual motif that carries it>
Palette: <canon palette slug> (<its mood>)
Type: <canon pairing slug>: <display face> + <text face>
System: <canon design system slug> (<its section order>)
Images: pack <slug> (or: the client's photos, then pack <slug>)
Hero: <contours | ripple | dots | the MCP background>
Showpiece: <HorizontalGallery | PinnedZoom>, after section <n>
Arc: 1 hero, 2 <...>, 3 <...>, 4 showpiece, 5 <...>, 6 invite, footer
Assumptions: <every drafted line and every fact left out>
Verify: <filled in at step 11>
```

Then **stop, once**: send the plan in five lines (idea, palette, type, pack, arc with the showpiece) and the materials request, in the user's language:

> Akkoord? Heb je een logo, foto's of echte cijfers, stuur ze nu.

(English: "Approve? If you have a logo, photos or real numbers, send them now.") Wait for the answer. Any yes, or "bouw maar" with nothing attached, builds with the canon picks as planned; what the user sends replaces the matching pick or pack images; a veto changes only what it names. **This is the only stop: never ask a second time**, not for permission to download the images (they are free and CC0) and not to confirm a build step. Only a brief that does not say what the business is gets one question before the plan, instead of this stop.

**The build request is not the approval.** "Build me a site for ..." is the brief; the approval is the user's answer to this stop, and nothing else counts as one. Log it word for word, then go on: `node <skill-dir>/scripts/log.mjs "Step 2 Approval" "Asked: Akkoord? Heb je een logo, foto's of echte cijfers, stuur ze nu." "Reply: \"<the user's own words>\""`. `check.mjs` fails without that entry and its Reply line.

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

### Step 4: Canon (Struq's own palette, type and system, every build)

A generic AI falls back on its standard palette and fonts. A Struq build starts from Struq's canon: curated palettes, pairings and design systems, public, no account. **Never invent a palette or a pairing while the canon has a fit.**

```bash
node <skill-dir>/scripts/canon.mjs list                  # every palette (slug, mood, light or dark), pairing, system, pack
node <skill-dir>/scripts/canon.mjs palette <slug>        # writes the STRUQ TOKENS block in app/globals.css
node <skill-dir>/scripts/canon.mjs type <slug>           # writes app/fonts.ts (Google via next/font, Fontshare as local woff2)
node <skill-dir>/scripts/canon.mjs system <slug>         # prints the section order
```

Each command prints the line to paste into STRUQ.md (`Palette:`, `Type:`, `System:`). The raw API, if you want to read it yourself:

| Endpoint | Read |
|---|---|
| `curl -s "https://struq.nl/api/assets?filter=palette"` | `items[].slug`, `items[].data.mood`, `items[].data.colors` with `background`, `surface`, `text`, `accent`, `accentAlt` (OKLCH or hex), `items[].tags` (`sfeer:licht`, `sfeer:donker`, `sfeer:warm`, `sfeer:koel`, `sfeer:redactioneel`, `sfeer:rustig`, `sfeer:gedurfd`, `sfeer:technisch`) |
| `curl -s "https://struq.nl/api/assets?filter=typography"` | `items[].slug`, `items[].data.display.name`, `items[].data.body.name`, their `stack`, `items[].data.intent` |
| `curl -s "https://struq.nl/api/assets?filter=design_system"` | `items[].slug`, `items[].data.silhouette.sectionOrder`, `items[].data.paletteRef`, `items[].data.typographyRef` |
| `curl -s "https://struq.nl/api/media/packs"` | `packs[].slug`, `packs[].description` (step 5) |

Testing only: `STRUQ_API_BASE=https://staging.struq.nl` points `canon.mjs` and `images.mjs` (API and image downloads) at another Struq environment. Users never set it.

**How to pick.** Palette by the brief's mood first (`data.mood` and the `sfeer:` tags), then by sector: a restaurant by a wood fire reads `frontier-olea-flour-terracotta` or `frontier-lumen-firelit-flour`; an architect `graphite-ivory` or `midnight-brass`; a mobility launch `frontier-aperture-technical-dark` or `frontier-velar-graphite-scarlet`; care `frontier-thuispost-oat-petrol` or `frontier-stillwater-oat-sage`; fashion `frontier-seve-bone-oxblood`. A palette whose accent is blue or purple (`canon.mjs list` marks it) only when the brand is that colour, declared in STRUQ.md as `Cool hue: declared because <the brand colour>`. The brand's own colours, when the brief gives them, beat the canon: write them into the same token names.

Pairing by temperament: `serif-editorial` (Fraunces, warm and premium), `newsreader-classic` (Newsreader, literate, long-form), `editorial-sans-precision` (Sora, architectural, calm), `geometric-modern` (Manrope, self-assured), `display-drama` (Syne, expressive campaigns). `canon.mjs type` applies Struq's overrides for you: Inter is replaced (Fraunces gets Urbanist), a commercial face gets its free stand-in (Neue Haas Grotesk Text becomes General Sans from Fontshare), and `grotesk-workhorse` (Space Grotesk + Inter) is refused. When no canon pairing fits the temperament (quiet luxury, a fashion house, a poster voice), use the Signature set in [references/typography.md](references/typography.md) §3.1 through `canon.mjs type --display "Cormorant Garamond" --body "Jost"`.

Design system by the business: `gallery-first` when the work is visual (restaurant, architecture, shop), `proof-forward` when the brief has real facts to show, `story-led` for founder-led and care, `loud-campaign` for a launch, `editorial-restrained` for professional services. Use its section order for the arc; drop any section that would need invented content (`proof` and `story-proof` only with real facts, `faq` only with answers the brief gives), and add the Struq floor: the hero canvas, one showpiece at the act break, the designed footer.

Every string then takes a role: `font-display text-display` (the h1), `font-display text-h2`, `font-display text-h3`, `text-lead`, `text-body`, `text-small`. Never `text-xl` or `text-5xl`, never `font-bold` on a heading: hierarchy comes from scale. The accent move is one word in the display italic, or the accent colour on one word.

No network: keep the `Paper` tokens the recipe ships, set `Palette: offline default (paper)` in STRUQ.md, and run `canon.mjs` again when struq.nl answers.

### Step 5: Images (automatic, every build)

```bash
node <skill-dir>/scripts/images.mjs --brief "<the brief, in the user's words>"
node <skill-dir>/scripts/images.mjs <pack-slug> --brief "<the brief>"     # when you picked the pack yourself
```

Always pass `--brief`. With it the script picks the pack by Struq's rule when you name none, and **leaves out the photos whose alt names a subject this client does not do** (a fish restaurant gets the dining room and the wood fire of `proof`, not its flour and dough); the best fits come first in each slot. It downloads what is left to `public/images/`, verifies every file is a real image, and writes `lib/struq-images.ts` with each photo's alt and description. Read every alt before you place a photo: use only photos whose alt fits what this client actually does, and **write every caption from what the alt says**. Never caption a photo with a subject it does not show (no "Vis van het seizoen" under an apron with flour on it). Use them as `images.hero[0]`, `images.card[3]`, and so on; `imageCredit` goes in the footer. With the user's own photos: put them in `public/images/` and use them first; fill the rest from the pack.

The pack rule, the same one Struq's MCP uses (`scripts/packs.mjs`): a sector word in the brief picks that sector's pack, matched as whole words; a product launch with no sector word gets `vitrine` (product photography) and the hero scene carries the product; vehicle and mobility words never pull a brief to freight; anything else gets `halide`. The table, by what the photos show:

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
| Logistics, freight, distribution, warehousing (vracht, distributie, magazijn) | `transit` | depots, wet road, containers under sodium light |
| A product launch with no sector of its own: an e-bike, a cargo bike, a device, a drink | `vitrine` | the product's world on stone under one light; the hero scene carries the product |
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

The table reads the photos, never the API's `sector` field: production still carries old labels that do not match the pictures (`vessel` is wellness, not kitchen; `datum` is architecture, not data), so the skill never chooses by that field. Nothing fits closely: take the pack whose light matches the palette (warm and light `linen`, warm and dark `forge`, cool and dark `halide`, cool and light `datum`). Never skip images. One pack per site. Translate the alts in `lib/struq-images.ts` when the site is not Dutch. Then set the title, description and `lang` in `app/layout.tsx`.

### Step 6: The hero: a full-bleed cinematic opener

The first screen is the photo, edge to edge, with giant type set across it. Not a text block beside a picture. Use `toonstuk-hero-opener` (copied to `components/struq/showpieces/`):

```tsx
<HeroOpener
  image={images.hero[0]}
  title="Koken op"
  accent="vuur."
  lead="Een houtoven, een wijnbar en een zaal aan het water."
  cta={{ href: "#reserveren", label: "Reserveer een tafel" }}
  header={<SiteHeader />}
/>
// or the name split to both edges with the photo between:
<HeroOpener image={images.hero[0]} split={["Vuur", "Noord"]} lead="..." cta={{ href: "#reserveren", label: "Reserveer een tafel" }} header={<SiteHeader />} />
```

- **The photo fills the viewport,** the ripple WebGL layer living in it, with a flat scrim at a fixed opacity so the copy reads at 4.5:1. Never a gradient.
- **The display line runs at 14 to 20vw** (the opener sets 19vw on phones, 16vw on desktop) along the held-clear bottom, or as a split wordmark. Eight words at most; one word may be the italic accent. `check.mjs` fails a hand-built hero line under 10vw.
- **One short lead and one confident rectangular CTA** above the line (`MagneticButton size="lg"`), never a pill.
- **The lead sits on the photo's calm side.** The opener reads the photo's `negativeSpace` from the beeldbank (written into lib/struq-images.ts) and puts the lead there, the CTA on the other side; pass `calm="left"` or `calm="right"` for your own photo. Where there is no calm side, the lead gets a flat backing at a fixed opacity and is set a step larger (text-h3). Never a lead on bright, busy detail without one.
- **Display lines get word spacing in step with their size:** 0.06 to 0.1em at poster sizes (the opener uses 0.09em), the italic accent word included, so tight tracking never runs two words into one.
- **The handover is a move:** on scroll the opener pins, scales down and darkens while the next section slides up over it. The section after it needs nothing extra: globals.css gives it a ground and the layer above.
- **The header** with the wordmark (`data-wordmark`) goes in the `header` prop, set over the photo in `text-on-photo`.
- **Never model the client's product from primitives:** a launch uses the `vitrine` product photography in the opener. For a portfolio brief ("laat ons werk zien"), the opener photo is a real project of the client.
- Phones and reduced motion get the composed still: the same full-bleed photo and line, no pin.

A hand-built hero is allowed when the brief needs something the opener does not do, under the same rules: a pack photo in the hero (`check.mjs` fails one without), the copy marked `data-quiet` (the `SplitHeadline` h1 marks itself), the line at 10vw or more, a header with the wordmark.

**One contrast scene.** Every site has one dark or full-colour scene, at most two, so the page does not stay on one ground: wrap one section in `scene-inverse` (the palette's dark ground with light type) or `scene-field` (a full-strength colour field). The tokens turn inside, so any recipe in it follows. Good places: the agency's scrub connector, the services rows, the project stack, the invitation. `canon.mjs palette` writes the `inverse` and `field` roles from the canon palette when it has them, and swaps text and ground when it does not. `check.mjs` fails a site with none, or with more than two.

### Step 7: Sections on the arc

Five to seven sections after the hero, in this order of beats: **orient** (what it is, one statement beside a big image), **prove** (the real specifics: the menu, the services, the projects, typeset), the **showpiece**, **deepen** (detail photos and short text), **invite** (the one CTA again). Then the footer. Patterns with code: [references/sections.md](references/sections.md).

- Every image in a `MediaFrame` from `lib/struq-images.ts`, declared ratios only (16/9, 3/2, 4/5, 1/1, 21/9), never the same photo twice.
- Text groups in `<Reveal>`: a heading and its paragraph rise together.
- Break the grid at least twice: an image bleeding off the viewport edge, an image overlapping the next section (`-mb-[12vh] relative z-10`), oversized type running off the canvas.
- Vary the layouts: after a 5/7 split comes a full-bleed band or hairline rows, never three equal cards.
- Section padding varies by role: dense 6 to 8rem, breathers 12 to 20rem. One section should feel too empty by SaaS standards.
- Wayfinding without eyebrows: the heading itself, a hairline rule (`border-t border-line`), a change of surface step, a jump in scale.

### Step 8: The showpieces (toonstuk)

Struq builds impressive agency, brand, product and company sites, not simple conversion pages. The showpieces are what make them so: directed, pinned, scroll-scrubbed scenes on the one clock. `recipes.mjs` copies them to `components/struq/showpieces/`, one file per stable slug; each has a composed still for phones and reduced motion built in.

**Pick one lead showpiece and at most one supporting move,** from this table, by the kind of client. Do not improvise a third. When the user names one in the brief ("met de project-stack", "with the panel wipe"), use that one as the lead, whatever the table says.

| The client is | Lead showpiece | Supporting move (at most one) |
|---|---|---|
| Architect, studio or portfolio with real project photos | `toonstuk-project-stack` | `toonstuk-image-to-fullbleed` |
| Architect, studio or portfolio without project photos | `toonstuk-image-to-fullbleed` | `toonstuk-manifesto-scrub` |
| Product launch | `toonstuk-image-to-fullbleed`, with the hero scene carrying the product | `toonstuk-pixel-resolve` in the hero |
| Restaurant, hospitality, hotel | `toonstuk-panel-wipe` | `toonstuk-manifesto-scrub` |
| Agency or creative brand | `toonstuk-scrub-connector` | `toonstuk-fill-rows` for the services |
| Editorial, a writer, a publication | `toonstuk-manifesto-scrub` | `toonstuk-image-to-fullbleed` |
| Anything else | `toonstuk-image-to-fullbleed` | none |

Every site closes with `toonstuk-wordmark-finale` as its footer; it does not count as the supporting move.

| Slug | Component | What it does |
|---|---|---|
| `toonstuk-image-to-fullbleed` | `ImageToFullbleed` | A small centred photo unclips to the full viewport while pinned, the name split to either side and travelling off the edges, one line rising over the open photo. |
| `toonstuk-panel-wipe` | `PanelWipe` | Two ground-colour panels, each carrying one word, part to reveal a full-bleed photo and close again over it, carrying the headline into the next scene. |
| `toonstuk-scrub-connector` | `ScrubConnector` | One accent bar rotates, stretches and travels across a pinned stretch until it lands as a level line between two words. |
| `toonstuk-project-stack` | `ProjectStack` | Pinned full-bleed project cards slide over each other, the one beneath receding; the cursor becomes a round "Bekijk" label over them. Only with the client's own project photos. |
| `toonstuk-manifesto-scrub` | `ManifestoScrub` | One large statement fills word by word on scroll, with small photos opening inside the line (`{0}`, `{1}` in the text). |
| `toonstuk-fill-rows` | `FillRows` | Large hairline rows of services or chapters; on hover and focus a row floods with the accent and its detail slides in. |
| `toonstuk-wordmark-finale` | `WordmarkFinale` | The footer: the name fitted edge to edge, letters rising out of a mask, one closing line and a live local clock. |
| `toonstuk-pixel-resolve` | `PixelResolve` | The hero photo arrives as coarse pixels and resolves to sharp in held steps, then the plain image stays. |

**The direction these showpieces need** (they look cheap without it):
- Two or three colours from the canon palette, at full strength: the ground, the ink, the accent. No tints.
- Display type at 12 to 20vw against small body copy. The display type is the composition, not a heading above it.
- One italic serif accent at most, on one word.
- Full-bleed beeldbank photography (or the client's own), never framed small in a box when a scene can carry it.
- One idea per screen. Hold on it.
- Transitions are scale, mask and clip moves between full-bleed scenes, never fades between boxes.
- SplitText on display lines, long eases, holds on every key frame; nothing bounces.
- Struq's rules still win over any reference: no eyebrow or dot labels, no pills (the round cursor label is not a pill), no stat rows ("20+", "51+"), no three identical cards, no numbered sections, no mono flavour, no Inter, no dashes, no blue or purple by default, and never a reference's layout, copy or images.

Never two pinned showpieces back to back: put a breathing section between them. The Struq MCP or a brief may budget more; never fewer than one lead.

### Step 9: The footer

`<WordmarkFinale name="<the name>" line="<one closing line>" place="<the city>" timeZone="Europe/Amsterdam">` with the one CTA, the contact facts the brief gave (and only those) and the image credit as children: `<a href={imageCredit.href}>{imageCredit.label}</a>`. The name is fitted to the full width and marked `data-wordmark`.

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

## The canonical references, and where Struq overrides them

For craft (layout, type, motion, Lenis, SplitText, reveals, pinned and horizontal showpieces, WebGL heroes, custom cursors) the canonical sources are Roy's `deck-design` skill and the `cinematic-web-experience` skill; this skill's references and recipes follow them. Where Struq deliberately differs, Struq wins, and these are all the differences:

1. **No eyebrows.** deck-design recommends tracked uppercase labels as wayfinding; Struq treats them as a tell. The heading, a hairline and scale do the wayfinding.
2. **No gradients and no tinted fills at all,** not even the subtle same-hue ramps deck-design allows. A flat black scrim over a photo is the only translucent layer.
3. **No pills, no live dots, no uppercase marquees.**
4. **The canon first.** Palette, pairing and design system come from Struq's canon (step 4), not from a preset you write yourself; the brand's own colours and faces beat the canon.
5. **Never an empty frame.** deck-design allows a graded placeholder frame; Struq fills every slot from the beeldbank, or a generated fallback plate.
6. **The cinematic floor is mandatory, not "when the page calls for it":** Lenis on one GSAP clock, a SplitText hero, masked reveals, one showpiece, a WebGL hero layer with poster, a magnetic CTA, on every marketing site.
7. **No Inter anywhere,** including the two canon pairings that name it (`canon.mjs` swaps it), and no commercial face without a licence (its free stand-in instead).
8. **Exactly one stop.** The plan stops once for approval with the materials request, and never again; the canon picks are the defaults when the answer is a plain yes. deck-design's longer planning stays available in [references/direction.md](references/direction.md) for a long interactive session.

## When something goes wrong

- **The page does not scroll:** `<html>` has `lenis-stopped`? An overlay called `stop()` without `start()`. Otherwise the ticker is not driving Lenis: keep `SmoothScroll` as shipped. [references/setup.md](references/setup.md) §2.
- **A pin jerks on engage:** never `anticipatePin` with smooth scroll; `scrub: 1`. [references/pinning-scrub.md](references/pinning-scrub.md) §2.
- **Descenders clipped in the split headline:** the `.struq-line-mask` rule in globals.css gives them room; keep it.
- **Content stays invisible:** something removed `data-ready` handling or the `js` class script. Restore the layout and globals.css from `<skill-dir>/recipes/app/`.
- **Anything else in motion:** [references/pitfalls.md](references/pitfalls.md), symptom first.

## Depth, when a step needs it

Per client type (tension, type, palette fallback, motion, arc, the niche tells, the pack) [niche-packets.md](references/niche-packets.md) · Typography [typography.md](references/typography.md) · palettes and presets [vibe-presets.md](references/vibe-presets.md) · page arc and footer [page-architecture.md](references/page-architecture.md) · composition [composition.md](references/composition.md), on phones [mobile-composition.md](references/mobile-composition.md) · imagery and grading [imagery.md](references/imagery.md), the beeldbank [struq-imagery.md](references/struq-imagery.md) · reveals [scroll-reveals.md](references/scroll-reveals.md) · more showpieces [showcase.md](references/showcase.md), [pinning-scrub.md](references/pinning-scrub.md) · the feel layer [feel-layer.md](references/feel-layer.md) · nav and menus [nav-header.md](references/nav-header.md) · route transitions [route-transitions.md](references/route-transitions.md), loaders [loaders.md](references/loaders.md) · SVG motion [svg-motion.md](references/svg-motion.md) · pointer [micro-interactions.md](references/micro-interactions.md) · WebGL beyond the hero [webgl-r3f.md](references/webgl-r3f.md), [webgl-scenes.md](references/webgl-scenes.md), hero scenes [hero-scenes.md](references/hero-scenes.md) · brand from nothing [brand.md](references/brand.md) · SEO [seo.md](references/seo.md) · performance [performance.md](references/performance.md) · a long, interactive planning session [direction.md](references/direction.md).
