# Mobile Composition: translating the art direction to 360-430px

The scaling knob ([scaling.md](scaling.md)) already solves *sizing* on mobile, so do **not** re-introduce breakpoint size ladders here. What the knob can't solve is *composition*: overlaps, asymmetric grids, and lockups are authored in twelve columns, and a naive `grid-cols-1` collapse turns art direction back into the centered-stack template. This file is the translation table.

The principle: **mobile keeps the attitude, not the geometry.** Asymmetry, trespass, and scale contrast must survive; the specific desktop arrangement doesn't. A mobile page that is a centered column of full-width blocks has lost the design even if every rem is correct.

---

## 1. Translation table: every desktop technique, its mobile form

| Desktop technique | Mobile translation | What survives |
|---|---|---|
| **Layered lockup** ([composition.md](composition.md) §3): type and image sharing grid cells | Stack, but keep a *deliberate small overlap*: headline pulls `-mb-[0.5em]` over the image top (or image pulls under the headline's last line). Drop `mix-blend-difference` if the overlap zone gets busy at small width; a `pointer-events-none` scrim or plain ink type is more legible | the trespass |
| **Asymmetric 12-col rows** (features as editorial rows, [anti-patterns.md](anti-patterns.md) §2) | Single column with **alternating indents** (`even:pl-[10vw]`) or a hanging eyebrow column (`grid-cols-[5rem_1fr]`). Never centered | the off-axis rhythm |
| **Section bleed / seam** ([composition.md](composition.md) §1) | Keep it: negative margins are width-independent. Reduce overlap depth ~50% (`-mb-16` not `-mb-32`) so the seam doesn't eat a whole viewport | the trespass |
| **Full-bleed breakout** ([composition.md](composition.md) §2) | The `content-grid` collapses gracefully (side lanes hit their 1.5rem floor), but full-bleed only *contrasts* if contained content is visibly inset. Keep body at the `content` lane; never let everything go edge-to-edge | contained vs escaping |
| **Off-canvas ghost type** ([composition.md](composition.md) §4) | Shrink to ~24-30vw and keep the crop, or drop it. At 18vw-of-360px it's a smudge: if it can't be huge, it shouldn't exist | scale contrast (or nothing) |
| **Hero composition** | Poster logic still applies: left-aligned h1 (centered mobile heroes = template), meta pushed to the hero's edges, media bleeding off one side rather than politely contained | the poster edges |
| **Sticky-stack cards** ([depth-parallax.md](depth-parallax.md) §3) | **Keep**: sticky stacking is touch-native. Cards go `min-h-[100svh]` → content-height + `top` offset; keep the recede scrub | everything |
| **Pinned / horizontal showpieces** | Never pin on touch. The §4 matchMedia + scroll-snap fallback in [pinning-scrub.md](pinning-scrub.md) is the law, not a suggestion | the content, natively |
| **Multi-speed parallax** ([depth-parallax.md](depth-parallax.md) §1) | Halve the deltas (0.95/1/1.06) or drop to window-parallax only, since small screens amplify relative motion | one breathing layer |
| **Footer-reveal** ([composition.md](composition.md) §5) | Keep if the footer fits `~60svh` at mobile width; otherwise release to normal flow (`fixed` + tall footers = covered content) | the close |

---

## 2. Mobile rhythm: the numbers

Section padding compresses to roughly **60% of the desktop role values**, keeping the *ratio* between roles (the asymmetry is the design; the absolute air is negotiable):

| Role | Desktop | Mobile |
|---|---|---|
| Hero | 12-20rem | 8-12rem |
| Dense content | 6-8rem | 4-5rem |
| Breather | 16-24rem | 10-14rem |

- Express the compression **structurally** (`py-16 md:py-28`, a layout decision and therefore allowed) or via a `--section-pad` token per role. This is not a size ladder, it's one deliberate rhythm change.
- **Display type floor:** hero h1 bottoms out ~2.5rem. `clamp(2.5rem, 8vw, 9rem)` already handles it; check the *line count* instead: a mobile hero h1 over 4 lines needs shorter copy ([page-architecture.md](page-architecture.md) §5), not smaller type.
- Body measure self-solves via the root knob; check `min-h-[100vh]` sections use `svh` so mobile browser chrome doesn't cause jumps.
- Horizontal padding: 1.25 to 1.5rem lanes; keep at least one element per screen *ignoring* them (a bleed, a crop) so mobile keeps its grid-breaks too.

---

## 3. What to cut vs keep

**Cut on touch (already hover-gated; verify, don't assume):** magnetic buttons, cursor followers, hover scenes ([micro-interactions.md](micro-interactions.md) gates them via `(hover: hover)`). Sibling-dimming and tag-slides need a non-hover story: default-visible tags, or active-state on tap.

**Keep, tuned:**
- Reveals and staggers: shorten travel (`y: 24` not 80) and durations ~15%; small screens exaggerate motion.
- Split-line headlines: `autoSplit` re-splits at mobile line breaks for free ([scroll-reveals.md](scroll-reveals.md) §3).
- The departure scrub ([pinning-scrub.md](pinning-scrub.md) §3): no pin, so it's touch-safe as-is.
- Lenis: keep mounted (the provider doctrine, [setup.md](setup.md) §2). It applies lightly or not at all to native touch scrolling, and the ScrollTrigger wiring stays consistent.

**Branch declaratively**, one `gsap.matchMedia()` block per component, the same pattern as reduced-motion ([setup.md](setup.md) §4). Never `if (window.innerWidth < 768)` at setup time: it doesn't revert on rotate/resize.

---

## 4. The two-viewport check

Design every section at **1440 and 390 simultaneously**, not desktop-then-shrink. Before moving on, ask of the 390 view:

1. Is anything overlapping, bleeding, or cropped, or did it collapse to a centered stack?
2. Do two consecutive sections still have different skeletons?
3. Is the display type still *display* (≥3× body scale contrast)?
4. Can a thumb reach/operate everything (48px targets, no pin traps)?
5. Does the showpiece content still exist (as snap-scroll or stacked list), even though the showpiece mechanics don't?

**Cheap tell:** a mobile view where every section is a centered full-width column: same skeleton repeating, overlaps gone, ghost type gone, hero centered. The art direction evaporated below 768px.
**Instead:** The 390px page still has trespassing elements, alternating indents, one crop, poster-edge heroes, and compressed-but-asymmetric rhythm. It is recognizably the same design, recomposed.
