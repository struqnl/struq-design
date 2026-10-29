# Showcase Recipes

A showcase is the section people screen-record. Every award-tier site has one or two, never six. This file is the catalog: each recipe has a stable **id**, so a BUILD PLAN can name it (`showpieces: [pin-horizontal-gallery, manifesto-fill]`), a client can point at its live demo, and the build loads exactly one reference section.

## Choosing

1. **Budget:** one showpiece for a landing page, two for a long narrative or portfolio site. A third reads as a demo reel, not a site.
2. **Placement:** at act breaks ([page-architecture.md](page-architecture.md) §3). Never as the first thing under the hero and never two in a row; a quiet section between them is what makes each one land.
3. **Content first:** a showpiece needs material worth staging. A horizontal gallery with four weak images is worse than a static grid. If the assets are not there, pick a type-led recipe.
4. **Mobile is authored, not shrunk:** every recipe below names its touch behavior. Build it at the same time as the desktop version.
5. **Cost** is implementation and debugging time: **S** is under an hour, **M** is a few hours, **L** is a day or more.

## The catalog

### Scroll-pinned

| id | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|
| `pin-scrub-timeline` | The section locks while a multi-step timeline plays against scroll: frames swap, copy steps through, an object transforms | Product stories, "how it works" with real visuals | M | Shorter scroll budget; keep the pin if the timeline is legible at 390, otherwise stack the steps | [pinning-scrub.md](pinning-scrub.md) §1 |
| `pin-horizontal-gallery` | Vertical scroll drives a horizontal track of large frames | Portfolios, case studies, collections | M | Pin on desktop, native swipe on touch | [pinning-scrub.md](pinning-scrub.md) §2 and §4 |
| `scrub-hero` | The hero image or headline scales, clips or drifts as the first scroll happens, no pin | Any site with one strong hero image | S | Same effect, smaller travel | [pinning-scrub.md](pinning-scrub.md) §3 |
| `sticky-stack` | Cards or panels stick and stack over each other, each one scaling back as the next arrives | Services, principles, three to five strong points | M | Keep, reduce scale-back | [depth-parallax.md](depth-parallax.md) §3 |
| `path-journey` | An SVG line draws itself down the page as you scroll, connecting the sections | Process, timelines, brand stories | M | Simplify the path, keep the draw | [svg-motion.md](svg-motion.md) |

### Type-led

| id | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|
| `manifesto-fill` | A large paragraph whose words fill from muted to full ink as you scroll | Mission statements, about pages, the "why" | S | Keep | [typography.md](typography.md) |
| `scrub-headline` | An oversized headline tracks, scales or slides with scroll and runs off the canvas | Section openers, editorial sites | S | Smaller travel | [typography.md](typography.md) |
| `ghost-marquee` | Huge outlined or muted type drifting behind content, speed tied to scroll | Breathers between dense sections | S | Keep, slower | [depth-parallax.md](depth-parallax.md) §4 |
| `line-rise-hero` | The hero headline rises line by line out of masks on load | Every site; the default hero entrance | S | Keep | [scroll-reveals.md](scroll-reveals.md) §3, [page-entrances.md](page-entrances.md) |

### Media-led

| id | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|
| `curtain-reveal` | Images open bottom-up from a clip while the inner image settles from a slight scale | Editorial media rows, case study covers | S | Keep | [scroll-reveals.md](scroll-reveals.md) §2C |
| `masked-parallax` | Images drift inside their frames as the page scrolls | Any image-heavy section | S | Reduce or drop drift | [depth-parallax.md](depth-parallax.md) §2 |
| `layered-depth` | Foreground, midground and background layers moving at different speeds | Hero scenes, illustrated brands | M | Fewer layers | [depth-parallax.md](depth-parallax.md) §1 |
| `expand-to-detail` | A card or thumbnail grows seamlessly into its detail view | Work grids, product lists | M | Keep | [transitions.md](transitions.md) §3, [gsap-api.md](gsap-api.md) §7 |
| `hover-distortion-gallery` | Images ripple or bend under the cursor via a shader | Portfolios, fashion, art | L | Static images on touch | [webgl-scenes.md](webgl-scenes.md) |

### Page flow

| id | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|
| `route-curtain` | A full-screen panel covers the page, the route swaps underneath, the panel reveals the new page | Every multi-page site | M | Keep | [route-transitions.md](route-transitions.md) |
| `section-curtain` | An in-page full-bleed wipe between two chapters | Long one-pagers | S | Keep | [transitions.md](transitions.md) §2 |
| `logo-morph` | The mark morphs into an icon or a different shape between states or routes | Brands with a strong mark | M | Keep | [svg-motion.md](svg-motion.md) |
| `draw-mark-loader` | The logo draws itself on first visit, then the page reveals | Portfolios, studios, launches | S | Keep, shorter | [loaders.md](loaders.md), [svg-motion.md](svg-motion.md) |
| `fullscreen-menu` | The menu opens as a full-screen, art-directed overlay with staggered links | Every site with more than four pages | M | This is the mobile nav | [nav-header.md](nav-header.md) |

### 3D

| id | What the viewer sees | Best for | Cost | Touch / mobile | Build from |
|---|---|---|---|---|---|
| `product-rig` | A 3D product that turns with scroll and tilts toward the pointer | Physical products, hardware | L | Scroll only, no tilt; poster below the performance floor | [webgl-scenes.md](webgl-scenes.md), [webgl-r3f.md](webgl-r3f.md) |
| `ambient-hero-scene` | A restrained 3D object or field behind the hero, lit by an environment, with grain and vignette | Tech, luxury, launches | M | Lower DPR, or poster | [webgl-scenes.md](webgl-scenes.md) |
| `particle-field` | A small point field reacting to the cursor and scroll velocity | One breather moment | M | Fewer points, no pointer | [webgl-scenes.md](webgl-scenes.md) |
| `directed-experience` | The whole page is one continuous 3D stage with chapters and camera shots | Launch experiences, flagship brand sites | L+ | Authored mobile shots | [../cinematic/README.md](../cinematic/README.md) |

## Good pairings

These combinations have a clear rhythm and do not compete:

- **Studio portfolio:** `draw-mark-loader`, `line-rise-hero`, `pin-horizontal-gallery`, `manifesto-fill`, `route-curtain`
- **Product launch:** `scrub-hero` or `ambient-hero-scene`, `pin-scrub-timeline`, `sticky-stack`, `fullscreen-menu`
- **Editorial or brand story:** `line-rise-hero`, `curtain-reveal`, `path-journey`, `ghost-marquee`
- **Luxury:** `line-rise-hero`, `masked-parallax`, `expand-to-detail`, `route-curtain` (everything slower, longer holds)

## Never

- Two pinned recipes back to back
- A showpiece in the first 100vh under the hero, unless it **is** the hero
- A showpiece without a reduced-motion version (the content must still read as a static layout)
- A recipe chosen because it is impressive rather than because the content earns it
