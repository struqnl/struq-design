---
name: struq
description: "Award-tier web design for coding agents. Builds cinematic, agency-grade marketing sites, landing pages and portfolios at FWA / Awwwards level: two-face typography with light display weights, curated palettes, Lenis smooth scroll on one GSAP clock, SplitText, DrawSVG and MorphSVG, masked reveals, pinned and horizontal showpieces, hover choreography, full-screen route transitions, Radix overlays, and Three.js / R3F / Drei / postprocessing moments. Use when designing, building, redesigning, animating or auditing a marketing or narrative site, or when a page must feel premium, custom, cinematic or award-winning instead of templated. Stack: Next.js App Router + Tailwind v4 or later (Vite supported), versions detected from the project."
argument-hint: "[brief] | redesign <path> | audit <path-or-url> | direct <brief>"
---

# Struq

The gap between "looks like a template" and "looks like an award-winning agency build" is not talent. It is a finite set of decisions, made in the right order, executed on the right stack. Struq is those decisions. Apply the baseline to **every** build and load reference files only for the techniques the page actually uses.

**Register check.** Struq is for marketing, landing, portfolio and narrative sites: the cinematic, scroll-driven, agency register. For dashboards and product UI, keep the type and surface rules from the baseline, drop Lenis, cinematic durations and showpieces. Density and native scroll win there.

## Modes

Read the argument and pick one. State the mode in one line, then work.

| Invocation | Mode | What happens |
|---|---|---|
| `/struq <brief>` (or no argument) | **Build** | Run the Direction phases into `STRUQ.md`, stop once for a veto, build, verify. |
| `/struq redesign <path>` | **Redesign** | Audit assets and performance, triage the current site ([references/triage.md](references/triage.md)), then Direction with the brand kept, then build. |
| `/struq audit <path-or-url>` | **Audit** | No code changes. Screenshot, run the tell scan and feel audit, return a scored report (see Audit below). |
| `/struq direct <brief>` | **Directed** | One continuous WebGL experience across chapters (persistent stage, camera shots, handoffs). Run Direction phases 0 to 3 into `STRUQ.md`, then enter [cinematic/README.md](cinematic/README.md), which appends its direction to the same file. Use only when the brief is genuinely an "experience", not a site with a 3D hero. |

**Plan everything before the first component.** Build and Redesign always start with [references/direction.md](references/direction.md): intake, brand (name, SVG logo and mark, when there is none), concept (the one idea and its motif), system (two typefaces, palette, icon family, imagery, motion), and the site plan (pages, arc, showpieces, transitions, SEO). It all goes into one file, `STRUQ.md` in the project root, which is the only plan artifact and the contract for the rest of the build. Stop once, at the gate, then build.

**Ask for materials, never invent them.** Use the logo, copy, photos and numbers that exist. With a usable brief, do not stop to ask first: plan with what is there, and put the materials request inside the one gate message ("Veto anything? If you have a logo, photos or real numbers, send them now."). Where something is still missing, write real, specific running copy for the brief and plan imagery as graded placeholders ([references/imagery.md](references/imagery.md) §4b). Never lorem, never "Acme", never invented testimonials, logos or stats. Never write in a real person's or brand's voice: no invented bio, process claims, quotes or catalogue facts; anything the layout needs before the real copy arrives is a labelled draft listed under ASSUMPTIONS ([references/direction.md](references/direction.md) §1).

## The recipe

This is the stack and the layer each tool owns. It is fixed on purpose: the "weighted, expensive" feel comes from these pieces sharing one clock, not from any single effect.

