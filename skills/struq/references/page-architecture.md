# Page Architecture: the Narrative Arc, Section Inventory & Footer

Everything else in Struq makes a *section* excellent; this file decides **which sections exist and in what order**. It is the layer templates fake with "Hero / Features / Testimonials / Pricing / CTA", which is a stack, not a story. Read this **before** picking a vibe preset: the arc determines what you build; the preset determines how it looks.

This file does not write the words. It only sets the *structural* budgets copy must fit (headline lengths, one manifesto line, eyebrow grammar).

---

## 1. The arc: five beats, in order

Every effective marketing/narrative page is the same dramatic shape:

| Beat | Job | Typical sections | Pacing (spacing role) |
|---|---|---|---|
| **Hook** | Stop the scroll; claim a position in one line | Hero | vast: 12 to 20rem, one idea |
| **Orient** | Who this is, in one breath | Intro / positioning statement | breather: a manifesto line (`font-display text-statement`) in 16 to 24rem of air |
| **Prove** | Evidence: the work, the product, the numbers | Selected work / product walkthrough / capabilities | dense: 6 to 8rem, editorial rows |
| **Deepen** | How and why, the thing competitors can't copy | Process / principles / about | medium; this is where the showpiece lives |
| **Invite** | One ask, made unmissable | CTA block + footer | vast again: the close mirrors the open |

Rules the arc enforces:

- **5 to 8 sections total.** More is a pacing failure, not thoroughness, so cut or merge. (A section is a distinct visual movement, not every `<section>` tag.)
- **One idea per beat.** If a section is doing two jobs (proving *and* explaining process), split it or cut half.
- **Pacing alternates.** Dense, then breather, then dense. Two dense sections back-to-back read as a wall; two breathers as emptiness. This is the page-level version of the spacing-asymmetry rule.
- **A showpiece is its own density class.** It is neither dense nor breather, even when it is airy on screen (`manifesto-fill`, a pinned single statement). So "breather, showpiece, breather" is legal and is the pattern (§3); it never counts as two breathers in a row. The no-two-breathers rule applies to plain sections only.
- **The page ends where it started, louder.** The Invite beat re-states the Hook's claim as an action ("Studio for durable brands" becomes "Build something durable. Talk to us.").

**Cheap tell:** Hero → 3-card Features → Stats → Testimonials → Pricing → FAQ → CTA. That is the template stack: every section the same weight, no beat structure. **Instead:** Five beats, alternating density, one showpiece, one ask.

---

## 2. Per-genre section inventories

| Genre | Inventory (in arc order) | Showpiece slot |
|---|---|---|
| **Portfolio** | Hero (name + role claim) → manifesto line → selected work (the meat, 60% of the page) → about/process → contact footer | horizontal work gallery (`pin-horizontal-gallery` in [showcase.md](showcase.md); technique in [pinning-scrub.md](pinning-scrub.md) §2) |
| **Studio / agency** | Hero → positioning statement → selected work → capabilities (editorial rows) → process or principles → CTA + footer | pinned process sequence ([pinning-scrub.md](pinning-scrub.md) §1) |
| **Product launch** | Hero (product as the visual) → the one-line why → product walkthrough → proof (numbers/logos/quotes, pick ONE form) → pricing or waitlist → footer | scrubbed product walkthrough |
| **Campaign / event** | Hero (date/name as display type) → what/why → program or lineup → practical info → register CTA + footer | the hero itself (departure scrub + one act-break curtain) |

Proof sections: choose **one** proof form and do it well: a logo wall *or* two strong pull-quotes *or* three big numbers. Stacking all three is the template reflex; one, art-directed, is the agency move.

Showpiece slots name a technique; the named, copy-ready recipes (with ids) are cataloged in [showcase.md](showcase.md). Pick the recipe there once the slot is decided here.

### 2b. Mapping a niche onto a genre

Struq has no per-niche rulebook in the free skill, so derive the niche decisions in three moves: pick the nearest genre row above, set the proof form and the visitor's fear, then pour a preset from [vibe-presets.md](vibe-presets.md) (its seven axes) over the result. Common mappings:

| Niche (by who signs the check) | Start from genre | The ONE proof form | Visitor fear to design against |
|---|---|---|---|
| Product brand (food/bev, skincare, fashion) | Product launch | the products themselves, shot well | "It will not be as good as the photos" |
| Place people visit (restaurant, hotel, gym, clinic) | Campaign, with the room as the hero | the room and the people in it | "It will feel generic or unwelcoming" |
| Service or practice (legal, medical, consulting, trades) | Studio / agency | two strong pull-quotes or outcomes | "I will be sold to, not helped" |
| Show work (portfolio, photography, architecture) | Portfolio | the work, 60% of the page | "The taste will not hold up" |
| Launch something (SaaS, AI, game, record) | Product launch or Campaign | numbers or the product in motion | "It is vapor, or one more template" |
| Cause or institution (nonprofit, university) | Campaign | three big numbers | "My money or time will be wasted" |

Classify by buyer and business model, not by surface topic: a legal-tech SaaS is a launch page for a software buyer, not a legal-practice page.
---

## 3. Showpiece placement

