# Direction: plan everything before the first component

Award-tier sites are decided before they are built. The logo, the one idea the site is about, the two typefaces, the palette, the icon family, the arc and the showpieces are made once, together, so every later choice can be checked against them. A build that discovers its direction while coding ends up with a Tailwind default and a nice hero.

This file is the orchestrator for **Build** and **Redesign**. It runs six phases in order, writes one contract file (`STRUQ.md` in the project root) and stops once for a yes before any code is written.

## The phases

| # | Phase | Output (a section of STRUQ.md) | Reference | Skip when |
|---|---|---|---|---|
| 0 | **Intake** | MATERIALS: what exists, what is missing | this file, §1 | never |
| 1 | **Brand** | BRAND: name, logo, mark, voice line | [brand.md](brand.md) | a brand exists (extract it instead) |
| 2 | **Concept** | CONCEPT: the one idea, the tension, the metaphor | this file, §3 | never |
| 3 | **System** | SYSTEM: type, palette, icons, imagery grade, motion character | [typography.md](typography.md), [vibe-presets.md](vibe-presets.md), [iconography.md](iconography.md), [imagery.md](imagery.md) | never |
| 4 | **Site plan** | PLAN: arc, showpieces, transitions, WebGL gate, copy budget, assets | [brief-router.md](brief-router.md) | never |
| ⏸ | **Gate** | Show the summary, ask once: "Veto anything?" | this file, §5 | the user said "just build it" |
| 5 | **Build** | the site | [../SKILL.md](../SKILL.md) workflow | |
| 6 | **Verify** | VERIFY: screenshots, tell scan, feel audit, score | [anti-patterns.md](anti-patterns.md), [feel-layer.md](feel-layer.md) §5 | never |

Phases 2 to 4 are the [brief-router.md](brief-router.md) procedure; this file wraps it with intake, brand and the gate, and fixes where the result is written.

**Scale the ceremony to the job.** A one-page site for an existing brand runs phases 0, 2, 3 and 4 in a few minutes. A new company with no name runs all of them. Never ask a question the brief already answers; never skip a phase because it feels obvious. Write the obvious answer down, because the later phases read it.

## 1. Intake

Ask once, in one message, for what exists. If the harness has an interactive question tool, use it with multi-select.

- Name and logo (files, not descriptions)
- Brand colors and fonts, if any are fixed
- Real copy, or at least the facts: what it is, who it is for, what it costs, where it is
- Photos, product shots, video, 3D models
- Real numbers (clients, years, results) and real quotes, with permission
- An existing site (switch to Redesign: [triage.md](triage.md))
- One or two sites whose feel they envy

Record answers under MATERIALS. **Never invent proof.** Testimonials, client logos, stats and awards that do not exist are left out, not faked. Missing imagery becomes a placeholder list with subject, grade and ratio, so it can be shot, sourced or generated later ([imagery.md](imagery.md) §4).

## 2. Brand

If there is no name or no logo, run [brand.md](brand.md). It produces a name shortlist with one recommendation, a wordmark and a mark as SVG, a favicon set and an OG image, plus one voice line. If a brand exists, extract it instead: logo file, the exact colors, the fonts, how they write. Existing brand assets always beat the preset; the preset still supplies the token structure they pour into.

## 3. Concept

The concept is what makes the site feel authored instead of assembled. Write three lines:

- **Idea:** one sentence the whole site is about, specific to this client. Not "modern and clean"; "every page is a quiet room with one object in it" or "the site moves like a slow pan across a construction drawing".
- **Tension:** what the visitor needs to feel (convince) and what the site must never signal (never). From [brief-router.md](brief-router.md) §1 question 2.
- **Motif:** the one recurring visual device that carries the idea through the page. A line that draws through every section, a frame that every image sits in, a numeral system, a crop direction, a mark that morphs. One motif, used everywhere, beats five effects used once.

Every later decision gets checked against these three lines. If a showpiece or effect does not serve the idea or the motif, it goes.

## 4. System

Decide in this order, each from its reference:

1. **Type.** Exactly two faces: display (run light, 300 to 400, unless the concept is a declared heavy genre) and text. Name the faces, the weights, the source and the license. [typography.md](typography.md)
2. **Palette.** Surface ladder, ink tiers, one accent, written as tokens. Existing brand colors pour into this structure. [vibe-presets.md](vibe-presets.md)
3. **Icons.** One family for the whole site, chosen by the resolution order in [iconography.md](iconography.md) §2. Name the package and the weight.
4. **Imagery.** One grade, the declared ratio set, the treatment. [imagery.md](imagery.md)
5. **Motion character.** Lenis lerp, duration band, ease pair, reduced-motion behavior. [feel-layer.md](feel-layer.md)

## 5. The gate

Write `STRUQ.md` (template below) and show the user a short summary: name, the idea line, the two typefaces, the palette swatches as hex, the icon family, the arc as one line, the showpiece ids, and the open assumptions. Ask exactly one question: **"Veto anything?"** Apply edits to the file; do not re-interview.

If the user said "just build it", or the run is non-interactive, write the file, state the assumptions at the top and continue.

## 6. During the build

`STRUQ.md` is the contract. Before each workflow step, re-read the section it depends on. If a decision has to change during the build (a font does not have the weight, an asset is missing), change it **in the file first**, with one line under LOG saying why, then change the code. A site that drifts from its own plan is how a directed build turns back into a template.

After verify, append the score and the open issues under VERIFY.

## STRUQ.md template

```markdown
# STRUQ.md: <project name>

Mode: build | redesign | directed
Stack: Next.js App Router + Tailwind v4 | Vite

## MATERIALS
Have: <logo, copy, photos, numbers, quotes>
Missing: <list, with how each gap is handled>
References: <sites the client envies, and what to take from each>

## BRAND
Name: <name> (shortlist and rationale in brand/NAMING.md, if generated)
Logo: brand/logo.svg (wordmark), brand/mark.svg (mark), app/icon.svg, app/apple-icon.png, app/opengraph-image.png
Voice: <one line, e.g. "plain, certain, a little dry; short sentences; no exclamation marks">

## CONCEPT
Idea: <one sentence>
Tension: convince <...> / never signal <...>
Motif: <the one recurring device>

## SYSTEM
Display: <face> <weight> (<source>, <license>)
Text: <face> <weights> (<source>, <license>)
Palette: --surface-0 #... --surface-1 #... --ink #... --ink-muted #... --accent #...
Icons: <family, package, weight>
Imagery: <grade>, ratios <...>
Motion: Lenis lerp <...>, reveals <duration band>, eases <entrance / exit>, reduced motion <...>

## PLAN
Pages: <list>
Arc (home): <section, section, section ...> with beats
Showpieces: <showcase ids and where they sit>
Transitions: <route-curtain variant | none>, loader <yes/no>
WebGL: <none | the moment, its poster, its fallback>
Copy budget: <per section>
Assets to produce: <shot list>

## ASSUMPTIONS
- <every decision made without the user's input>

## LOG
- <date> <decision changed and why>

## VERIFY
Score: <n>/100
Open: <issues>
```
