# Brief Router: client brief → build plan

Run this **first** on any briefed build. It converts a plain-English client brief into the standard BUILD PLAN (§3), with every downstream decision made once, up front: the two typefaces, the palette, the scroll foundation, which reveals, which showpieces, whether there are full-screen route transitions, and whether a WebGL moment is warranted. It also names the exact reference files to load at each workflow step (§4), so nothing is read twice and nothing load-bearing is skipped. Two entry modes: a brief exists, so extract silently (§1); or there is no brief, or the user does not know what they want, so the wizard interviews for one (§1b). Either way the output is the same plan.

The router is a reasoning procedure, not a form: where a brief is merely *silent* on a detail, **decide and record the assumption**. Assumptions are listed for the client to veto, and a wrong-but-stated default beats a question that blocks the build. The wizard (§1b) is the deliberate exception, reserved for when the plan-deciding facts themselves are missing.

If the brief is "fix/improve an existing site," this file still runs, but [triage.md](triage.md) rules override it: identity (brand color, copy, component primitives) is preserved, and the router only re-decides execution.

If the brief asks for a **directed WebGL experience** (one continuous scene that drives the whole page, rather than sections with an occasional 3D moment), do not build it from this plan. Hand off to the cinematic mode at [../cinematic/README.md](../cinematic/README.md) and use this router only for the content, copy and asset decisions.

---

## 1. Extract: answer these nine from the brief, in order

1. **Who signs the check, and what is their business model?** This picks the genre row and the preset direction, by buyer and never by surface topic ([page-architecture.md](page-architecture.md) §2b). A legal-tech SaaS is a software launch page, not a legal-practice page.
2. **What is the visitor afraid of?** Write it as the plan's TENSION line (convince / never signal). It drives everything else, and it is the one decision the free path derives from scratch, so write it first.
3. **Register:** marketing/narrative (this skill), a directed cinematic experience (→ [../cinematic/README.md](../cinematic/README.md)), or dashboard/product UI (out of register: keep the type + surface rules, drop Lenis/cinematic/showpieces, per [SKILL.md](../SKILL.md))?
4. **Stack:** Next.js App Router (default) or Vite/other → [stack-targets.md](stack-targets.md) translations needed?
5. **Mode:** greenfield or remediation (→ [triage.md](triage.md) preserve-list applies)?
6. **Existing brand?** Logo, colors, fonts, voice. If real assets exist, they override the preset's palette and type; the preset still supplies token structure, motion, and tension.
7. **Existing content?** Copy and imagery on hand vs to be produced. This decides the ASSETS section: what gets written/shot/generated ([imagery.md](imagery.md) §4 sourcing ladder).
8. **Scope:** one-pager vs multi-page; which pages; any hard sections the client demands (pricing, careers, booking). Multi-page means full-screen route transitions are on the table ([route-transitions.md](route-transitions.md)).
9. **Deadline/effort signal:** a "this week" brief caps the plan at the highest-leverage items (the ranking in [SKILL.md](../SKILL.md)); showpieces and WebGL need room.

---

## 1b. The wizard: when there is no brief (or the user does not know yet)

Switch from silent extraction to the wizard when: the request is empty or vague ("make me a website", "I don't know what I want"), the user asks to be guided, or §1's questions 1 and 2 (buyer + visitor's fear) are unanswerable. Those two pick the genre and tension and cannot be assumed safely; everything downstream of them can.

**Wizard rules:**

- **≤3 rounds, ≤4 questions per round.** Anything still unknown after round 2 goes back to the assumption path. The wizard discovers the direction, it does not run a workshop.
- **Multiple-choice with concrete options wherever possible.** If the harness has an interactive question tool (e.g. `AskUserQuestion` in Claude Code), use it: 2 to 4 options per question, multi-select for "what exists." Otherwise ask in plain text, options listed.
- **Ask in the user's world, never in designer vocabulary.** Not "serif or sans?", not "warm or cool palette?" The user picks scenes and outcomes; the router translates to genre, tokens, and motion. The translation is the router's job, not the user's.
- **Each round prunes the next.** Round 1 narrows to 2 or 3 candidate directions; round 2 picks between them; round 3 is never questions, it is the draft plan.

