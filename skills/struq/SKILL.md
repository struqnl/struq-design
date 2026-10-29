---
name: struq
description: "Award-tier web design for coding agents. Builds cinematic, agency-grade marketing sites, landing pages and portfolios at FWA / Awwwards level: two-face typography with light display weights, curated palettes, Lenis smooth scroll on one GSAP clock, SplitText, DrawSVG and MorphSVG, masked reveals, pinned and horizontal showpieces, hover choreography, full-screen route transitions, Radix overlays, and Three.js / R3F / Drei / postprocessing moments. Use when designing, building, redesigning, animating or auditing a marketing or narrative site, or when a page must feel premium, custom, cinematic or award-winning instead of templated. Stack: Next.js App Router + Tailwind v4 (Vite supported)."
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
| `/struq direct <brief>` | **Directed** | One continuous WebGL experience across chapters (persistent stage, camera shots, handoffs). Enter [cinematic/README.md](cinematic/README.md). Use only when the brief is genuinely an "experience", not a site with a 3D hero. |

**Plan everything before the first component.** Build and Redesign always start with [references/direction.md](references/direction.md): intake, brand (name, SVG logo and mark, when there is none), concept (the one idea and its motif), system (two typefaces, palette, icon family, imagery, motion), and the site plan (pages, arc, showpieces, transitions, SEO). It all goes into one file, `STRUQ.md` in the project root, which is the contract for the rest of the build. Ask once for a veto, then build.

**Ask for materials, never invent them.** Use the logo, copy, photos and numbers that exist. Where something is missing, write real, specific running copy for the brief and list imagery as placeholders. Never lorem, never "Acme", never invented testimonials, logos or stats.

## The recipe

This is the stack and the layer each tool owns. It is fixed on purpose: the "weighted, expensive" feel comes from these pieces sharing one clock, not from any single effect.

| Layer | Tool | Rule of thumb | Reference |
|---|---|---|---|
| Brand | Name, SVG wordmark and mark, favicon, OG image | Positioning before name; the wordmark is drawn from the display face | [brand.md](references/brand.md) |
| Typography | Two faces: one display, one text | Display runs **large and light (300 to 400)**. Hierarchy from scale contrast, not weight. | [typography.md](references/typography.md) |
| Palette | Tokens on `:root` via Tailwind v4 `@theme` | Temperature-shifted neutrals do 95% of the work, one accent | [vibe-presets.md](references/vibe-presets.md) |
| Scale | One fluid root-rem knob | Everything in rem; breakpoints change layout, never size | [scaling.md](references/scaling.md) |
| Smooth scroll | Lenis, driven by `gsap.ticker` | One requestAnimationFrame for the whole page | [setup.md](references/setup.md), [feel-layer.md](references/feel-layer.md) |
| Scroll motion | GSAP + ScrollTrigger | Scrub for scroll-tied values; masked reveals over fades | [scroll-reveals.md](references/scroll-reveals.md) |
| Text motion | SplitText | Masked line rise, char stagger, scroll color fill | [typography.md](references/typography.md) |
| SVG motion | DrawSVG, MorphSVG, MotionPath | Draw-on-scroll paths, logo morphs, signature marks | [svg-motion.md](references/svg-motion.md) |
| Showpieces | Pinned scrub, horizontal galleries, sticky stacks | One or two per site, placed at act breaks | [showcase.md](references/showcase.md), [pinning-scrub.md](references/pinning-scrub.md) |
| Icons | Struq Icons (two-tone, animated), else Phosphor light, else Iconoir or Tabler | One family per site, never Lucide by reflex | [iconography.md](references/iconography.md) |
| Hover and pointer | GSAP `quickTo` (magnetic, cursor), CSS + GSAP hover scenes | Garnish, applied last | [micro-interactions.md](references/micro-interactions.md) |
| React lifecycle | Motion (`motion/react`) | Mount/unmount, `layoutId`, gesture state | GSAP vs Motion below |
| Overlays | Radix primitives (Dialog for menus and modals) | Focus trap, Escape, scroll lock paired with `lenis.stop()` | [nav-header.md](references/nav-header.md) |
| Page flow | Full-screen cover, swap, reveal transitions; session-gated loader | Every route change is a designed moment | [route-transitions.md](references/route-transitions.md), [loaders.md](references/loaders.md) |
| 3D moments | Three.js, R3F, Drei, postprocessing | Lazy island, poster fallback, driven from the same ticker | [webgl-r3f.md](references/webgl-r3f.md), [webgl-scenes.md](references/webgl-scenes.md) |
| Findability | Metadata API, an OG image per route, sitemap, robots, JSON-LD | One h1 per page; loaders and reveals never hide content from the HTML | [seo.md](references/seo.md) |
| Performance | ffmpeg, next/image, gltf-transform, next/font | Assets first: budgets per role, posters always, WebGL never in the first-load bundle | [performance.md](references/performance.md) |

