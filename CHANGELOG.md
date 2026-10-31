# Changelog

## 0.3.0 (unpublished, on feat/skill-0.3)

The skill is rebuilt around one critical path a small model can follow: a Build checklist ticked in STRUQ.md, tested components instead of hand-written plumbing, and scripts that check the result.

### The critical path
- One Build checklist in SKILL.md, ticked in STRUQ.md; `check.mjs` fails while a line is open.
- Exactly one stop for approval, with the materials request ("Akkoord? Heb je een logo, foto's of echte cijfers, stuur ze nu."). The build request is not the approval: the user's reply is logged word for word as `Step 2 Approval` with a `Reply:` line, and `check.mjs` fails without it.
- Every site keeps STRUQ-LOG.md (append only), written by the agent with `log.mjs` and by the scripts themselves.

### Struq's canon and the beeldbank
- `canon.mjs`: Struq's palettes, pairings and design systems written into the project (OKLCH tokens, Google and Fontshare fonts), with Struq's overrides (no Inter, free stand-ins for commercial faces).
- `images.mjs`: a beeldbank pack downloaded and verified, graded fallback plates when struq.nl is unreachable, so no frame is ever empty.
- `packs.mjs`: the pack rule Struq's MCP uses. A sector word picks its pack (whole words), a product launch without one gets `vitrine` with the hero scene carrying the product, vehicle words never pull a brief to freight (`transit` is logistics only), anything else gets `halide`.
- `images.mjs --brief`: picks the pack by that rule and leaves out the photos whose alt names a subject the client does not do (a fish restaurant gets no flour and dough from `proof`), best fits first. Captions are written from the alts.
- `STRUQ_API_BASE` points the scripts at staging for tests; users never set it.

### Recipes
- Lenis on the GSAP ticker, SplitText hero, Reveal, MediaFrame (curtain reveal and parallax), HorizontalGallery and PinnedZoom showpieces, MagneticButton, Cursor.
- HeroCanvas with three scenes (contours, ripple, dots) at the ambient-backdrop bar: quiet zones behind `[data-quiet]` copy, pointer presence, a slow clock, a DPR cap and pixel budget, a still frame on phones and under reduced motion. Contours runs two passes and drifts at Vapor's pace.
- The cursor stays hidden until a real pointer travels, rests out of sight when the pointer rests, and never shows on touch or under reduced motion.

### Rules and the check
- One combined tell list (Struq's tells 1.2.0, the slop audit, Roy's rules), with `check.mjs` as its executable form: eyebrows and uppercase labels, gradients, tinted fills, pills and live dots, mono, default faces, blue and purple, dashes, Struq's generic CTAs ("Neem contact op", "Meer informatie", "Aan de slag" and the rest) and more.
- The hero carries a pack photo; the WebGL field is atmosphere beside or behind the copy, held by the quiet zone; every page has a header wordmark (`data-wordmark`); the client's product is never modelled from primitives. `check.mjs` fails each.
- No eyebrows anywhere in the references; the niche packets are back from deck-design with Struq's overrides.
