# Direction: plan everything before the first component

Award-tier sites are decided before they are built. The logo, the one idea the site is about, the two typefaces, the palette, the icon family, the arc and the showpieces are made once, together, so every later choice can be checked against them. A build that discovers its direction while coding ends up with a Tailwind default and a nice hero.

This file is the orchestrator for **Build**, **Redesign** and the planning half of **Directed**. It runs seven phases, numbered 0 to 6, with one gate between planning and building. It writes one contract file, `STRUQ.md` in the project root, and that file is the only plan artifact: there is no second plan block, no separate brief document, no parallel folder for a normal build.

## The phases

| # | Phase | Output (a section of STRUQ.md) | Procedure | Skip when |
|---|---|---|---|---|
| 0 | **Intake** | header (Mode, Stack), MATERIALS | this file §1, with [brief-router.md](brief-router.md) §1 and §1b | never |
| 1 | **Brand** | BRAND | [brand.md](brand.md) | a brand exists (extract it, §2) |
| 2 | **Concept** | CONCEPT | this file §3; the tension from [brief-router.md](brief-router.md) §1 | never |
| 3 | **System** | SYSTEM | this file §4 (sole owner of type, palette, icons, imagery, motion) | never |
| 4 | **Site plan** | PLAN | [brief-router.md](brief-router.md) §2 | never |
| Gate | **Veto** | one message: summary, materials request, "Veto anything?" | this file §5 | the user said "just build it", or the run is non-interactive |
| 5 | **Build** | the site | [../SKILL.md](../SKILL.md) workflow steps 2 to 7 | |
| 6 | **Verify** | VERIFY | [../SKILL.md](../SKILL.md) workflow step 8 | never |

Phases 0 to 4 together are workflow step 1, **Direction**, in [../SKILL.md](../SKILL.md). Directed mode (`/struq direct`) runs phases 0 to 3 here, then hands over to [../cinematic/README.md](../cinematic/README.md), whose lean outputs are appended to the same STRUQ.md as a DIRECTION section.

**Scale the ceremony to the job.** A one-page site for an existing brand runs phases 0, 2, 3 and 4 in a few minutes. A new company with no name runs all of them. Never ask a question the brief already answers; never skip a phase because it feels obvious. Write the obvious answer down, because the later phases read it.

## 1. Intake

**One stop, not two.** With a usable brief, do not block here. Run the extraction in [brief-router.md](brief-router.md) §1 silently, record what exists under MATERIALS, record what is missing (and how each gap is handled) under MATERIALS and ASSUMPTIONS, and carry on to the gate. The request for materials goes inside the single gate message (§5). Block early only when the wizard trigger conditions in [brief-router.md](brief-router.md) §1b hold: no usable brief, a request to be guided, or no answer to "who buys" and "what are they afraid of".

What MATERIALS tracks:

- Name and logo (files, not descriptions)
- Brand colors and fonts, if any are fixed
- Real copy, or at least the facts: what it is, who it is for, what it costs, where it is
- Photos, product shots, video, 3D models
- Real numbers (clients, years, results) and real quotes, with permission
- An existing site (switch to Redesign: [triage.md](triage.md))
- One or two sites whose feel they envy

**Never invent proof.** Testimonials, client logos, stats and awards that do not exist are left out, not faked.

**Never write in a real person's or brand's voice.** On a site named after a real person or a real business:

- No first person attributed to them ("I make those decisions...") and no quotes in their name. Write in the studio's or the site's third-person voice.
- No biography, training, process or sourcing stated as fact ("trained as a production thrower", "eats at the restaurant before drawing", "clay dug in Alentejo") unless the brief says it.
- No catalogue facts: invented works, sizes, glazes, materials, prices, editions, sold-out states, stockists or client names.

When the layout needs that copy to exist, draft it as a labelled placeholder and list every drafted claim under ASSUMPTIONS ("Studio paragraph: drafted, replace with Ana's words"; "Work index: 8 entries drafted as layout copy, no prices, no client names"). A portfolio with no work list gets its entries drafted the same way, titled as layout copy, never as the record. The gate message names the drafts so the client can replace them.

**No real imagery yet.** Plan for it instead of papering over it:

- Prefer type-led showpieces (`manifesto-fill`, `scrub-headline`, `ghost-marquee`) over media-led ones; a horizontal gallery of placeholders is worse than a static grid ([showcase.md](showcase.md) Choosing).
- Every missing image becomes a shot-list line (subject, grade, ratio) under PLAN `Assets to produce`, so it can be shot, sourced or generated later ([imagery.md](imagery.md) §4).
- In the build, a missing image renders as a placeholder frame per [imagery.md](imagery.md) §4b: a graded tonal frame at the declared ratio, with the shot-list caption set in the eyebrow style. Never grey boxes, never random stock.

## 2. Brand