**Round 1: the project (always, 3 questions):**

1. *"What is this site for?"* Options as niche clusters, not industries: **sell a product** (skincare, food/bev, fashion → Product launch genre) · **promote a service or practice** (legal, medical, consulting, trades, real estate → Studio genre) · **show work** (portfolio, agency, photography, architecture → Portfolio genre) · **launch something** (product, campaign, game, record → Product launch or Campaign genre) · **a place people visit** (restaurant, hotel, gym, clinic → Campaign genre with the room as the hero) · **a cause or institution** (nonprofit, university → Campaign genre).
2. *"When the site works, what does a visitor do?"* **book** · **buy** · **hire/contact** · **sign up/wishlist** · **donate/apply**. (This pins the Invite beat and the conversion posture.)
3. *"What already exists?"* (multi-select) **logo/colors** · **written copy** · **photos or video** · **an existing site** (→ [triage.md](triage.md) rules) · **nothing yet**. (Drives ASSETS and mode.)

**Round 2: the feel (only what round 1 left open):**

4. *"Pick the room."* Three contrasting one-line scenes generated from the surviving candidate directions, plus one deliberate outlier. The scene *is* the preset choice; the user never sees the preset name. Example set for "show work":
   - *"A white gallery: huge quiet type, your work does the talking."* (→ light, architecture/photography energy)
   - *"Warm paper and ink: editorial, opinionated, a magazine about you."* (→ warm editorial, agency/portfolio-light)
   - *"A dark cinema: slow, heavy, one image at a time."* (→ dark portfolio/music energy)
   - *"Loud poster walls: thick type, hard edges."* (→ the outlier; brutalist-leaning)
5. *"One long page, or several?"* Plus any must-have sections (pricing, menu, booking, careers). Demanded sections get reconciled against the arc in §2. "Several" switches on route transitions in the plan.
6. Optional, free text: *"Name one site or brand whose vibe you envy."* Used to bias type/palette *inside* the chosen direction, never to clone.

**Round 3: confirm, don't ask:** emit the draft BUILD PLAN (§3) with its ASSUMPTIONS block filled, and ask exactly one thing: *"Veto anything?"* Edits are applied to the plan, not re-interviewed.

**Cold start** ("I don't know what I want to make"): ask only question 1 reframed, *"What do you do, or what do you have?"* (a product, a practice, work to show, an event, a cause), then continue from question 2. The user does not need to know what a website is for; they know what they have.

---

## 2. Route: decisions in dependency order