| Layer | Tool | Rule of thumb | Reference |
|---|---|---|---|
| Brand | Name, SVG wordmark and mark, favicon set | Positioning before name; the wordmark is drawn from the display face | [brand.md](references/brand.md) |
| Typography | Signature first: one pairing id (S1 to S7), one display face and one text face, set through role tokens | Display runs **large and light (300 to 400)**. Hierarchy from scale contrast, not weight. One signature move per site. | [typography.md](references/typography.md) |
| Palette | Tokens on `:root` via Tailwind `@theme` (v4 or later) | Temperature-shifted neutrals do 95% of the work, one accent | [vibe-presets.md](references/vibe-presets.md) |
| Scale | One fluid root-rem knob | Everything in rem; breakpoints change layout, never size | [scaling.md](references/scaling.md) |
| Smooth scroll | Lenis, driven by `gsap.ticker` | One requestAnimationFrame for the whole page | [setup.md](references/setup.md), [feel-layer.md](references/feel-layer.md) |
| Scroll motion | GSAP + ScrollTrigger | Scrub for scroll-tied values; masked reveals over fades | [scroll-reveals.md](references/scroll-reveals.md) |
| Text motion | SplitText | Masked line rise, char stagger, scroll color fill | [typography.md](references/typography.md) |
| SVG motion | DrawSVG, MorphSVG, MotionPath | Draw-on-scroll paths, logo morphs, signature marks | [svg-motion.md](references/svg-motion.md) |
| Showpieces | Pinned scrub, horizontal galleries, sticky stacks | One or two per site, placed at act breaks | [showcase.md](references/showcase.md), [pinning-scrub.md](references/pinning-scrub.md) |
| Icons | Struq Icons (`@deckdot/struq-icons`) by default, after the brand's own set; else Phosphor (light), else Iconoir or Tabler | One icon family per site, never mixed, never Lucide by reflex | [iconography.md](references/iconography.md) |
| Hover and pointer | GSAP `quickTo` (magnetic, cursor), CSS + GSAP hover scenes | Garnish, applied last | [micro-interactions.md](references/micro-interactions.md) |
| React lifecycle | Motion (`motion/react`) | Mount/unmount, `layoutId`, gesture state | GSAP vs Motion below |
| Overlays | Radix primitives (Dialog for menus and modals) | Focus trap, Escape, scroll lock paired with `lenis.stop()` | [nav-header.md](references/nav-header.md) |
| Page flow | Full-screen cover, swap, reveal transitions; session-gated loader | Every route change is a designed moment | [route-transitions.md](references/route-transitions.md), [loaders.md](references/loaders.md) |
| 3D moments | Three.js, R3F, Drei, postprocessing | Lazy island, poster fallback, driven from the same ticker | [webgl-r3f.md](references/webgl-r3f.md), [webgl-scenes.md](references/webgl-scenes.md) |
| Findability | Metadata API, an OG image per route, sitemap, robots, JSON-LD | One h1 per page; loaders and reveals never hide content from the HTML | [seo.md](references/seo.md) |
| Performance | ffmpeg, next/image, gltf-transform, next/font | Assets first: budgets per role, posters always, WebGL never in the first-load bundle | [performance.md](references/performance.md) |

Install line and provider wiring: [references/setup.md](references/setup.md). All GSAP plugins are free on npm from GSAP 3.13 on (the minimum version); no token, no club. No other version is assumed: the installed project decides ([references/setup.md](references/setup.md) §0).

## The baseline (applies to everything)

<!-- CANONICAL: this is the single source of the baseline block. references/baseline-prompt.md carries a standalone copy for pasting into other agents; after editing here, re-copy the block there. -->

