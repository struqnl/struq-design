# Brief Router: the decisions you fill into STRUQ.md

This file is a procedure, not a phase. [direction.md](direction.md) is the orchestrator and owns the order of work, the single contract file (`STRUQ.md`) and the one gate. The router supplies three pieces of it:

| Router part | Runs inside direction.md | What it produces |
|---|---|---|
| §1 Extract, §1b Wizard | Phase 0, **Intake** | the facts: buyer, fear, register, stack, mode, materials, scope |
| §2 Route | Phase 2, **Concept** (the tension) and phase 4, **Site plan** | NICHE, arc, reveals, showpieces, transitions, WebGL, copy budget, shot list |
| §3 Field map | the write-up before the gate | where each decision lands in STRUQ.md |

SYSTEM decisions (type, palette, icons, imagery, motion) are owned by [direction.md](direction.md) §4 only. §2 points there; it does not decide them a second time.

Where a brief is merely *silent* on a detail, **decide and record the assumption** under ASSUMPTIONS. A wrong but stated default beats a question that blocks the build. The wizard (§1b) is the one exception, reserved for when the plan-deciding facts themselves are missing.

If the brief is "fix or improve an existing site", [triage.md](triage.md) rules override this file: identity (brand color, copy, component primitives) is preserved and recorded under PRESERVED, and the router only re-decides execution.

If the brief asks for a **directed WebGL experience** (one continuous scene drives the whole page), direction.md phases 0 to 3 still run, then [../cinematic/README.md](../cinematic/README.md) takes over. Use this router only for the content, copy and asset decisions.

---

## 1. Extract: answer these nine from the brief, in order

Silent by default. With a usable brief, answer all nine without asking anything; whatever is missing becomes an assumption, and the materials request rides along in the single gate message ([direction.md](direction.md) §5).

1. **Who signs the check, and what is their business model?** This picks the genre row and the preset, by buyer and never by surface topic ([page-architecture.md](page-architecture.md) §2b). A legal-tech SaaS is a software launch page, not a legal-practice page.
2. **What is the visitor afraid of?** Write it as the TENSION line (convince / never signal). It drives everything else, so write it first.
3. **Register:** marketing or narrative (this skill), a directed cinematic experience ([../cinematic/README.md](../cinematic/README.md)), or dashboard and product UI (out of register: keep the type and surface rules, drop Lenis, cinematic durations and showpieces, per [SKILL.md](../SKILL.md)).
4. **Stack:** Next.js App Router (default) or Vite, with the installed majors read from `package.json` ([setup.md](setup.md) §0), never assumed. Record them on the `Stack:` line in STRUQ.md; Vite needs the [stack-targets.md](stack-targets.md) translations.
5. **Mode:** greenfield or remediation ([triage.md](triage.md) preserve-list applies).
6. **Existing brand?** Logo, colors, fonts, voice. Real assets override the preset's palette and type; the preset still supplies token structure, motion and tension. A named brand with no logo file is not a rebrand: [direction.md](direction.md) §2 (provisional wordmark, no renaming). Brand colours map onto the ladder by role, not by name ([direction.md](direction.md) §4).
7. **Existing content?** Copy and imagery on hand against what must be produced. This decides the shot list ([imagery.md](imagery.md) §4 sourcing ladder).
8. **Scope:** one-pager or multi-page; which pages; any sections the client demands (pricing, careers, booking). Multi-page puts full-screen route transitions on the table ([route-transitions.md](route-transitions.md)).
9. **Deadline or effort signal:** a "this week" brief caps the plan at the highest-leverage items (the ranking in [SKILL.md](../SKILL.md)); showpieces and WebGL need room.

---

## 1b. The wizard: when there is no usable brief