1. **Niche read.** Pick the genre row in [page-architecture.md](page-architecture.md) §2 using the §2b mapping, then choose the nearest preset in [vibe-presets.md](vibe-presets.md) and fill its seven axes, with the TENSION written first. Primary = the buyer; borrow at most TYPE *or* PALETTE from a secondary preset, never both. The tension's "never signal" line from both joins the audit. Ready-made niche packets that pre-solve this step per industry are part of Struq Pro; the free path here is complete on its own.
2. **Palette and tokens.** The preset's palette and token structure are the vibe. When real brand assets exist, they replace the preset palette and the preset supplies the token *structure* the brand colors pour into (surface ladder, ink tiers, one accent).
3. **Type.** Exactly two typefaces: a **display face run light (300 to 400)** and a **text face**. Heavy display (600+) is a declared genre choice only, never the default. Pairing, fluid scale and SplitText typography are in [typography.md](typography.md); body size comes from the baseline. If the brand owns its fonts, they win and the weight rule is applied to them.
4. **Arc.** Start from the genre's inventory, then reconcile with the client's demanded sections via [page-architecture.md](page-architecture.md): every section gets a beat or gets cut; 5 to 8 sections; density alternates; exactly one proof form.
5. **Scroll foundation.** Lenis driven by the GSAP ticker as a single clock ([setup.md](setup.md) §2) unless the genre calls for native scroll (brutalist/utility); record the lerp. Then name the **reveals** that will be used ([scroll-reveals.md](scroll-reveals.md)): which headlines get SplitText line masks, which blocks get the transform + autoAlpha stagger, what images do on entry. If the plan includes drawn or morphing line art, note the [svg-motion.md](svg-motion.md) moment here too.
6. **Showpieces.** Budget 1 to 2 recipes, picked **by id from [showcase.md](showcase.md)** (for example `pin-horizontal-gallery`). Fewer is stronger, and for some genres 0 is correct (utility and brutalist pages, tight deadlines). Place each at an act-break per [page-architecture.md](page-architecture.md) §3, flanked by breathers, never in the Invite beat, never back-to-back. Name the technique file ([pinning-scrub.md](pinning-scrub.md) §1/§2, [depth-parallax.md](depth-parallax.md) §3) so its mobile fallback is planned, not patched.
7. **Route transitions.** Multi-page site: plan a full-screen transition and pick its variant ([route-transitions.md](route-transitions.md), with [page-entrances.md](page-entrances.md) for what happens after the curtain). One-pager: none, but reserve the hook if routes are coming. Loader yes/no from the genre's register (loaders suit narrative/portfolio/launch only, see [loaders.md](loaders.md)).
8. **WebGL gate.** Only if a section genuinely calls for it AND the deadline allows. If yes, plan the poster first, and name the moment (what the user sees, where in the arc, what the fallback is) in [webgl-r3f.md](webgl-r3f.md); scene recipes (Drei helpers, postprocessing, interactive 3D) are in [webgl-scenes.md](webgl-scenes.md). If the whole page should be one directed scene, that is [../cinematic/README.md](../cinematic/README.md) instead.
9. **Motion spec.** Duration band, ease pair, and reduced-motion behavior, straight from the preset ([feel-layer.md](feel-layer.md)).
10. **Copy budget.** Per section, from [page-architecture.md](page-architecture.md) §5: hero h1 ≤8 words, eyebrows 1 to 3 words, section headlines ≤10, body 2 to 4 sentences at 44 to 52ch, CTAs 2 to 4 verb-first words, exactly one manifesto line on the whole page.
11. **Asset list.** Fonts (with source), one Iconify family ([iconography.md](iconography.md) §2), `noise.png` if the grade calls for grain, and a per-section shot/generation list: subject + grade + ratio from the preset's imagery direction mapped onto the arc.

---

## 3. The BUILD PLAN (the router's output: fill and show before building)

Emit this block, filled, as the first artifact of the engagement. It is the contract for the whole build; every later step references it instead of re-deciding.

```
BUILD PLAN: <client>

STACK        <Next.js App Router | Vite (→ stack-targets.md)> · MODE <greenfield | remediation (triage rules ON)>
NICHE        <buyer + business model> · genre <Portfolio | Studio | Product launch | Campaign>
             · preset <name from vibe-presets.md> [+ borrowed <TYPE|PALETTE> from <preset>]
TENSION      convince: "<...>" / never signal: "<...>"
PALETTE      <light|dark> · surfaces <#..#..#..#..> · ink/muted/faint <#../#../#..>
             accent <#..> · line <...> · radius <n>px
TYPE         DISPLAY <face> @ <300-400> (+ why, if heavier is declared) · TEXT <face> @ <400>
             body <n>rem · fluid display scale per typography.md
SCROLL       Lenis lerp <n | native, because ...> on the gsap.ticker (one clock, setup.md §2)
MOTION       durations <band> · eases <pair> · loader <preset|none>
             reduced-motion: gate transforms, keep opacity
REVEALS      headlines <SplitText line masks | ...> · blocks <transform + autoAlpha stagger | ...>
             · images <entry behaviour> · svg <DrawSVG/MorphSVG moment | none>
SHOWPIECES   <showcase id> at ARC row <n>, mobile fallback <...>
             [<second showcase id> at ARC row <n> | none: why]      (1 to 2 total, not adjacent)
TRANSITIONS  <full-screen route transition variant | none (one-pager)>
WEBGL        <none | moment: what, where in the arc, poster + fallback>
             (webgl-r3f.md + webgl-scenes.md; whole-page directed scene → ../cinematic/)

ARC          1 <SECTION>   [Hook]    <skeleton note>, <spacing role>
             2 <SECTION>   [Orient]  ...
             3 <SECTION>   [Prove]   ... (proof form: <the ONE>)
             4 <SECTION>   [Deepen]  ★ showpiece: <id | none, why>
             5 <SECTION>   [Invite]  footer anatomy per page-architecture §4
             (5 to 8 rows; density alternates; ≥2 grid-breaks marked)

COPY BUDGET  hero h1 ≤8w · manifesto 1 line · eyebrows 1-3w · headlines ≤10w
             body 2-4 sentences @44-52ch · CTAs 2-4w verb-first
             <per-section deltas if any>

ASSETS       fonts: <faces + source (Google | Fontshare self-host)>
             icons: <one Iconify family + why it fits the brand>
             grain: <yes/no> · grade: <name> · ratios: <set>
             images: <n>, per section: <subject, ratio, source (real|generate|treated stock)>
             video/webgl: <spec + poster | none>

ASSUMPTIONS  - <everything guessed from a silent brief; the client can veto each>

LOAD ORDER   <the §4 phases this build actually needs, trimmed>
```

