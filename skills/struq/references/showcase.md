# Showcase Recipes

A showcase is the section people screen-record. Every award-tier site has one or two, never six. This file is the catalog: each recipe has a stable **id**, so STRUQ.md can name it (`Showpieces: pin-horizontal-gallery at arc row 3`) and the build loads exactly one reference section.

Every id carries a **kind**:

- **`showpiece`**: a staged moment that counts against the budget of 1 to 2 per site.
- **`system`**: part of the site's machinery (hero entrance, menu, route curtain, image reveal). It does not count against the budget and can run on every page. List these under `System recipes:` in STRUQ.md PLAN.

## Choosing

1. **Budget:** one `showpiece` for a landing page, two for a long narrative or portfolio site. A third reads as a demo reel, not a site. `system` ids are free of the budget but still obey the motion baseline.
2. **Placement:** at act breaks ([page-architecture.md](page-architecture.md) §3), with a breather before and after. A showpiece is its own density class, so "breather, showpiece, breather" is the pattern, even when the showpiece itself is airy (`manifesto-fill`). Never as the first thing under the hero and never two in a row; a quiet section between them is what makes each one land.
3. **Content first:** a showpiece needs material worth staging. A horizontal gallery with four weak images is worse than a static grid.
4. **No real imagery yet?** The Struq beeldbank pack fills every media slot, so a media-led showpiece has real photos from the first build ([struq-imagery.md](struq-imagery.md)). Never grey boxes, never placeholder frames.
5. **Mobile is authored, not shrunk:** every recipe below names its touch behavior. Build it at the same time as the desktop version.
6. **Cost** is implementation and debugging time: **S** is under an hour, **M** is a few hours, **L** is a day or more.

## The catalog

### Scroll-pinned

| id | Kind | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|---|
| `pin-scrub-timeline` | showpiece | The section locks while a multi-step timeline plays against scroll: frames swap, copy steps through, an object transforms | Product stories, "how it works" with real visuals | M | Shorter scroll budget; keep the pin if the timeline is legible at 390, otherwise stack the steps | [pinning-scrub.md](pinning-scrub.md) §1 |
| `pin-horizontal-gallery` | showpiece | Vertical scroll drives a horizontal track of large frames | Portfolios, case studies, collections | M | Pin on desktop, native swipe on touch | [pinning-scrub.md](pinning-scrub.md) §2 and §4 |
| `scrub-hero` | system | The hero image or headline scales, clips or drifts as the first scroll happens, no pin | Any site with one strong hero image | S | Same effect, smaller travel | [pinning-scrub.md](pinning-scrub.md) §3 |
| `sticky-stack` | showpiece | Cards or panels stick and stack over each other, each one scaling back as the next arrives | Services, principles, three to five strong points | M | Keep, reduce scale-back | [depth-parallax.md](depth-parallax.md) §3 |
| `path-journey` | showpiece | An SVG line draws itself down the page as you scroll, connecting the sections | Process, timelines, brand stories | M | Simplify the path, keep the draw | [svg-motion.md](svg-motion.md) |

### Type-led

| id | Kind | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|---|
| `manifesto-fill` | showpiece | A large paragraph whose words fill from muted to full ink as you scroll | Mission statements, about pages, the "why" | S | Keep | [typography.md](typography.md) |
| `scrub-headline` | system | An oversized headline tracks, scales or slides with scroll and runs off the canvas | Section openers, editorial sites | S | Smaller travel | [typography.md](typography.md) |
| `ghost-marquee` | system | Huge muted solid type (`text-ghost`, never outlined) drifting behind content, speed tied to scroll | Breathers between dense sections | S | Keep, slower | [depth-parallax.md](depth-parallax.md) §4 |
| `line-rise-hero` | system | The hero headline rises line by line out of masks on load | The delivery of a preset entrance that includes it (Warm Editorial rises, then soft-scrubs) or a declared fallback. The tell is precise: the rise as the hero's only gesture, with no signature move on the hero and no preset entrance behind it | S | Keep | [typography.md](typography.md) §5, [scroll-reveals.md](scroll-reveals.md) §3, [page-entrances.md](page-entrances.md) |

### Media-led