If there is no name or no logo, run [brand.md](brand.md). It produces a name shortlist with one recommendation, a wordmark and a mark as SVG, a favicon set, and one voice line; the OG image is built later, once routes exist ([seo.md](seo.md) §3). If a brand exists, extract it instead: logo file, the exact colors, the fonts, how they write. Existing brand assets always beat the preset; the preset still supplies the token structure they pour into.

| What exists | Run |
|---|---|
| Nothing | [brand.md](brand.md) in full |
| A name, no logo, no brand | [brand.md](brand.md) §1 and §3 to §5: skip naming |
| **A named brand (colours, a font, a voice) but no logo file** | Skip [brand.md](brand.md) §1 and §2: never rename, never reposition. Draw a **provisional** wordmark from the brand's own face ([brand.md](brand.md) §3), write it to the same paths (`brand/logo.svg`, `brand/mark.svg`) so the real logo drops in, and record it under ASSUMPTIONS: "Logo: provisional wordmark from <face>, replace with the brand file" |
| A full brand with logo files | Extract only; no [brand.md](brand.md) |

**Person-named sites skip naming.** Portfolios, studios named after a person, practices and clinics use the person's name. If the name is unknown, write a placeholder, record it under ASSUMPTIONS, skip [brand.md](brand.md) §2 and go straight to the wordmark (§3 there).

## 3. Concept

The concept is what makes the site feel authored instead of assembled. Write three lines:

- **Idea:** one sentence the whole site is about, specific to this client. Not "modern and clean"; "every page is a quiet room with one object in it" or "the site moves like a slow pan across a construction drawing".
- **Tension:** what the visitor needs to feel (convince) and what the site must never signal (never). From [brief-router.md](brief-router.md) §1 question 2.
- **Motif:** the one recurring visual device that carries the idea through the page. A line that draws through every section, a frame that every image sits in, a numeral system, a crop direction, a mark that morphs. One motif, used everywhere, beats five effects used once.

Every later decision gets checked against these three lines. If a showpiece or effect does not serve the idea or the motif, it goes.

## 4. System

This section is the only place SYSTEM is decided. Other files point here.

**Read budget.** During planning, read only the Decide-here section at the top of [typography.md](typography.md) and of [iconography.md](iconography.md), the token contract and the one chosen preset in [vibe-presets.md](vibe-presets.md), and the grade table in [imagery.md](imagery.md) §1. Two more reads are planning reads, not build reads, when they apply: the preset's **hero entrance** recipe ([page-entrances.md](page-entrances.md) for `match-cut-hero` and `clip-line-hero`, on any site), and, when the brief asks for 3D, the **WebGL plan** ([webgl-r3f.md](webgl-r3f.md) §1 and [webgl-scenes.md](webgl-scenes.md) §5: poster, gate, touch fallback, and the "No model file yet" ladder in §4). Read the full files during the build (workflow step 2), not now.

Decide in this order:

0. **Niche.** Buyer, genre and preset from [brief-router.md](brief-router.md) §2 step 1, plus the one borrowed field (TYPE or PALETTE) if any.
1. **Type.** Exactly two faces: display (run light, 300 to 400, unless the concept is a declared heavy genre) and text. Take a pairing id from the brand's temperament per [typography.md](typography.md) Decide here: Signature (S1 to S7) first, Extended (E1 to E6) only when no Signature temperament fits. "Unsure" is not a temperament and never a reason to take S1. Name the faces, the role weights, the source and the license, the **one signature move** ([typography.md](typography.md) §5) and the **hero entrance** (the preset's named entrance, or a declared different one).
2. **Palette.** Surface ladder (four steps), ink tiers (ink, muted, faint), one accent and the line color, written as tokens. Existing brand colors pour into this structure. Add the radius. [vibe-presets.md](vibe-presets.md)

   **Brand colours onto the ladder.** A brand's colour names are not token names: brand "ink" usually means the brand's dark, while `--color-ink` is the *text* colour. Map by role, never by name:

   | Brand colour | On a light preset | On a dark preset |
   |---|---|---|
   | The brand's dark | `ink` (text), and the inverted surfaces | `surface-0` (the page); `ink` becomes an off-white |
   | The brand's light | `surface-0` (the page) | `ink` (text) |
   | The brand's accent | `accent` | `accent` |

   Derive the rest of the ladder from the mapped pair (surfaces step toward the ink, muted and faint tiers mixed from ink). Check the accent against `surface-0`: 4.5:1 or better and it may be text (links); 3:1 or better and it may set large type and UI; below that it is fills and rules only. Write which under SYSTEM.
3. **Icons.** One icon family for the whole site, chosen by the order in [iconography.md](iconography.md) §2: the brand's own set, else Struq Icons. Name the package, the stroke and how its accent maps to the palette.
4. **Imagery.** One grade, the declared ratio set (2 to 3), grain yes or no. [imagery.md](imagery.md)
5. **Scroll and motion.** Lenis lerp (or native, with the reason). Motion is the baseline MOTION line in [../SKILL.md](../SKILL.md) by default: write "baseline". Any other duration band or ease pair, including the alternative pairs in [feel-layer.md](feel-layer.md) §3, is an allowed deviation only when it is written here with its reason.