```
STRUQ BASELINE: NON-NEGOTIABLES

TYPE: Signature first: one pairing id from typography.md §3.1 (S1 to S7;
Extended E1 to E6 only when no Signature temperament fits), two faces max.
Never Inter, Roboto, Open Sans, Poppins, Montserrat or Lato; never Space
Grotesk or Geist as a reflex. Scale 1.333 with skipped steps (body 1, lead
1.25, h3 1.78, h2 3.16, display 7 to 8). Hero h1 = text-display,
clamp(2.875rem, 1.2rem + 6.86vw, 8rem), leading 0.92 to 1.0; S4 and S5 set
larger, S7 smaller (typography.md §3.1). Display runs LIGHT (300 to 400);
heavy display only as a declared genre (the Brutalist appendix), never a
reflex. Tracking per face, never one tracking-tight on every size: sans
display about -0.025 to -0.03em, serif display about -0.01 to -0.025em, h2
about half that. Body 1rem to 1.0625rem at 400, leading 1.6+, 55 to 75ch;
emphasis 500, never 700. Hierarchy from scale contrast, not medium sizes.
ROLES: every string takes a role token, never text-xs, text-lg or text-5xl:
font-display text-display, font-display text-h2, type-h3 text-h3,
text-lead, text-body, text-small, eyebrow text-eyebrow, font-ui text-ui,
stat text-stat, and font-display text-statement for the one Orient line
or manifesto. Eyebrows: uppercase 0.75rem (the 12px floor), tracked 0.12
to 0.18em per face, ink-muted, one per section, never ink-faint.
FLOOR: body at least 1rem, muted at least 0.875rem, nothing under 12px.
CONTRAST: body at least 4.5:1, large text at least 3:1. ink-faint is never
text: hairlines and disabled states only.
SIGNATURE: every STRUQ.md declares one typographic signature move
(typography.md §5: weight-in, soft-scrub, type-mask-media,
fit-width-wordmark, a cropped display). The masked line rise is a
technique, not the default hero. Mono only for literal code. Headings get
text-wrap: balance; body gets text-wrap: pretty.

SPACING: Base-8 rhythm with deliberate asymmetry. Section padding varies by
role: hero 12 to 20rem, dense content 6 to 8rem, breathers 16 to 24rem. NEVER
uniform py-16 on every section. Whitespace is a material: at least one section
should feel "too empty" by SaaS standards.

SCALING: One fluid root-rem knob, not per-breakpoint size ladders:
html { font-size: clamp(1rem, 0.92rem + 0.2vw, 1.125rem); }
16px at 390, about 17.6px at 1440, frozen at 18px from about 1640. Every
clamp() keeps a rem term in its middle so zoom works; a vw-only middle is a
bug. Author everything in rem; px only for 1px hairlines. Breakpoints change
LAYOUT (columns, stack or row), never size. Display roles carry their own
clamp() on top.

SURFACE: Elevation is a tonal step, not a drop shadow. Dark mode: each layer
steps LIGHTER (#0A0A0B, #111113, #19191C, #232328). Light mode: pick one
direction and keep it (panels a shade deeper than a toned page, or white lifted
off a toned page). Hairline borders about 8 to 12% off the surface; in light
mode a border is the ink at low alpha (rgb(<ink> / 0.08 to 0.14)), never a
flat gray hex. Shadows only for true floating elements, then large, soft and faint
(0 24px 80px -12px rgb(0 0 0 / 0.4)). Never shadow-md or shadow-lg.

COLOR: One accent, used sparingly (links, the key CTA, one highlight per
viewport). Neutrals are temperature-shifted (warm cream and off-black, or cool
charcoal), never pure #FFF and #000 with gray-500 text. A second accent is a
declared genre choice with its own token and the same budget. No blue to
purple gradients, no gradient text, no glassmorphism cards.

MOTION: Lenis smooth scroll (lerp 0.09 to 0.11) on one gsap.ticker clock,
unless the genre calls for native scroll. Every entrance animates opacity AND
transform (y 24 to 80px, or a clip or overflow mask). Opacity-only fades are
forbidden. Stagger siblings 0.06 to 0.1s. Durations: micro 0.2 to 0.3s,
standard UI 0.3 to 0.6s, reveals 0.6 to 1.0s, hero and cinematic 1.0 to 1.6s;
exits run about 60% of their entrance. Eases: entrances expo-out
cubic-bezier(0.16, 1, 0.3, 1) (expo.out); exits power2.in; position swaps
quart-in-out cubic-bezier(0.76, 0, 0.24, 1) (power3.inOut); curtains and
panels quint-in-out cubic-bezier(0.83, 0, 0.17, 1) (power4.inOut). Never
default ease-in-out everywhere.
Scroll-tied effects scrub; they do not fire time-based tweens at a threshold.
prefers-reduced-motion: gate transforms, keep opacity.

COMPOSITION: Break the grid at least twice per page: an image bleeding off
the viewport, an element overlapping two sections, oversized type running off
canvas, a sticky element. No three identical icon cards in a row. Vary section
layout: after a 50/50 split comes full-bleed or an asymmetric 1/3 and 2/3.
Icons: ONE coherent family chosen for the brand, one stroke and size,
ink-colored. Never emoji, never the AI-cliche icons (Sparkles, Rocket, Zap),
never icons in colored chips. Animated icons run under 500ms on click and
never loop in standard UI.

DETAILS THAT SELL IT: Real running copy. Tracked uppercase eyebrows as
wayfinding, not 01/02/03 stamped on every section (one deliberate oversized
numeral is fine). The footer is designed as hard as the hero. Custom
::selection color. Visible, designed focus-visible states. Every route change
is a designed transition, not a hard cut.
```

Why each rule earns its place: [references/baseline-prompt.md](references/baseline-prompt.md).

## Leverage ranking: spend effort in this order