Install line and provider wiring: [references/setup.md](references/setup.md). All GSAP plugins are free on npm since 3.13; no token, no club.

## The baseline (applies to everything)

<!-- CANONICAL: this is the single source of the baseline block. references/baseline-prompt.md carries a standalone copy for pasting into other agents; after editing here, re-copy the block there. -->

```
STRUQ BASELINE: NON-NEGOTIABLES

TYPE: Two faces, max: one display face and one text face. Fluid scale via
clamp(), ratio 1.25 to 1.333. Display sizes are LARGE: hero h1 =
clamp(3rem, 8vw, 9rem), tracking -0.02em to -0.04em, leading 0.95 to 1.05.
Display weight runs LIGHT (300 to 400). Large and light is the agency signal;
heavy display (600+) only as a declared genre choice (brutalist, poster),
never a reflex. Body 1rem to 1.125rem, leading 1.6+, line length 55 to 75ch.
Hierarchy comes from scale contrast (huge against small), not from five
medium sizes. Section eyebrows are uppercase 11 to 12px labels tracked 0.1em+,
not mid-size subheads. FLOOR: body at least 1rem, muted at least 0.875rem,
nothing under 12px. CONTRAST: body at least 4.5:1, large text at least 3:1.
No monospace for display, labels, eyebrows, stats or body. Mono is for literal
code only. Headings get text-wrap: balance; body gets text-wrap: pretty.

SPACING: Base-8 rhythm with deliberate asymmetry. Section padding varies by
role: hero 12 to 20rem, dense content 6 to 8rem, breathers 16 to 24rem. NEVER
uniform py-16 on every section. Whitespace is a material: at least one section
should feel "too empty" by SaaS standards.

SCALING: One fluid root-rem knob, not per-breakpoint size ladders:
html { font-size: clamp(0.9375rem, 0.836rem + 0.45vw, 1.1875rem); }
The rem term keeps browser zoom working. Author everything in rem; px only
for 1px hairlines. Breakpoints change LAYOUT (columns, stack or row), never
size. Display headlines keep their own clamp() on top for drama.

SURFACE: Elevation is a tonal step, not a drop shadow. Dark mode: each layer
steps LIGHTER (#0A0A0B, #111113, #19191C, #232328). Light mode: pick one
direction and keep it (panels a shade deeper than a toned page, or white lifted
off a toned page). Hairline borders about 8 to 12% off the surface. Shadows only
for true floating elements, then large, soft and faint
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
reveals 0.6 to 1.0s, hero and cinematic 1.0 to 1.6s. Eases: entrances expo-out
cubic-bezier(0.16, 1, 0.3, 1); exits power2.in; position swaps quart-in-out
cubic-bezier(0.76, 0, 0.24, 1). Never default ease-in-out everywhere.
Scroll-tied effects scrub; they do not fire time-based tweens at a threshold.
prefers-reduced-motion: gate transforms, keep opacity.

COMPOSITION: Break the grid at least twice per page: an image bleeding off
the viewport, an element overlapping two sections, oversized type running off
canvas, a sticky element. No three identical icon cards in a row. Vary section
layout: after a 50/50 split comes full-bleed or an asymmetric 1/3 and 2/3.
Icons: ONE coherent family chosen for the brand, one stroke and size,
ink-colored. Never emoji, never the AI-cliche icons (Sparkles, Rocket, Zap),
never icons in colored chips.

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
2. **Typography.** The pairing, the light display weight, the fluid scale, the eyebrow system. This is 70% of "looks designed". Set the root-rem knob ([references/scaling.md](references/scaling.md)) first, then the type system ([references/typography.md](references/typography.md)).
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

**The page will not scroll at all?** It is one of exactly two bugs. Either nothing drives `lenis.raf()` because the ticker wiring lost a race with the `<ReactLenis>` ref, or an overlay left an unbalanced `lenis.stop()`. Check the `<html>` class list for `lenis-stopped` first; that one glance tells you which. Both fixes are in [references/setup.md](references/setup.md) §2 and §2b. Do not start "fixing" CSS overflow. A pinned section that jerks on engage is almost always `anticipatePin` with smooth scroll: [references/pinning-scrub.md](references/pinning-scrub.md) §2.

## AI-default blocklist

These scream "generated". Never ship them:

- A three-column grid of identical `rounded-xl border shadow-sm` cards with a centered icon, an h3 and two lines of gray text
- Blue to purple (or teal to violet) gradients on backgrounds, buttons or `bg-clip-text` headlines
- Uniform `py-16` or `py-24` on every section, where every section is a centered h2, a subhead and a grid
- Inter (or the system stack) for everything, bold 700 display headlines, five medium heading sizes
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

Both are installed. Never animate the same property on the same element with both. **GSAP owns everything that runs every frame or is tied to scroll; Motion owns React lifecycle, layout and gesture state.** The reason is the single clock: the whole build runs on one requestAnimationFrame (Lenis driven by `gsap.ticker`, [references/setup.md](references/setup.md) §2). High-frequency pointer work belongs on that same ticker via `quickTo`. Pushing it onto a competing spring loop is exactly what makes good motion feel subtly off.

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

1. **Direction.** Run [references/direction.md](references/direction.md) end to end: intake, brand ([references/brand.md](references/brand.md) when there is none), concept, system, and the site plan via [references/brief-router.md](references/brief-router.md). No brief? The router's wizard asks at most three plain-language rounds. Write `STRUQ.md`, show the summary, ask once: "Veto anything?" Redesigning? First run the asset audit in [references/performance.md](references/performance.md) §2 and read [references/triage.md](references/triage.md).
2. **Detect the stack.** Next.js App Router is the default; Vite differs in providers, font loading and lazy boundaries. Translate via [references/stack-targets.md](references/stack-targets.md) before writing wiring.
3. **Brand files and tokens.** Write the logo, mark, favicon set and OG image ([references/brand.md](references/brand.md) §5, [references/seo.md](references/seo.md) §3). Set the root-rem knob, the type system ([references/typography.md](references/typography.md)) and the palette tokens exactly as STRUQ.md records them.
4. **Structure and SEO skeleton.** Routes, metadata, sitemap, robots and JSON-LD from the PLAN's page list ([references/seo.md](references/seo.md)), before any section is styled.
5. **Wire providers.** Lenis on the GSAP ticker with the reduced-motion guard ([references/setup.md](references/setup.md)). For multi-page sites, the transition provider ([references/route-transitions.md](references/route-transitions.md)) and optionally a loader ([references/loaders.md](references/loaders.md)).
6. **Static layout first.** Authored in rem, designed at 1440 and 390 at the same time ([references/mobile-composition.md](references/mobile-composition.md)). Type, spacing and surfaces right **before any motion**; motion cannot rescue a flat layout. Nav per [references/nav-header.md](references/nav-header.md), icons per [references/iconography.md](references/iconography.md).
7. **Motion in layers.** Reveals, then composition, then the one or two showpieces, then text and SVG choreography, then hover and pointer. WebGL last, as a lazy island with a poster.
8. **Optimize and sweep.** Every asset through the budgets in [references/performance.md](references/performance.md); then [references/anti-patterns.md](references/anti-patterns.md) as a checklist and the [references/seo.md](references/seo.md) checklist.
9. **Look at it before calling it done.** Run it and screenshot at **390, 768 and 1440** with whatever browser tool the harness has (Playwright or similar). Run the 30-second tell scan ([references/anti-patterns.md](references/anti-patterns.md)) and the 60-second feel audit ([references/feel-layer.md](references/feel-layer.md) §5) against the screenshots, not the code. Scroll the page end to end once: no dead wheel, no pin jerk, no flash on route change. On a production build, record LCP, CLS and INP. Fix, re-shoot, and write the score under VERIFY in STRUQ.md.

## Audit

`/struq audit` changes nothing. It returns:

1. **Score out of 100**, starting at 100: minus 5 per blocklist tell found, minus 3 per baseline violation (type, spacing, surface, color, motion, composition), minus 10 if the page fails to scroll smoothly or a pin jerks, minus 10 if there is no designed mobile layout, minus 5 per asset over budget ([references/performance.md](references/performance.md) §1, capped at minus 15), minus 5 if social images, the sitemap or page metadata are missing ([references/seo.md](references/seo.md)).
2. **The tells**, grouped by category, each with the file and line (or screenshot region) and the one-line fix.
3. **Feel audit** result from [references/feel-layer.md](references/feel-layer.md) §5.
4. **The three changes with the most visual payoff**, ordered by the leverage ranking above.

Keep the score honest. An award-tier page lands at 90+; a typical AI-generated page lands under 50.

## Struq on the web

Curated palettes and typography pairings have live previews at **struq.nl**, and each showcase recipe id in [references/showcase.md](references/showcase.md) gets its own scrollable demo page there, so you and your client can see a recipe before you build it. Struq Pro adds niche packets (ready-made direction for specific industries), the curated media and design-system library over MCP, and starter projects.