| id | Kind | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|---|
| `curtain-reveal` | system | Images open bottom-up from a clip while the inner image settles from a slight scale | Editorial media rows, case study covers | S | Keep | [scroll-reveals.md](scroll-reveals.md) §2C |
| `masked-parallax` | system | Images drift inside their frames as the page scrolls | Any image-heavy section | S | Reduce or drop drift | [depth-parallax.md](depth-parallax.md) §2 |
| `layered-depth` | showpiece | Foreground, midground and background layers moving at different speeds | Hero scenes, illustrated brands | M | Fewer layers | [depth-parallax.md](depth-parallax.md) §1 |
| `expand-to-detail` | showpiece | A card or thumbnail grows seamlessly into its detail view | Work grids, product lists | M | Keep | [transitions.md](transitions.md) §3, [gsap-api.md](gsap-api.md) §7 |
| `hover-distortion-gallery` | showpiece | Images ripple or bend under the cursor via a shader | Portfolios, fashion, art | L | Static images on touch | [webgl-scenes.md](webgl-scenes.md) |

### Page flow

| id | Kind | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|---|
| `route-curtain` | system | A full-screen panel covers the page, the route swaps underneath, the panel reveals the new page | Every multi-page site | M | Keep | [route-transitions.md](route-transitions.md) |
| `section-curtain` | system | An in-page full-bleed wipe between two chapters | Long one-pagers | S | Keep | [transitions.md](transitions.md) §2 |
| `logo-morph` | system | The mark morphs into an icon or a different shape between states or routes | Brands with a strong mark | M | Keep | [svg-motion.md](svg-motion.md) |
| `draw-mark-loader` | system | The logo draws itself on first visit, then the page reveals | Portfolios, studios, launches | S | Keep, shorter | [loaders.md](loaders.md), [svg-motion.md](svg-motion.md) |
| `fullscreen-menu` | system | The menu opens as a full-screen, art-directed overlay with staggered links | Every site with more than four pages | M | This is the mobile nav | [nav-header.md](nav-header.md) |

### 3D

| id | Kind | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|---|
| `product-rig` | showpiece | A 3D product that turns with scroll and tilts toward the pointer | Physical products, hardware | L | Scroll only, no tilt; poster below the performance floor | [webgl-scenes.md](webgl-scenes.md), [webgl-r3f.md](webgl-r3f.md) |
| `ambient-hero-scene` | showpiece | A restrained 3D object or field behind the hero, lit by an environment, with grain and vignette | Tech, luxury, launches | M | Lower DPR, or poster | [webgl-scenes.md](webgl-scenes.md) |
| `particle-field` | showpiece | A small point field reacting to the cursor and scroll velocity | One breather moment | M | Fewer points, no pointer | [webgl-scenes.md](webgl-scenes.md) |
| `directed-experience` | showpiece | The whole page is one continuous 3D stage with chapters and camera shots | Launch experiences, flagship brand sites | L+ | Authored mobile shots | [../cinematic/README.md](../cinematic/README.md) |

`directed-experience` spends the whole budget on its own: it is Directed mode, not a section.

## Good pairings

At most two showpieces each; the system ids around them set the rhythm and do not compete. "The preset's hero entrance" is the one named in [vibe-presets.md](vibe-presets.md) (`weight-in`, soft-scrub plus line rise, `match-cut-hero`, `clip-line-hero`), never a bare line rise:

- **Studio portfolio:** showpieces `pin-horizontal-gallery`, `manifesto-fill` · system `draw-mark-loader`, the preset's hero entrance, `route-curtain`, `fullscreen-menu`
- **Product launch:** showpieces `pin-scrub-timeline`, `sticky-stack` (or `ambient-hero-scene` in place of `sticky-stack` when the product exists in 3D) · system `scrub-hero`, the preset's hero entrance, `fullscreen-menu`
- **Editorial or brand story:** showpiece `path-journey` · system the preset's hero entrance, `curtain-reveal`, `ghost-marquee`, `section-curtain`
- **Luxury:** showpiece `expand-to-detail` · system the preset's hero entrance, `masked-parallax`, `route-curtain` (everything slower, longer holds, recorded as a motion deviation)
- **No real imagery yet:** showpiece `manifesto-fill` · system the preset's hero entrance, `scrub-headline`, `ghost-marquee`, `section-curtain`

## Never

- Two pinned recipes back to back
- A showpiece in the first 100vh under the hero, unless it **is** the hero
- A showpiece without a reduced-motion version (the content must still read as a static layout, and the server markup is that layout: nothing hidden by inline styles, [pitfalls.md](pitfalls.md) §2)
- A recipe chosen because it is impressive rather than because the content earns it
- A media-led showpiece staged on empty frames (a 3D product built from primitives counts, unless it is a declared stand-in per [webgl-scenes.md](webgl-scenes.md) §4, "No model file yet")