This is the only case that blocks before the gate. Switch from silent extraction to the wizard when the request is empty or vague ("make me a website", "I don't know what I want"), the user asks to be guided, or §1 questions 1 and 2 (buyer and visitor's fear) cannot be answered. Those two pick the genre and the tension and cannot be assumed safely; everything downstream of them can.

**Wizard rules:**

- **At most 3 rounds, at most 4 questions per round.** Anything still unknown after round 2 goes back to the assumption path. The wizard discovers the direction; it does not run a workshop.
- **Multiple choice with concrete options wherever possible.** If the harness has an interactive question tool (for example `AskUserQuestion` in Claude Code), use it: 2 to 4 options per question, multi-select for "what exists". Otherwise ask in plain text, options listed.
- **Ask in the user's world, never in designer vocabulary.** Not "serif or sans?", not "warm or cool palette?" The user picks scenes and outcomes; the router translates them to genre, tokens and motion.
- **Each round prunes the next.** Round 1 narrows to 2 or 3 candidate directions; round 2 picks between them; round 3 is never questions.

**Round 1: the project (always, 3 questions):**

1. *"What is this site for?"* Options as niche clusters, not industries: **sell a product** (skincare, food and drink, fashion: Product launch genre) · **promote a service or practice** (legal, medical, consulting, trades, real estate: Studio genre) · **show work** (portfolio, agency, photography, architecture: Portfolio genre) · **launch something** (product, campaign, game, record: Product launch or Campaign genre) · **a place people visit** (restaurant, hotel, gym, clinic: Campaign genre with the room as the hero) · **a cause or institution** (nonprofit, university: Campaign genre).
2. *"When the site works, what does a visitor do?"* **book** · **buy** · **hire or contact** · **sign up or wishlist** · **donate or apply**. This pins the Invite beat and the conversion posture.
3. *"What already exists?"* (multi-select) **logo or colors** · **written copy** · **photos or video** · **an existing site** ([triage.md](triage.md) rules) · **nothing yet**. This drives MATERIALS and the mode.

**Round 2: the feel (only what round 1 left open):**

4. *"Pick the room."* Three contrasting one-line scenes generated from the surviving candidate presets, plus one deliberate outlier. The scene *is* the preset choice; the user never sees the preset name. Example set for "show work":
   - *"A white gallery: huge quiet type, your work does the talking."* (Luxury Minimal)
   - *"Warm paper and ink: editorial, opinionated, a magazine about you."* (Warm Editorial)
   - *"A dark cinema: slow, heavy, one image at a time."* (Dark Cinematic)
   - *"Loud poster walls: thick type, hard edges."* (the outlier: the Brutalist genre appendix, taken only when the user picks this scene)

   For any other cluster, draw the scenes from the four presets: Soft Modern (*"a calm, exact studio: cool stone, one green note"*), Warm Editorial, Dark Cinematic, Luxury Minimal.
5. *"One long page, or several?"* Plus any must-have sections (pricing, menu, booking, careers). Demanded sections are reconciled against the arc in §2. "Several" switches on route transitions.
6. Optional, free text: *"Name one site or brand whose vibe you envy."* Used to bias type and palette *inside* the chosen preset, never to clone.

**Round 3: no questions.** Write STRUQ.md with its ASSUMPTIONS filled and go to the [direction.md](direction.md) §5 gate. The gate's one message is the only confirmation; edits are applied to the file, not re-interviewed.

**Cold start** ("I don't know what I want to make"): ask only question 1 reframed, *"What do you do, or what do you have?"* (a product, a practice, work to show, an event, a cause), then continue from question 2. The user does not need to know what a website is for; they know what they have.

---

## 2. Route: decisions in dependency order

Steps marked **SYSTEM** are decided in [direction.md](direction.md) §4; they are listed here only so the order is visible.

1. **Niche read.** Pick the genre row in [page-architecture.md](page-architecture.md) §2 and §2b (the niche-to-genre mapping), then choose the nearest preset in [vibe-presets.md](vibe-presets.md): **Soft Modern** (the default), **Warm Editorial**, **Dark Cinematic** or **Luxury Minimal**. **Brutalist** is a genre appendix, taken only when the brief declares the genre. Fill its seven axes with the TENSION written first. Primary preset = the buyer's; borrow at most TYPE *or* PALETTE from a second preset, never both and never anything else (not imagery, not motion). Both presets' "never signal" lines join the audit.
2. **Palette and tokens.** SYSTEM. The preset's palette unless real brand colors exist, in which case they pour into the preset's token structure.
3. **Type.** SYSTEM. Exactly two faces, picked in [typography.md](typography.md) Decide here: the Signature pairing that matches the brand's temperament first (it is usually the preset's own pairing), Extended only when no Signature temperament fits. Record the pairing id (S1 to S7, E1 to E6), its role weights, the one signature move and the hero entrance.
4. **Arc.** Start from the genre's inventory, then reconcile it with the client's demanded sections via [page-architecture.md](page-architecture.md): beats in the §1 order (Hook, Orient, Prove, Deepen, Invite); every section gets a beat or gets cut; 5 to 8 sections; density alternates; exactly one proof form; at least two grid-breaks marked.
5. **Reveals.** Name the reveals the build uses ([scroll-reveals.md](scroll-reveals.md)): which headlines get SplitText line masks, which blocks get the transform and autoAlpha stagger, what images do on entry. If the plan has drawn or morphing line art, note the [svg-motion.md](svg-motion.md) moment here. Lenis lerp is SYSTEM.
6. **Showpieces.** Budget 1 to 2 ids tagged `showpiece` in [showcase.md](showcase.md); ids tagged `system` (route curtain, menu, hero line rise and the like) do not count. Fewer is stronger, and for some genres 0 is correct (utility and brutalist pages, tight deadlines). Place each at an act break per [page-architecture.md](page-architecture.md) §3: a breather before it and after it (a showpiece is its own density class, so "breather, showpiece, breather" is the pattern, not two breathers in a row), never directly under the hero, never in the Invite beat, never back to back. Name the technique section ([pinning-scrub.md](pinning-scrub.md) §1 or §2, [depth-parallax.md](depth-parallax.md) §3) so the mobile fallback is planned, not patched. No real imagery? Prefer a type-led showpiece ([showcase.md](showcase.md) Choosing).
7. **Route transitions.** Multi-page: plan a full-screen transition and its variant ([route-transitions.md](route-transitions.md), with [page-entrances.md](page-entrances.md) for what happens after the curtain). One-pager: none, but reserve the hook if routes are coming. Loader yes or no from the genre's register (loaders suit narrative, portfolio and launch only, see [loaders.md](loaders.md)).
8. **WebGL gate.** Only if a section genuinely calls for it AND the deadline allows. If yes, plan the poster first and name the moment (what the user sees, where in the arc, the fallback, one gate for canvas and pin) per [webgl-r3f.md](webgl-r3f.md) §1 and [webgl-scenes.md](webgl-scenes.md) §5. **No model file?** Walk the ladder in [webgl-scenes.md](webgl-scenes.md) §4 ("No model file yet"): ask for the GLB in the gate, a declared primitive stand-in built to be replaced, or a downgrade to photography or a type-led showpiece; label the rung under ASSUMPTIONS. A whole page as one directed scene is [../cinematic/README.md](../cinematic/README.md) instead.
9. **Motion, icons, imagery grade.** SYSTEM. Motion is the [SKILL.md](../SKILL.md) baseline unless a deviation is recorded with its reason.
10. **Copy budget.** Per section, from [page-architecture.md](page-architecture.md) §5: hero h1 at most 8 words, no eyebrows, section headlines at most 10, body 2 to 4 sentences at 44 to 52ch, CTAs 2 to 4 verb-first words, exactly one manifesto line on the whole page.
11. **Shot list.** Per section: subject, grade, ratio and source (real, generate, treated stock), mapped onto the arc. The grade and ratio set come from SYSTEM; missing imagery is filled from the Struq beeldbank pack (struq-imagery.md) per [imagery.md](imagery.md) §4b.

