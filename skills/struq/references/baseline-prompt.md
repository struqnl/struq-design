# The Minimal Baseline: rationale + standalone paste block

**The canonical baseline block lives in [SKILL.md](../SKILL.md).** This file does two jobs. It explains **why each rule earns its place** (the rationale below), and it carries the one **standalone copy-paste block** for agents that do not load Struq as a skill: the canonical block plus two role-priming lines.

<!-- GENERATED FROM SKILL.md: the block below is a copy of the canonical baseline block, with two role-priming lines above its title and one blank line between them. Do not edit it here. Edit SKILL.md, then re-copy the block and keep the two role-priming lines. -->

## The paste block (generated, for any LLM, any stack)

Paste this at the top of any project prompt to lift the output into the top tier. Include the rationale section only when the agent has room.

```
Act as a senior design engineer at an award-winning studio (Awwwards SOTD
caliber). Apply every rule below; they override your defaults.

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

The block is the floor, not the ceiling. For the full recipe stack (two-face type system, the Lenis + GSAP single clock, showpieces, route transitions, WebGL) start from [direction.md](direction.md), which turns a brief into one contract file, `STRUQ.md`, that cites the other reference files.

## Why each rule matters

**Spacing asymmetry.** Uniform `py-16` is the single most reliable template tell. Real art direction treats vertical rhythm as pacing: a hero breathes, a feature block is dense, a manifesto line sits in 20rem of air. Varying section padding by role is free and reads instantly as "someone decided this." The "too empty" instruction exists because LLMs systematically under-use whitespace; what feels wasteful in code feels expensive in the browser.

**Type scale contrast.** Templates use five sizes between 16 and 36px, so nothing leads. Agencies compress hierarchy into two extremes: enormous display type (it is the visual, not decoration around the visual) and small, quiet everything else. Negative tracking matters because text faces are spaced for 16px, and at 96px+ the gaps look broken; how much depends on the face (a geometric sans takes about -0.03em, a hairline serif about -0.01em), which is why tracking lives in the pairing row and not in one `tracking-tight`. The tracked-uppercase eyebrow replaces the "medium subhead" that flattens hierarchy. Role tokens (`text-display`, `text-h2`, `eyebrow text-eyebrow`) exist so no component improvises a size, and the one signature move exists so two Struq sites never open the same way. The deeper type system (Signature pairings, roles, fluid scale, SplitText typography) lives in [typography.md](typography.md).

**Tonal elevation.** Drop shadows on light cards are the Bootstrap-era elevation model; design-led products (Linear, Vercel, Arc) moved to tonal ladders, where closer surfaces are lighter (dark mode) or distinguished by hairline borders and a subtle tone step (light mode). The light-mode direction is a preset decision: editorial/luxury pages are the lightest layer with panels stepping deeper; brutalist pages are toned with white panels lifting off them. One step per layer keeps depth legible either way. When you do shadow a floating element, the large/soft/low-opacity recipe reads as ambient light, while `shadow-lg` reads as a 2015 component library.

**One accent.** Restraint is the strongest single luxury signal. Multiple accents (or a gradient) means no decision was made. Temperature-shifted neutrals are why agency sites feel "warm" or "cinematic" while AI output feels like a wireframe: pure white + gray-500 is the absence of a palette, not a palette. The second-accent escape hatch exists because playful/consumer genres legitimately run two voices, but it is a *declared token with the same budget*, mirroring how heavy display weight is allowed only as a genre choice, never a reflex.

**Transform + mask in every entrance.** An opacity-only fade has no physicality: nothing arrives from anywhere. Adding y-travel or a mask (the element slides out from behind a clipped edge) gives motion a direction and a surface to interact with, which is what reads as "crafted." Stagger matters because simultaneous arrival is visual noise; 0.06 to 0.1s offsets create reading order. Ease asymmetry (fast-out entrances, accelerating exits) mirrors how physical objects behave; symmetric ease-in-out everywhere is the uncanny valley of motion.

**Scrub over trigger.** Effects that progress with scroll position feel connected to the user's hand; effects that fire once at a threshold feel like a slideshow. This one distinction separates most award sites from most marketing sites.

**Grid-breaking.** A layout where every element respects the container communicates "theme." Bleed, overlap, and stickiness communicate "art direction" because they require coordinating elements across section boundaries, which is exactly what templates cannot do. Twice per page is the floor; it should look intentional, not chaotic.

**Details.** Real copy forces real layout decisions (lorem hides widow/orphan and width problems). Tracked eyebrow labels give long pages an editorial spine. Note what is *removed* here: stamping `01/02/03` on every section/feature/row is one of the most reliable AI tells. It is reflexive wayfinding that no editor would apply uniformly. One deliberate oversized numeral can be a strong accent; sequencing the whole page is filler. (Ordinal numbering *inside* one genuinely stepped component, such as a pinned phase sequence or a numbered process, is legitimate; page-wide stamping is the tell.) The same logic bans two other reflexes: **monospace as flavor** (it is the look of a code editor, not a designed page, and belongs only around literal code) and the **cliché icon set** (`Sparkles`/`Rocket`/`Zap` and their emoji forms 🚀✨💡 are the visual signature of generated UI). The footer is where everyone quits, so finishing it signals the whole build is finished. Selection color and focus states are tiny, but they are the difference between "surface-level styling" and "someone touched every state."