## 5. The gate

Write `STRUQ.md` (template below), then send one message with: the name, the idea line, the two typefaces and pairing id, the signature move and hero entrance, the palette as hex, the icon family, the arc as one line, the showpiece ids, the open assumptions, and the materials request. End it with exactly this:

> **Veto anything? If you have a logo, photos or real numbers, send them now.**

Apply edits and new materials to the file; do not re-interview. This is the only stop between the brief and the build (the wizard in [brief-router.md](brief-router.md) §1b is the one exception, and it runs before this gate, not instead of it).

If the user said "just build it", or the run is non-interactive, write the file, state the assumptions at the top and continue.

## 6. During the build

`STRUQ.md` is the contract. Before each workflow step, re-read the section it depends on. If a decision has to change during the build (a font does not have the weight, an asset is missing), change it **in the file first**, with one line under LOG saying why, then change the code. A site that drifts from its own plan is how a directed build turns back into a template.

After verify, append the score and the open issues under VERIFY.

## STRUQ.md template

```markdown
# STRUQ.md: <project name>

Mode: build | redesign | directed
Stack: <Next.js | Vite> <installed major> · React <major> · Tailwind <major> · GSAP <x.y> · Lenis <major> · three <0.x> (if used), read from package.json (setup.md §0); Vite translations per stack-targets.md

## MATERIALS
Have: <logo, copy, photos, numbers, quotes>
Missing: <list, with how each gap is handled>
References: <sites the client envies, and what to take from each>

## BRAND
Name: <name> (shortlist and rationale in brand/NAMING.md, if generated)
Logo: brand/logo.svg (wordmark), brand/mark.svg (mark), app/icon.svg, app/apple-icon.png
OG: app/opengraph-image.tsx, plus one per shared route (seo.md §3)
Voice: <one line, e.g. "plain, certain, a little dry; short sentences; no exclamation marks">

## CONCEPT
Idea: <one sentence>
Tension: convince <...> / never signal <...>
Motif: <the one recurring device>

## SYSTEM
Niche: <buyer + business model> · genre <Portfolio | Studio | Product launch | Campaign>
  · preset <Soft Modern | Warm Editorial | Dark Cinematic | Luxury Minimal | Brutalist (genre appendix, declared genre only)>
  [+ borrowed TYPE or PALETTE from <preset>]
Display: <face> <weight> (<source>, <license>) · pairing <S1 to S7 | E1 to E6>
Text: <face> <weights> (<source>, <license>)
Signature move: <weight-in | soft-scrub | type-mask-media | fit-width-wordmark | cropped display>
Hero entrance: <the preset's named entrance, or a declared different one>
Palette: <light | dark> · --surface-0 #... --surface-1 #... --surface-2 #... --surface-3 #...
  --ink #... --ink-muted #... --ink-faint #... (non-text only) --accent #... --line <...>
Radius: <n>px
Icons: <family, package, stroke> (default: Struq Icons, @struq/icons, strokeWidth 1.5, accent = --color-accent)
Imagery: <grade>, ratios <2 to 3>, grain <opacity | none>
Scroll: Lenis lerp <the preset's stated value | native, because ...> on gsap.ticker
Motion: baseline | deviations: <each one, with its reason>

## PLAN
Pages: <list with slugs>
Arc (home): <numbered rows: section [beat] note, spacing role>; proof form; grid-breaks
Reveals: headlines <...> · blocks <...> · images <...> · svg <moment | none>
Showpieces: <showpiece ids, arc row, mobile fallback> (1 to 2, breathers on both sides; a showpiece is its own density class, page-architecture.md §3)
System recipes: <system ids: line-rise-hero, route-curtain, fullscreen-menu ...>
Transitions: <route-curtain variant | none>, loader <yes | no>
WebGL: <none | the moment, its poster, its fallback>
Copy budget: <per section>
Assets to produce: <shot list: subject, grade, ratio, source>

## PRESERVED (redesign only)
- <what will not be touched: brand color, copy, component primitives>

## ASSUMPTIONS
- <every decision made without the user's input>
- <every drafted claim: copy in a real person's or brand's name, catalogue entries, a provisional logo, a 3D stand-in>

## LOG
- <date> <decision changed and why>
- <date> <API>: installed <pkg major> differs from the skill's code; adapted to <change> (setup.md §0)

## VERIFY
Server: next start on :<port>, port owner confirmed
Viewports: 390, 768, 1440, 1920
Score: <n>/100 · LCP <s> (element) CLS <n> INP <ms | field data pending> · first-load JS <n> kB gzip
Motion: pins engaged slow and fast <ok>, descender test <ok>, frame trace <ok>
Open: <issues>
```

Directed mode appends `## DIRECTION` after PLAN, per [../cinematic/README.md](../cinematic/README.md).
