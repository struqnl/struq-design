# STRUQ.md: Struq (the skill's own landing page)

Mode: build (non-interactive run: the gate was answered "No veto, go.")
Stack: Next.js 16.4 App Router · React 19.3 · Tailwind 4.3 (via @tailwindcss/turbopack, no postcss config) · GSAP 3.15 · Lenis 1.3 · Motion 14.7 · radix-ui 1.8 · @deckdot/struq-icons 1.0 · three: not used. Read from package.json (setup.md §0). Scaffold ships `cacheComponents: true` and `partialPrefetching: true`.

Brief: "/struq Landing page for Struq, an open-source design skill for coding agents (Claude Code, Codex, Cursor, OpenCode). One command installs it; /struq <brief> then plans and builds an award-tier, cinematic marketing site. English, one long page, for developers and designers. Goal: installs and GitHub stars. Existing brand: Struq."

## MATERIALS
Have:
- Brand tokens from StruqVisual `app/globals.css` (`--sq-*`): paper #fbf8f2, sunken #f3eee3, deep #ece5d6, ink #221d15, ink-soft #5c5546, ink-faint #8b8371, flame accent #e4572e (accent-deep #b23c17, accent-ink #9a3312), inverse #201b13 / inverse-ink #f4efe4 / inverse-soft #b5ac99 / inverse-accent #ff8a63.
- Brand fonts: Comfortaa (wordmark and h1 only) + Urbanist (everything else), the House pairing (typography.md §3.1 note).
- Logo: the wordmark component (`Struq` in Comfortaa 600 plus a flame full stop) and the mark (three stacked pills on a 100 grid: narrow top at 0.7 ink, core in ink, widest base in flame), from `components/site/brand/`. Copied as SVG, never imported across repos.
- Real facts: install line `npx skills add deckdot/struq-design -g`; invocations `/struq <brief>`, `/struq:struq` (plugin), `$struq` (Codex), by name (Cursor, OpenCode); repo github.com/Deckdot/struq-design, MIT; Struq Icons `npm install @deckdot/struq-icons`, 182 two-tone icons, 118 with hover motion, MIT, struq.nl/iconen; Node 18+ required.
- Real proof: the blind review. Ceramicist portfolio 56 vs 79, e-bike launch 66 vs 76, dev-tool landing 50 vs 76, average 57 vs 77; invented facts 36 vs 10 (14/5, 11/3, 11/2); template tells 22 vs 8 (6/3, 6/3, 10/2). Struq lost craft points on empty reveal states, since fixed. Six hero screenshots (`docs/compare/*.webp`) and the dev-tool build's own verify shots at 390, 768, 1440 and 1920 (`struq-dryruns/c-saas/shots/home-*-top.png`).
- Author: Roy Heilbron. Dutch studio site struq.nl (footer link only).
Missing:
- Star count, install count, user count, testimonials, company logos: none exist, none shown. The proof form is the blind review only.
- Video or 3D of the product: not needed; the product in motion is shown as a coded, labelled walkthrough of a real build (the dev-tool dry run's own screenshots).
References: none given.

## BRAND
Name: Struq (existing; not renamed, not repositioned)
Logo: brand/logo.svg (wordmark, Comfortaa 600 outlined, flame full stop as its own element), brand/mark.svg (three pills), components/brand/Logo.tsx, app/icon.svg, app/apple-icon.png
OG: app/opengraph-image.tsx (one route)
Voice: plain, exact, a little dry; short sentences; numbers instead of adjectives; says what it does not do; never exclamation marks, never "unlock", "elevate", "supercharge", "magic".

## CONCEPT
Idea: one line in, a plan, a site: the page builds itself the way Struq builds, narrow to wide, like the three bars of the mark.
Tension: convince "this gives my agent real design judgment, and the evidence is on the page" / never signal "another AI design toy that makes every site look the same" (and never the dark dev-tool template: glows, terminal cosplay, badge pills).
Motif: the mark's three stacked bars, narrow to wide (brief, plan, site). They stack in on load, drift apart as the hero leaves, mark progress through the walkthrough, and the widest bar's flame is the page's one accent.

## SYSTEM
Niche: developers and designers who run coding agents; free, open-source tool; goal installs and stars · genre Product launch · preset Soft Modern (calm, exact, considered software) with the brand's own palette poured into its token structure (brand colours beat the preset; no borrowed field needed)
Display: Comfortaa 400 at rest (Google Fonts, OFL), h1 and wordmark only · pairing House (Comfortaa + Urbanist), brand-owned, not a Signature row; every other role takes the S1 Urbanist values
Text: Urbanist 300 (h2, statement, footer ask, stats), 400 (h3, body, lead, small), 500 (eyebrow, UI) (Google Fonts, OFL)
  Roles: `font-brand text-display` on the h1 (Comfortaa), `font-display` = Urbanist for h2, statement and the footer ask
Signature move: fit-width-wordmark (the footer "Struq." set edge to edge at the measured container width, cropped by the bottom edge)
Hero entrance: declared, not the preset's plain weight-in: "stack-in". The mark's three bars drop into place top to bottom (expo.out 1.2s, stagger 0.12) while the h1 lines rise from masks and the weight arrives 300 to 400 (Comfortaa's wght floor is 300, so weight-in starts there). The departure scrub then pulls the bars apart.
Palette: light · --surface-0 #FBF8F2 --surface-1 #F3EEE3 --surface-2 #ECE5D6 --surface-3 #E2D9C6
  --ink #221D15 --ink-muted #5C5546 --ink-faint #8B8371 (non-text only) --accent #E4572E --line rgb(34 29 21 / 0.12)
  Inverse panel (the walkthrough, the footer): --inverse #201B13, text #F4EFE4, muted #B5AC99, accent on inverse #FF8A63 (the brand's own inverse tuning of the same flame)
  Accent contrast: 3.47:1 on surface-0, so the flame is fills, rules, large type and UI only, never body links. Button label on flame is ink (4.54:1). ink-muted clears 5.27:1 even on surface-3.
Radius: 12px frames; controls are full pills (the mark's bars are pills)
Icons: Struq Icons, @deckdot/struq-icons (the brand's own set, iconography.md §2 row 1), strokeWidth 1.5, accent = --color-accent, states.css on
Imagery: no grade. The screenshots are evidence and are shown exactly as captured, framed on surface-2 with a hairline. Ratios 16/10 (1440 heroes), device ratios for the four verify shots. Grain none.
Scroll: Lenis lerp 0.1 on gsap.ticker (Soft Modern)
Motion: baseline (Soft Modern soft-precise: expo.out 0.9 to 1.2s entrances, stagger 0.08, scrub 1)

## PLAN
Pages: / (one long page), plus the designed 404. Anchors: #proof, #install, #how, #commands, #inside.
Arc (home):
  1 HERO        [Hook]    s0 · "Design taste for your coding agent." Comfortaa display left, lead, install chip with copy, Star on GitHub; the mark huge on the right, bleeding off the right edge (grid-break 1); on phones and tablets it also runs down across the seam into row 2. Poster meta at the bottom edges. vast 12rem
  2 STATEMENT   [Orient]  s0 · one manifesto line in 20rem of air: "The gap between a template and an award-tier build is not talent. It is a finite set of decisions, made in the right order." breather
  3 BLIND REVIEW[Prove]   s1 · totals 57 to 77, then three rows: brief, scores, invented facts; each a frame where the with-Struq hero wipes over the plain one on scroll. Frames bleed off the right edge (grid-break 2). The honest note on lost craft points. dense 7rem
  4 INSTALL     [Deepen]  s0 · "One command. Every agent." the install line as one big literal-code line with a copy button, the four agent names. breather 18rem
  5 HOW IT RUNS [Deepen]  inverse · SHOWPIECE pin-scrub-timeline: Plan, One stop, Build, Look. The stage opens with a section-curtain clip. showpiece
  6 COMMANDS    [Deepen]  s0 · four commands as oversized literal lines with one sentence each, plus the per-agent invocation note. breather 16rem
  7 INSIDE      [Deepen]  s1 · the recipe as hairline editorial rows beside a sticky heading (grid-break 3), Struq Icons as the last row. dense 7rem
  8 CLOSE       [Invite]  inverse footer · "Give your agent taste." the install chip and Star again, nav echo, meta row, the fit-width wordmark cropped by the bottom edge. Footer-reveal on desktop with motion allowed. vast
  Proof form: the blind review (one form). Pacing: vast, breather, dense, breather, showpiece, breather, dense, vast.
  Surfaces per seam: s0 | s0 (seam carried by the trespassing mark) | s1 | s0 | inverse | s0 | s1 | inverse.
Reveals: hero stack-in (on load) · section h2s SplitText line masks on scroll · rows and blocks transform + autoAlpha stagger 0.08 · proof frames: the scrubbed compare wipe is the entrance (no curtain on top) · svg: the walkthrough's progress bars (scrub)
Showpieces: pin-scrub-timeline at arc row 5 (breather 4 before it, breather 6 after it), gate (min-width: 1024px) and (prefers-reduced-motion: no-preference); below 1024, under reduced motion and without JS it is a stacked list of the four phases, each with its own visual. Total 1.
System recipes: stack-in hero (declared entrance), scrub-hero (the bars drift apart on departure), section-curtain (the inverse stage opens), scrubbed compare wipe (proof frames), fit-width-wordmark, fullscreen-menu (mobile nav, Radix Dialog, lazy-loaded on first tap), footer-reveal (sticky form)
Transitions: none (one-pager) · loader none (an install page should show the command at once)
WebGL: none. The product is type, motion and judgment; a 3D hero would read as a demo reel and cost the first-load budget. Recorded, not forgotten.
Copy budget: h1 6 words; one manifesto line (row 2); section h2s at most 10 words; body 2 to 4 sentences at 44 to 52ch; CTAs "Copy install command", "Star on GitHub"; eyebrows 1 to 3 words.
Assets to produce: none to shoot. Copy and optimize: six compare heroes (1440 by 900 WebP, already under 41 KB each) and four verify shots from the dev-tool build (PNG to WebP, each under 150 KB).

## ASSUMPTIONS
- Non-interactive run: "No veto, go." No materials beyond the brief's list were added.
- Preset Soft Modern for structure and motion; the cream and flame are the brand's own colours, so the "cream plus terracotta with no brand reason" tell does not apply.
- Comfortaa stays on the h1 and the wordmark only (House pairing). The footer ask is the page's other display line and is set in Urbanist 300, so `--font-display` is Urbanist and the h1 uses a separate `--font-brand` token.
- The hero h1 is descriptive ("Design taste for your coding agent."), so it is the real h1 and also the display line (seo.md §1).
- "Award-tier" and "cinematic" are used as the product's own positioning words from the brief and README, never as claims about other sites.
- The walkthrough's four phases follow README "How a build runs"; the gate message quoted in phase 2 is the skill's own wording from direction.md §5.
- The Look phase shows the dev-tool dry run's real verify shots, labelled as such. No other build is shown as if it were a customer's.
- The screenshots are evidence and get no grade, tint or crop beyond their frame.
- No local time in the footer: the brief gives no city.
- 404 page added (seo.md §1) though the brief names one page.

## LOG
- 2026-10-29 Next 16.4 scaffold wires Tailwind through `@tailwindcss/turbopack` in next.config.ts and enables `cacheComponents`; sitemap uses a constant date (setup.md §0).
- 2026-10-29 Hero entrance changed from the preset's weight-in (100 to 300) to the declared stack-in with weight 300 to 400, because Comfortaa's wght axis starts at 300.

- 2026-10-29 Hero mark moved fully inside the first viewport from 1024px up: at the planned size only one and a half bars showed above the fold and read as blobs. The seam into row 2 is kept on phones and tablets only.
- 2026-10-29 Hero eyebrow, lead and CTA moved from a GSAP entrance (hidden until hydration) to a CSS keyframe, so they paint with the HTML. The h1 keeps the SplitText rise.
- 2026-10-29 Footer-reveal: the fixed form needs a measured height, flipped the footer from flow to fixed after hydration (CLS 0.98) and made the footer h2 the LCP. Replaced by the sticky form (footer in flow, sticky bottom under a z-10 main), kept out of paint until the last section approaches. CLS 0.004.
- 2026-10-29 Radix menu lazy-loaded on first tap (next/dynamic): first-load JS 256.0 to 244.8 kB gzip.
- 2026-10-29 opentype.js 1.3: toPathData(2) printed NaN for some shifted glyphs of the Comfortaa WOFF and getKerningValue returned undefined; scripts/wordmark.mjs outlines at the origin, shifts, and serializes the path itself.

## VERIFY
Server: next start on :3207, port owner confirmed with netstat before each capture run; stopped after.
Viewports: 390, 768, 1440, 1920 (shots/home-*-top.png); full pages with reduced motion (1440, 390) and without JS (1440); settled scroll sequence at 1440 (shots/scroll-1440-00 to 20); frame trace at 1440 and 390 (shots/trace/); mobile menu open (shots/menu-390-open.png).
Score: 91/100 (self-audit on the Audit rubric: -3 the footer ask overrides the display token weight with font-light, because one display token serves two faces; -3 no element crosses a seam on desktop since the hero mark moved; -3 the 1920 hero mark is heavy against the light h1)
Vitals: LCP 2.20s mobile 390, 2.42s desktop 1440 (DIV "Design taste", the first split h1 line), 4x CPU, 1.6 Mbps, 150ms · CLS 0.001 / 0.004 · INP field data pending · first-load JS 244.8 kB gzip over 12 scripts, three.js none
Motion: the pin engages and releases with no jump in the scroll sequence, the rail fills continuously; descender test on the real copy (g and y in every masked headline, settled and mid-rise in the trace) passed at 390 and 1440; the h1 is never shown unsplit (frame 0 is mid-rise in its masks); nothing stays at opacity 0; horizontal overflow 0 at all four widths.
Empty regions: none in the reduced-motion, no-JS or settled captures (after pre-scrolling for native lazy images, see FRICTION.md).
Tell scan: no shadow-md/lg, gradients, transition-all, anticipatePin, cliche icons, tracking-tight, ink-faint text, bold display, off-list faces or lorem; mono only on literal commands and the STRUQ.md excerpt; no em or en dashes.
Open: lab numbers only; check LCP and INP on the deployed struq.design. The footer wordmark crop cuts the flame dot in half by design; revisit if it reads as a mistake.