Rules for the block: no field left as a placeholder (every `<>` is resolved or moved to ASSUMPTIONS); the ARC rows must pass the [page-architecture.md](page-architecture.md) checklist before the plan ships; showpiece ids must exist in [showcase.md](showcase.md); if remediation, add a PRESERVED line naming what will not be touched.

---

## 4. Load manifest: which reference files, at which step

The baseline block and leverage ranking are already in context via [SKILL.md](../SKILL.md). Load the rest **per phase, only when the phase starts**. The plan above is designed so early phases do not need late files:

| Workflow step | Load | Only if |
|---|---|---|
| Router (this) | [page-architecture.md](page-architecture.md), [vibe-presets.md](vibe-presets.md), [showcase.md](showcase.md) | always, together: architecture sets the arc, the preset sets the language, the catalog supplies showpiece ids |
| 0 stack/mode | [stack-targets.md](stack-targets.md) / [triage.md](triage.md) | Vite/other · remediation |
| 2 tokens | [typography.md](typography.md), [scaling.md](scaling.md), [imagery.md](imagery.md), [iconography.md](iconography.md) | typography.md always (it holds the two-face system) |
| 3 providers | [setup.md](setup.md); [route-transitions.md](route-transitions.md) + [page-entrances.md](page-entrances.md); [loaders.md](loaders.md) | route transitions on multi-page sites · loader only if the plan says so |
| 4 static build | [nav-header.md](nav-header.md), [composition.md](composition.md), [mobile-composition.md](mobile-composition.md) | n/a |
| 5 motion | [scroll-reveals.md](scroll-reveals.md), [gsap-api.md](gsap-api.md), [feel-layer.md](feel-layer.md); [pinning-scrub.md](pinning-scrub.md) / [depth-parallax.md](depth-parallax.md); [svg-motion.md](svg-motion.md); [micro-interactions.md](micro-interactions.md); [transitions.md](transitions.md) | showpiece files only for the recipes in the plan · svg-motion.md only if the plan has SVG motion · transitions.md for section curtains/match-cuts |
| 5b WebGL | [webgl-r3f.md](webgl-r3f.md), [webgl-scenes.md](webgl-scenes.md) | plan says so; whole-page directed scene → [../cinematic/README.md](../cinematic/README.md) |
| 6 to 7 audit | [anti-patterns.md](anti-patterns.md) (+ the TENSION's "never signal" line re-read), [feel-layer.md](feel-layer.md) §5, [mobile-composition.md](mobile-composition.md) §4 | always; run against screenshots |

Two rules: the plan's **"never signal" line joins the step-6 sweep** alongside the generic gallery, and both must pass; and if a phase's file was already loaded, don't reload. The manifest is a ceiling, not a ritual.

---

## 5. Worked example

**Brief:** *"We're a specialty coffee roaster in Rotterdam. We roast weekly, run a small tasting bar, and want a site that sells beans online eventually. For now it should make us look like the best roaster in the city. We have a logo (black wordmark) and good photos of the roastery. Next.js. No copy written yet."*

```
BUILD PLAN: Roastery (Rotterdam)

STACK        Next.js App Router · MODE greenfield
NICHE        food/bev product brand, buyer = the person buying beans · genre Product launch
             · preset: warm editorial light [+ borrowed IMAGERY warmth notes from a
             hospitality direction, since the tasting bar is a room, not just a product]
TENSION      convince: "these people are obsessive about roasting and it tastes like it"
             / never signal: "another kraft-paper 'artisan' brand"
PALETTE      light · surfaces #FAF6ED #F3ECDC #EADFC8 #DCCFAF · ink #1E1B14
             muted #5C5645 · faint #999076 · accent #D8401F · accent-2 dropped
             (brief reads craft-serious, not playful, so a second accent is not earned)
             · line rgb(30 27 20 / 0.12) · radius 14px buttons / 0 images
TYPE         DISPLAY Bricolage Grotesque @ 300 (kept light even in a consumer-poster genre:
             scale carries the energy, not weight) + TEXT Work Sans @ 400 · body 1.0625rem
SCROLL       Lenis lerp 0.11 on the gsap.ticker (one clock)
MOTION       0.3 to 0.6s quart-out + one back.out (future add-to-cart) · loader none
             (shop-bound site) · reduced-motion: gate transforms, keep opacity
REVEALS      hero h1 SplitText line masks · roast rows transform + autoAlpha stagger 0.08
             · images ride in with their block · svg none
SHOWPIECES   pin-horizontal-gallery at ARC row 2 (the roast lineup), mobile fallback:
             native vertical stack with snap · second showpiece: none (the bar and process
             stay natively scrolling; one showpiece fits a shop-bound page)
TRANSITIONS  none now (one-pager); full-screen wipe-up, bg-ink, added when /shop ships
WEBGL        none

ARC          1 HERO        [Hook]   bean + claim, left-aligned, image bleeding right, 10rem
             2 ROASTS      [Prove]  the lineup, horizontal flavour gallery ★ pin-horizontal-gallery, dense 6rem
             3 WHY         [Orient] one origin line in 18rem air (the manifesto breather)
             4 THE BAR     [Deepen] the room + hours, restaurant-warm imagery, medium
             5 PROCESS     [Deepen] roast-week rhythm, 3 editorial rows, dense
             6 VISIT/BUY   [Invite] address + hours + newsletter (shop CTA when live) + footer
             proof form: the roasts themselves · grid-breaks: hero bleed, §3 ghost-type crop

COPY BUDGET  h1 ≤8w ("Roasted Tuesday. Gone Friday." energy) · manifesto = §3's single line
             · roast cards: name + 2 tasting words + process, no paragraphs · CTAs "Visit the bar",
             "Get the beans" · all copy to be written (none exists): real from first draft, no lorem

ASSETS       fonts: Bricolage Grotesque, Work Sans (Google) · icons: ph/* (Phosphor:
             warm, rounded, matches radius) · grain: yes 0.04 · grade: saturated warm,
             hard daylight · ratios 1/1 product, 4/5, 21/9
             images: 9, hero bean macro (21/9, shoot), 4 roast bags (1/1, shoot),
             bar room (21/9, existing roastery set, regrade to match), hands/pour (4/5,
             existing), roaster machine (4/5, existing), ALL through one grading pass (imagery.md)
             video/webgl: none

ASSUMPTIONS  - "best roaster in the city" read as craft-serious → accent-2 dropped; veto = restore playful
             - wordmark stays black-on-cream; tomato #D8401F chosen as the accent
             - shop deferred: §6 collects newsletter instead of cart
             - one-pager now, /shop route reserved in nav

LOAD ORDER   router files done → typography+scaling+imagery+iconography (step 2) →
             setup (3; route-transitions+page-entrances deferred until /shop) → nav-header+
             composition+mobile-composition (4) → scroll-reveals+gsap-api+feel-layer+
             pinning-scrub §2 (5) → anti-patterns+feel-layer §5+mobile-composition §4 (6 to 7)
```

Note what the router did that a template could not: it **dropped** a preset feature (accent-2) because the brief's tension reads serious, borrowed exactly one field from a second direction and kept both "never signal" lines in the audit, kept the display face light despite the genre's pull toward weight, spent exactly one showpiece instead of two because the page is shop-bound, deferred route transitions and the shop without losing their arc slots, and turned "no copy written" into a copy-budget line item instead of lorem. That judgment layer is the router's job; the reference files supply the raw material.