Ordered by visual payoff divided by implementation cost. Do 1 to 7 on every build; 8 to 13 when the page calls for them.

1. **Page architecture.** Which sections exist, in what order, and where the showpiece sits. Free, and it decides everything downstream. A perfect section inside a template arc still reads as a template. [references/page-architecture.md](references/page-architecture.md)
2. **Typography.** The Signature pairing, the light display weight, the role tokens, the eyebrow system, the one signature move. This is 70% of "looks designed". Set the root-rem knob ([references/scaling.md](references/scaling.md)) first, then the type system ([references/typography.md](references/typography.md)).
3. **Palette and surfaces.** Kills the "Tailwind default" look instantly. [references/vibe-presets.md](references/vibe-presets.md)
4. **Masked, staggered scroll reveals.** The single highest-payoff motion technique, including the curtain section reveal. [references/scroll-reveals.md](references/scroll-reveals.md)
5. **The feel layer.** Lenis lerp, scrub smoothing, ease selection. Wrong values make good techniques feel cheap. [references/feel-layer.md](references/feel-layer.md)
6. **Nav and header.** On screen for the whole session; the fullscreen menu is often the most art-directed moment on the site. [references/nav-header.md](references/nav-header.md)
7. **Imagery and art direction.** One grade, declared ratios, treated assets. Ungraded mixed stock undoes everything above it. [references/imagery.md](references/imagery.md)
8. **Composition: overlap, bleed, z-choreography.** [references/composition.md](references/composition.md), and how each technique translates at 360 to 430px: [references/mobile-composition.md](references/mobile-composition.md)
9. **Showpieces.** Pinned scrub timelines, horizontal galleries, sticky stacks, path journeys. High cost; one or two per site at act breaks. Pick by id from [references/showcase.md](references/showcase.md).
10. **Page flow.** Full-screen route transitions ([references/route-transitions.md](references/route-transitions.md)), a session-gated first-load loader ([references/loaders.md](references/loaders.md)), per-zone entrances ([references/page-entrances.md](references/page-entrances.md)), section curtains and match cuts ([references/transitions.md](references/transitions.md)). Loader invariant: the pre-paint revisit gate and the live animation phase are separate state machines. A persistent `seen` flag must never hide a curtain that is still playing.
11. **Text and SVG choreography.** SplitText beyond the line reveal, DrawSVG, MorphSVG. [references/typography.md](references/typography.md), [references/svg-motion.md](references/svg-motion.md)
12. **Hover and pointer.** Magnetic buttons, cursor followers, hover scenes. Garnish, not the meal. [references/micro-interactions.md](references/micro-interactions.md)
13. **WebGL moments.** Highest cost of all; only when a section genuinely calls for it. Integration first ([references/webgl-r3f.md](references/webgl-r3f.md)), then Drei, postprocessing and interaction ([references/webgl-scenes.md](references/webgl-scenes.md)). If the whole page is one 3D experience, switch to Directed mode.

Before and after pairs for every category, the cheap reflex against the agency version: [references/anti-patterns.md](references/anti-patterns.md). **If output drifts generic, read that file first.**

**Something looks wrong in motion?** Read [references/pitfalls.md](references/pitfalls.md) first, before changing any code: the symptom-first bug clinic for the bugs that recur on every GSAP build: clipped descenders, jarring or jumping pins, content stuck invisible after a reveal, utilities that vanish on animated elements, entrances that fire before the image paints. Each entry gives the cause, the fix and the check.

**The page will not scroll at all?** It is one of exactly two bugs. Either nothing drives `lenis.raf()` because the ticker wiring lost a race with the `<ReactLenis>` ref, or an overlay left an unbalanced `lenis.stop()`. Check the `<html>` class list for `lenis-stopped` first; that one glance tells you which. Both fixes are in [references/setup.md](references/setup.md) §2 and §2b. Do not start "fixing" CSS overflow. A pinned section that jerks on engage is almost always `anticipatePin` with smooth scroll: [references/pinning-scrub.md](references/pinning-scrub.md) §2.

## AI-default blocklist

These scream "generated". Never ship them:

- A three-column grid of identical `rounded-xl border shadow-sm` cards with a centered icon, an h3 and two lines of gray text
- Blue to purple (or teal to violet) gradients on backgrounds, buttons or `bg-clip-text` headlines
- Uniform `py-16` or `py-24` on every section, where every section is a centered h2, a subhead and a grid
- Off-list faces: Inter, Roboto, Open Sans, Poppins or Montserrat (or Lato, or the system stack) for everything, or Space Grotesk or Geist as the reflex "technical" face, instead of a Signature pairing
- Bold 700 display headlines, five medium heading sizes, one `tracking-tight` on every size, ad-hoc `text-xs uppercase tracking-[...]` eyebrows instead of the role tokens
- `text-ink-faint` on any text
- `shadow-md` or `shadow-lg` as the elevation system on gray-50 cards
- Opacity-only fade-ins, all fired at once, with default `ease-in-out` and `duration-300`
- `bg-white` page, `text-gray-500` body, `border-gray-200` everywhere
- Emoji as icons, the cliche trio (Sparkles, Rocket, Zap) as decoration, icons in colored circles
- Monospace as decoration on eyebrows, labels, stats or badges
- `01 / 02 / 03` stamped on every section or row
- Hero = centered h1, subhead, two buttons and a dashboard screenshot in browser chrome
- Untreated mixed-grade stock at random ratios, glossy AI-render blobs, floating purple spheres
- `backdrop-blur` glass cards on a mesh-gradient background
- Hard cuts between routes on a multi-page site
- Lorem ipsum, "John Doe", "Acme Inc.", "Your journey starts here"

## GSAP vs Motion: the decision rule

Both are installed. Never animate the same property on the same element with both, and never with GSAP and a CSS `transition` either: one owner per property per element ([references/pitfalls.md](references/pitfalls.md) §3). **GSAP owns everything that runs every frame or is tied to scroll; Motion owns React lifecycle, layout and gesture state.** The reason is the single clock: the whole build runs on one requestAnimationFrame (Lenis driven by `gsap.ticker`, [references/setup.md](references/setup.md) §2). High-frequency pointer work belongs on that same ticker via `quickTo`. Pushing it onto a competing spring loop is exactly what makes good motion feel subtly off.

| GSAP + ScrollTrigger | Motion |
|---|---|
| Anything scroll-tied: scrub, pins, parallax, reveals | Mount and unmount (`AnimatePresence`) |
| Multi-step timelines and orchestration | Layout and shared-element swaps from React state (`layout`, `layoutId`) |
| SplitText, DrawSVG, MorphSVG, MotionPath | `whileHover`, `whileTap`, one-off `whileInView` |
| Flip morphs that coordinate with scroll or a timeline | Press and toggle micro-feedback |
| Magnetic buttons, custom cursor (`quickTo`) | Local stateful overlays that are not part of a timeline |
| Horizontal scroll, sticky stacks, R3F uniforms from scroll | |

**Before writing any Flip,** read [references/gsap-api.md](references/gsap-api.md) §7.1 to 7.4. Flip has four failure modes that compound and that no typecheck catches. Flip is verified by watching it, never by a green build.

## Workflow (Build and Redesign)

These step names are the one numbering scheme; [references/brief-router.md](references/brief-router.md) §4 keys its load manifest to them.