The 1 to 2 pinned/scrubbed showpieces ([pinning-scrub.md](pinning-scrub.md), catalog in [showcase.md](showcase.md)) are **act-breaks**, and placement is most of their value:

- **Slot A, post-Prove:** after the work/product has earned attention, the showpiece explains *how* (process sequence). The classic studio-site shape.
- **Slot B, the hero itself:** for campaign/launch pages where the product IS the show. If the hero becomes a WebGL scene, see [webgl-r3f.md](webgl-r3f.md) and [webgl-scenes.md](webgl-scenes.md).
- **Never back-to-back.** Two consecutive scroll-jacked sections feel like a hostage situation; separate them with at least one natively-scrolling beat.
- **Breathers flank the showpiece.** A vast, near-empty section before it (anticipation) and after it (recovery). A pin that starts mid-density feels like a malfunction. The showpiece is its own density class (§1), so its flanking breathers never count as two breathers back to back.
- **Never in the Invite beat.** By the close, the user has decided; do not make them scrub through theater to reach the CTA.

---

## 4. Footer anatomy: "designed as hard as the hero," specified

The footer is the Invite beat's second half and the most-skipped design surface on the internet. The agency footer is a **destination**, not a sitemap dump:

| Zone | Content | Treatment |
|---|---|---|
| **The ask** | One oversized CTA line ("Let's talk.", "Start a project") | `font-display text-display`, the footer's hero (the page's one other display line) |
| **Nav echo** | 4 to 7 links max: the header nav repeated, not every route | `font-ui text-ui`, one column |
| **Meta row** | location + local time, email, 2 to 4 socials, legal | `text-ink-muted`, baseline-aligned row |
| **Signature** | wordmark (often oversized/cropped off the bottom edge), © year | the one place giant ghost type is almost always right |

- Surface: step the ladder (footer on `surface-1` under a `surface-0` page, or inverted) so the close registers as a new room.
- The **footer-reveal** pattern, where the page slides up to uncover a fixed footer ([composition.md](composition.md) §5), is the highest-payoff footer move and costs zero JS.
- Local time (`Intl.DateTimeFormat` with the studio's zone) is a tiny detail that signals "real people, real place."
- The oversized ask and wordmark are type decisions: see [typography.md](typography.md) for the fluid display scale.

**Cheap tell:** four columns of gray links on `bg-gray-900`, a newsletter input nobody asked for, social icons in circles. **Instead:** One giant ask, a short nav echo, a meta row, an oversized wordmark, composed like a closing shot.

---

## 5. The copy interface: structural budgets

Copywriting is its own craft; the *architecture* constrains it so display type stays display type:

- **Hero h1: ≤ ~8 words**, breaking into 1 to 3 lines of ≤ ~12ch at display size (`max-w-[12ch]` is the layout guard). Longer claims get demoted to the sub-line.
- **One manifesto line per page**: a single sentence given a whole breather section. More than one and neither is the manifesto.
- **Eyebrow grammar:** 1 to 3 words, uppercase, tracked. A *category label* ("Capabilities", "Selected work"), never a sentence, never punctuated.
- **Section headline: ≤ ~10 words.** Body blocks: `max-w-[44-52ch]`, 2 to 4 sentences per block. Long arguments become editorial rows, not paragraphs.
- **CTA labels: 2 to 4 words, verb-first** ("Start a project", not "Learn more about our services").
- Real copy from the first draft: the baseline's no-lorem rule is architectural, because fake copy hides that a section has no actual job.

---

## 6. Worked example: 7-section studio site, arc annotated

```
1  HERO         [Hook]    "Studio for durable brands", font-display text-display,
                          departure scrub; media punches into §2 (seam #1)
2  POSITIONING  [Orient]  one manifesto line, 20rem air above/below (breather)
3  SELECTED     [Prove]   editorial rows + full-bleed images, dense 6 to 8rem,
   WORK                   sibling-dimming hovers; ghost type crop (grid-break #2)
4  CAPABILITIES [Prove]   hairline-divided list in 16rem breather air after §3's imagery
5  PROCESS      [Deepen]  SHOWPIECE: pinned 3-phase sequence, ≤2.5 viewports,
                          flanked by §4 and §6, both breathers
6  PRINCIPLES   [Deepen]  2 to 3 numbered-ONCE oversized statements, breather spacing (16 to 24rem)
7  CTA + FOOTER [Invite]  footer-reveal; "Let's build something durable." as
                          the close: the hero's claim, made an action
```

Pacing trace: vast → breather → dense → breather → showpiece → breather → vast. Two grid-breaks, one showpiece, one proof form (the work itself), one ask.

---

## Architecture checklist (run before building anything)

- [ ] Every section assigned to a beat; any section without a beat is cut
- [ ] 5 to 8 sections; density alternates; one manifesto breather exists
- [ ] Exactly one proof form chosen
- [ ] Showpiece (if any) at an act-break, flanked by calm, never doubled, recipe picked from [showcase.md](showcase.md)
- [ ] Footer designed to the §4 anatomy before calling the page done
- [ ] Hero h1 ≤8 words; every CTA verb-first; no section doing two jobs