---

## 3. Field map: where each decision lands in STRUQ.md

The template lives in [direction.md](direction.md). Every field is resolved or moved to ASSUMPTIONS; nothing ships as a placeholder.

| Decision | STRUQ.md field | Decided in |
|---|---|---|
| Stack, mode | `Stack:`, `Mode:` (header) | §1 questions 4 and 5 |
| What exists, what is missing | MATERIALS | §1 questions 6 and 7, or the wizard round 1 |
| Tension | CONCEPT `Tension:` | §1 question 2 |
| Buyer, genre, preset, borrowed field | SYSTEM `Niche:` | §2 step 1 |
| Type, palette, radius, icons, imagery, scroll, motion | SYSTEM | [direction.md](direction.md) §4 |
| Pages and slugs | PLAN `Pages:` | §1 question 8, [seo.md](seo.md) §1 |
| Arc rows, proof form, grid-breaks | PLAN `Arc:` | §2 step 4 |
| Reveals | PLAN `Reveals:` | §2 step 5 |
| Showpieces and system recipes | PLAN `Showpieces:`, `System recipes:` | §2 step 6 |
| Transitions, loader | PLAN `Transitions:` | §2 step 7 |
| WebGL | PLAN `WebGL:` | §2 step 8 |
| Copy budget | PLAN `Copy budget:` | §2 step 10 |
| Shot list | PLAN `Assets to produce:` | §2 step 11 |
| What a redesign keeps | PRESERVED | [triage.md](triage.md) |

Before the gate: the arc passes the [page-architecture.md](page-architecture.md) checklist, and every showpiece and system id exists in [showcase.md](showcase.md).

---

## 4. Load manifest: which reference files, at which step

Keyed to the workflow step names in [SKILL.md](../SKILL.md). The baseline block and leverage ranking are already in context. Load the rest when the step starts, never earlier:

| Workflow step | Load | Only if |
|---|---|---|
| 0 Detect versions | [setup.md](setup.md) §0 (with Known API shifts) | always |
| 1 Direction | [direction.md](direction.md), this file, [page-architecture.md](page-architecture.md), [vibe-presets.md](vibe-presets.md) (token contract and the chosen preset), [showcase.md](showcase.md); the Decide-here sections of [typography.md](typography.md) and [iconography.md](iconography.md); [brand.md](brand.md); [stack-targets.md](stack-targets.md); [triage.md](triage.md); the preset's hero entrance in [page-entrances.md](page-entrances.md); [webgl-r3f.md](webgl-r3f.md) §1 and [webgl-scenes.md](webgl-scenes.md) §4 ("No model file yet") and §5 | brand.md when there is no brand or no logo · stack-targets.md on Vite · triage.md on a redesign · page-entrances.md when the entrance is `match-cut-hero` or `clip-line-hero`, on any site · the WebGL sections when the brief asks for 3D (the poster, gate and fallback are planning decisions) |
| 2 Brand files and tokens | [brand.md](brand.md) §3 to §5, [typography.md](typography.md) §2 to §4 plus only the §5 recipes STRUQ.md names, [scaling.md](scaling.md), [imagery.md](imagery.md), [iconography.md](iconography.md) (full) | brand.md only when the brand was generated or the logo is provisional |
| 3 Structure and SEO | [seo.md](seo.md) | always |
| 4 Wire providers | [setup.md](setup.md); [route-transitions.md](route-transitions.md) and [page-entrances.md](page-entrances.md); [loaders.md](loaders.md) | route transitions on multi-page sites · loader only if PLAN says so |
| 5 Static layout | [nav-header.md](nav-header.md), [composition.md](composition.md), [mobile-composition.md](mobile-composition.md) | always |
| 6 Motion in layers | [pitfalls.md](pitfalls.md) (before the first tween), [scroll-reveals.md](scroll-reveals.md), [gsap-api.md](gsap-api.md), [feel-layer.md](feel-layer.md); [pinning-scrub.md](pinning-scrub.md) or [depth-parallax.md](depth-parallax.md); [svg-motion.md](svg-motion.md); [micro-interactions.md](micro-interactions.md); [transitions.md](transitions.md); [webgl-r3f.md](webgl-r3f.md), [webgl-scenes.md](webgl-scenes.md) | showpiece files only for the ids in PLAN · svg-motion.md only with SVG motion · transitions.md for section curtains and match cuts · WebGL files only if PLAN has a WebGL moment |
| 7 Optimize and sweep | [performance.md](performance.md), [anti-patterns.md](anti-patterns.md), the [seo.md](seo.md) checklist | always |
| 8 Verify | [anti-patterns.md](anti-patterns.md) tell scan (plus the TENSION's "never signal" line), [feel-layer.md](feel-layer.md) §5, [mobile-composition.md](mobile-composition.md) §4, [pitfalls.md](pitfalls.md) (descender test, pin checks), [performance.md](performance.md) §8 (port check, first-load JS, LCP probe, frame trace) | always; run against screenshots and the production server |

Two rules: the "never signal" line joins the verify sweep alongside the generic tells, and both must pass; and a file already loaded is not reloaded. The manifest is a ceiling, not a ritual.

---

## 5. Worked example

**Brief:** *"We're a specialty coffee roaster in Rotterdam. We roast weekly, run a small tasting bar, and want a site that sells beans online eventually. For now it should make us look like the best roaster in the city. We have a logo (black wordmark) and good photos of the roastery. Next.js. No copy written yet."*

The brief is usable (buyer and fear are answerable), so nothing blocks: §1 runs silently and the gate message asks for the roastery photo set. The STRUQ.md excerpt it produces:

```markdown
# STRUQ.md: Roastery (Rotterdam)

Mode: build
Stack: Next.js App Router · React · Tailwind · GSAP · Lenis, each with the installed major that package.json reports at step 0 (setup.md §0)

## MATERIALS
Have: black wordmark (SVG requested), roastery photo set (bar room, hands and pour, roaster machine)
Missing: all copy (written from the first draft, no lorem); roast bag and bean shots
  (filled from the beeldbank pack proof, struq-imagery.md); no numbers or quotes (no proof faked)

## CONCEPT
Idea: the site reads like a roast log: one week, one batch, written down by people who taste everything
Tension: convince "these people are obsessive about roasting and it tastes like it"
  / never signal "another kraft-paper artisan brand"
Motif: the roast date, set in the display face, stamped once per roast and once in the footer

## SYSTEM
Niche: food and drink product brand, buyer = the person buying beans · genre Product launch
  · preset Warm Editorial · borrowed: none (the tasting bar is a room, but imagery is not a
  borrowable field; Warm Editorial already carries the warmth)
Display: Fraunces 300, SOFT 50 (Google Fonts, OFL) · pairing S2
Text: Urbanist 400 body, 500 UI (Google Fonts, OFL)
  · roles per typography.md §3.1 S2: display 300, h2 300, h3 400, body 400
Signature move: soft-scrub (the roast date headline softens as the reader leaves the hero)
Hero entrance: Warm Editorial's soft-scrub plus line rise
Palette: light · --surface-0 #FAF6F0 --surface-1 #F3EDE2 --surface-2 #EAE1D2 --surface-3 #DFD3BF
  --ink #1E1A16 --ink-muted #5E554C --ink-faint #A59C8F (non-text only) --accent #7A2230
  --line rgb(30 26 22 / 0.14)
Radius: 2px buttons and frames
Icons: Struq Icons, @struq/icons, strokeWidth 1.5, accent = --color-accent (iconography.md §2 default)
Imagery: warm film grade, ratios 21/9, 4/5, 1/1, grain 0.04
Scroll: Lenis lerp 0.1 on gsap.ticker
Motion: baseline (micro 0.2 to 0.3s, hero 1.0 to 1.6s, exits power2.in, swaps
  quart-in-out, curtains quint-in-out); deviations: reveals power3.out 0.7 to 0.9s
  in place of expo.out (Warm Editorial's editorial-calm, its declared deviation)

## PLAN
Pages: / (one-pager now); /shop reserved in the nav
Arc (home):
  1 HERO      [Hook]    claim + bean macro bleeding off the right edge (grid-break 1), 14rem
  2 WHY       [Orient]  the manifesto line alone in 20rem of air (breather)
  3 ROASTS    [Prove]   the lineup: pin-horizontal-gallery, 4 roast frames, dense 6rem
  4 THE BAR   [Deepen]  one full-bleed room image overlapping into section 5 (grid-break 2),
                        hours under it, 16rem (breather)
  5 PROCESS   [Deepen]  roast-week rhythm, 3 hairline editorial rows, dense 6rem
  6 VISIT     [Invite]  address, hours, newsletter (shop CTA when /shop ships), footer
                        per page-architecture §4, 14rem
  Proof form: the roasts themselves. Pacing: vast, breather, dense, breather, dense, vast.
Reveals: hero h1 line-rise-hero then soft-scrub (the preset's named entrance) · rows and roast frames transform + autoAlpha stagger 0.08
  · images curtain-reveal · svg none
Showpieces: pin-horizontal-gallery at arc row 3 (breather 2 before it, breather 4 after it),
  mobile: native horizontal swipe with snap (pinning-scrub.md §2 and §4). Total 1.
System recipes: line-rise-hero, soft-scrub, curtain-reveal, fullscreen-menu
Transitions: none now (one-pager); route-curtain added when /shop ships · loader none (shop-bound)
WebGL: none
Copy budget: h1 at most 8 words ("Roasted Tuesday. Gone by Friday."), manifesto = row 2's
  line only, roast frames = name + 2 tasting words + origin, CTAs "Visit the bar", "Get the beans"
Assets to produce (8 images):
  1 hero bean macro, 21/9, generate on-brief
  4 roast bags, 1/1, shoot (beeldbank pack images until then)
  1 bar room, 21/9, existing set, regraded
  1 hands and pour, 4/5, existing set, regraded
  1 roaster machine, 4/5, existing set, regraded
  all through one warm film grading pass (imagery.md §1)

## ASSUMPTIONS
- "best roaster in the city" read as craft-serious: one accent (the preset's oxblood, not the
  cream-plus-terracotta reflex), no second accent
- wordmark stays black on cream (ink #1E1A16)
- the gallery runs on beeldbank pack images until the 4 roast shots exist, then swaps them in
- shop deferred: row 6 collects newsletter sign-ups instead of a cart
- one-pager now, /shop reserved in the nav
```

The gate message then reads: name, idea line, Fraunces and Urbanist (S2), soft-scrub as the signature move, the eight hex values, Struq Icons, the arc in one line, `pin-horizontal-gallery`, the five assumptions, and: "Veto anything? If you have the roast bag photos or real numbers (kilos a week, years roasting), send them now."

Note what the router did that a template could not: it kept the display face light in a consumer genre that pulls toward weight; it refused to borrow imagery from a hospitality direction because only TYPE or PALETTE may be borrowed; it spent exactly one showpiece and sat it between two breathers instead of under the hero; it deferred route transitions and the shop without losing their arc slots; and it turned "no copy written" into a copy-budget line instead of lorem. That judgment is the router's job; the reference files supply the raw material.