0. **Detect versions.** Scaffold with `@latest` if the folder is empty, then read the installed `package.json` and record the majors on the `Stack:` line. When unsure of an API, check the installed package's types, `npm view <pkg> version` and the official docs for that major. **When the skill's code disagrees with the installed version's types or docs, the installed version wins:** adapt the code and log the adaptation under LOG in STRUQ.md. Strip the scaffold's starter fonts, page and CSS. The known shifts and how to tell which side a project is on: [references/setup.md](references/setup.md) §0.
1. **Direction.** Run [references/direction.md](references/direction.md) phases 0 to 4: intake (the brief extracted silently, stack detected and recorded as `Stack:`), brand ([references/brand.md](references/brand.md) when there is none), concept, system, and the site plan via [references/brief-router.md](references/brief-router.md) §2. No usable brief? The router's wizard asks at most three plain-language rounds; that is the only early stop. Write `STRUQ.md`, then send the one gate message: summary, materials request, "Veto anything?" Vite? Every later step translates through [references/stack-targets.md](references/stack-targets.md). Redesigning? First run the asset audit in [references/performance.md](references/performance.md) §2 and read [references/triage.md](references/triage.md).
2. **Brand files and tokens.** Write the logo, mark and favicon set ([references/brand.md](references/brand.md) §5). Set the root-rem knob, the type system ([references/typography.md](references/typography.md)) and the palette tokens exactly as STRUQ.md records them.
3. **Structure and SEO.** Routes, metadata, sitemap, robots and JSON-LD from the PLAN's page list ([references/seo.md](references/seo.md)), before any section is styled. Then, with the routes in place, the OG image per shared route ([references/seo.md](references/seo.md) §3).
4. **Wire providers.** Lenis on the GSAP ticker with the reduced-motion guard ([references/setup.md](references/setup.md)). For multi-page sites, the transition provider ([references/route-transitions.md](references/route-transitions.md)) and optionally a loader ([references/loaders.md](references/loaders.md)).
5. **Static layout.** Authored in rem, designed at 1440 and 390 at the same time, and checked at 768 wherever a breakpoint changes the column count ([references/mobile-composition.md](references/mobile-composition.md) §4). Type, spacing and surfaces right **before any motion**; motion cannot rescue a flat layout. Nav per [references/nav-header.md](references/nav-header.md), icons per [references/iconography.md](references/iconography.md).
6. **Motion in layers.** Reveals, then composition, then the one or two showpieces, then text and SVG choreography, then hover and pointer. WebGL last, as a lazy island with a poster. Read [references/pitfalls.md](references/pitfalls.md) before the first tween.
7. **Optimize and sweep.** Every asset through the budgets in [references/performance.md](references/performance.md); then [references/anti-patterns.md](references/anti-patterns.md) as a checklist and the [references/seo.md](references/seo.md) checklist.
8. **Verify.** Against a production server only: `next build && next start` (or `vite build && vite preview`), never the dev server, and confirm the port you shoot is owned by that production process (a leftover dev server on the same port answers silently). Then:
   - **Layout:** screenshot at **390, 768, 1440 and 1920** with whatever browser tool the harness has (Playwright or similar). Full-page shots do not show a fixed footer-reveal (the viewport becomes the document height); verify the close from the scroll pass.
   - **Scans:** the 30-second tell scan ([references/anti-patterns.md](references/anti-patterns.md)) and the 60-second feel audit ([references/feel-layer.md](references/feel-layer.md) §5) against the screenshots, not the code.
   - **Motion:** scroll the page end to end with motion on: no dead wheel, no flash on route change, and **every pinned section** engaged and released at a slow and a fast scroll with no jump or snap. Run the descender test ("Gyp, jq." in every masked component at 390 and 1440) and the pin checks in [references/pitfalls.md](references/pitfalls.md) §1 and §2.
   - **No empty regions:** ambitious motion loses to plain pages when a reveal leaves a region blank. Capture a full page with reduced motion, a full page with JavaScript off, and the scroll sequence after each reveal settles; any blank footer, frame, CTA or row that should hold content fails verify ([references/pitfalls.md](references/pitfalls.md) §3.6, §3.7).
   - **Timing:** static PNGs cannot show timing bugs. Take a frame trace of the first 3 seconds (a screenshot every 200 to 250ms from navigation) and confirm each entrance does what its recipe says: the hold frame of a match cut is the photo, a split hero is never shown unsplit, nothing stays at opacity 0.
   - **Vitals:** LCP (with the element it names) and CLS from an in-page `PerformanceObserver` probe under 4x CPU and a throttled network, plus INP from field data or a manual interaction trace, and the first-load JS measured from the served HTML (Turbopack prints no table). Port check, probe, trace and first-load scripts: [references/performance.md](references/performance.md) §8.
   Fix, re-shoot, and write the score under VERIFY in STRUQ.md.

## Audit

`/struq audit` changes nothing. It returns:

1. **Score out of 100**, starting at 100: minus 5 per blocklist tell found, minus 3 per baseline violation (type, spacing, surface, color, motion, composition), minus 10 if the page fails to scroll smoothly or a pin jerks, minus 10 if there is no designed mobile layout, minus 5 per asset over budget ([references/performance.md](references/performance.md) §1, capped at minus 15), minus 5 if social images, the sitemap or page metadata are missing ([references/seo.md](references/seo.md)).
2. **The tells**, grouped by category, each with the file and line (or screenshot region) and the one-line fix.
3. **Feel audit** result from [references/feel-layer.md](references/feel-layer.md) §5.
4. **The three changes with the most visual payoff**, ordered by the leverage ranking above.

Keep the score honest. An award-tier page lands at 90+; a typical AI-generated page lands under 50.
