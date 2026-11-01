# Showpieces (toonstuk)

The award-tier scenes the Build checklist picks from (SKILL.md, Step 8). One file per showpiece, named by its stable slug, the same slug the Struq MCP and the website library use. `scripts/recipes.mjs` copies them to `components/struq/showpieces/`.

| Slug | Component | Lead for |
|---|---|---|
| `toonstuk-image-to-fullbleed` | `ImageToFullbleed` | product launch, a portfolio without project photos, anything else |
| `toonstuk-panel-wipe` | `PanelWipe` | restaurant, hospitality, hotel |
| `toonstuk-scrub-connector` | `ScrubConnector` | agency, creative brand |
| `toonstuk-project-stack` | `ProjectStack` | architect or studio with real project photos |
| `toonstuk-manifesto-scrub` | `ManifestoScrub` | editorial; the supporting move for hospitality |
| `toonstuk-fill-rows` | `FillRows` | the supporting move for an agency |
| `toonstuk-wordmark-finale` | `WordmarkFinale` | every site's footer |
| `toonstuk-pixel-resolve` | `PixelResolve` | the supporting move for a product launch hero |

Every recipe runs on the one clock (GSAP ScrollTrigger on Lenis), pins with `scrub` and never `anticipatePin`, holds on its key frames, and has a composed still for phones and reduced motion. The first key frame of the clip-based ones is set in `globals.css` (the motion gate), so nothing flashes before it.

Learned from Roy's award-tier references (struq-assets/references/award-tier-2026-11); no layout, copy or image of a reference is in these files.
