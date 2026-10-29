# Brand: name, logo, mark and the files a site needs

Run this when the project has no name or no logo. When a brand exists, do not redesign it; extract it ([direction.md](direction.md) §2). The output is small on purpose: a name, a wordmark, a mark, the favicon set, and one voice line. A brand guideline PDF is not the job. A site that carries the brand is.

Order matters: **positioning, then name, then type, then logo.** A name chosen first forces the positioning to be bent around it. A logo drawn before the typefaces are chosen never sits right in the site.

## 1. Positioning in two lines

Before naming anything, write:

- **For** <who, specifically> **who** <the need or the frustration>, **<name> is** <the category> **that** <the one thing it does differently>.
- **Unlike** <the real alternative, including "do it yourself"> **it** <the difference that matters to the buyer>.

If these two lines cannot be written, the brief is missing the facts the name depends on. Ask for them (one round) instead of naming in the dark.

## 2. Naming

**Skip rule.** Sites for a person, a practice or a founder-named business (portfolios, studios named after people, clinics) use the person's name. If the name is unknown, use a placeholder, record it under ASSUMPTIONS in STRUQ.md, skip this section and go straight to the wordmark (§3).

### Territories

Generate across all four, three to four candidates each, so the shortlist is a real choice and not twelve variations of one idea:

| Territory | What it is | Strength | Risk |
|---|---|---|---|
| **Descriptive** | Says what it does (a real word or two) | Instantly clear, good for local services | Hard to own, hard to trademark |
| **Evocative** | A real word that carries the feeling or the metaphor from the concept | Memorable, ownable, carries the motif | Needs the site to explain it |
| **Invented** | A coined word built from meaningful roots or sounds | Fully ownable, domain-friendly | Empty until the brand fills it |
| **Founder or place** | A surname, a street, a landmark, a region | Credible, personal, honest | Hard to sell later |

### The filter

Score every candidate, drop anything that fails a hard rule:

- **Hard:** easy to say on first sight, easy to spell after hearing it once, no obvious clash with a major brand in the same category, no unfortunate meaning in the client's main languages.
- **Soft (rank by):** one or two syllables beats three; a distinctive first letter; works as a wordmark (letter shapes with character, no awkward pairs); a plausible domain or handle pattern (`name.com`, `getname.com`, `name.studio`, the country TLD).

**You cannot verify trademarks or domain availability.** Say so plainly next to the shortlist and tell the user what to check before committing.

### The deliverable

A shortlist of five with one line each (territory, why it fits the positioning, the risk), and one recommendation with the reason. Write it to `brand/NAMING.md`. In a non-interactive run, take the recommendation and record it under ASSUMPTIONS.

## 3. The wordmark

The wordmark is the name set in type, then drawn into something ownable. Start from the **display face chosen in the SYSTEM phase** ([typography.md](typography.md)), so the logo and the headlines are one family of shapes.

1. Set the name in the display face at the weight the site uses (light, 300 to 400) and one step heavier. Pick the one that holds at 24px tall.
2. Tune it as a logo, not as text: tracking a little tighter than headline tracking, kern every pair by eye, decide on case (lowercase reads friendly, caps read institutional, title case reads like a person's name).
3. Make **one** deliberate modification. That single change turns a font into a logo: a cut terminal, a joined pair (ligature), a letter replaced by the mark, a counter filled, a stroke extended into a line that the site's motif can continue. Never more than one.
4. Convert to outlines, so the logo does not depend on the font loading:

```bash
npm i -D opentype.js
```

```js
// scripts/wordmark.mjs:
//   node scripts/wordmark.mjs "Name" path/to/Display-Light.ttf -0.02 > brand/logo.svg
// Third argument: tracking in em (the tuned value from step 2). Default -0.02.
import { readFile } from "node:fs/promises";
import opentype from "opentype.js";

const [text, fontPath, trackingEm = "-0.02"] = process.argv.slice(2);
// Newer opentype.js majors removed load(); parse() works on every version.
const font = opentype.parse(await readFile(fontPath));
const escapeAttr = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const size = 100;
const tracking = Number(trackingEm) * size;

// One glyph per character, no shaping: font.stringToGlyphs() runs the ccmp feature
// and throws on GSUB lookups opentype.js does not support yet (seen on variable fonts).
const glyphs = Array.from(text, (ch) => font.charToGlyph(ch));
if (glyphs.some((g) => g.index === 0)) console.error("warning: a character is missing from the font");

let x = 0;
const parts = [];
const box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
glyphs.forEach((glyph, i) => {
  const path = glyph.getPath(x, 0, size); // baseline at y = 0
  const b = path.getBoundingBox();
  if (!b.isEmpty()) {
    box.x1 = Math.min(box.x1, b.x1); box.y1 = Math.min(box.y1, b.y1);
    box.x2 = Math.max(box.x2, b.x2); box.y2 = Math.max(box.y2, b.y2);
  }
  parts.push(path.toPathData(2)); // a number keeps y unflipped
  const kern = glyphs[i + 1] ? font.getKerningValue(glyph, glyphs[i + 1]) : 0;
  x += ((glyph.advanceWidth + kern) / font.unitsPerEm) * size + tracking;
});

// The viewBox hugs the ink, descenders included, so the logo aligns by its real edges.
const vx = Math.floor(box.x1), vy = Math.floor(box.y1);
const vw = Math.ceil(box.x2) - vx, vh = Math.ceil(box.y2) - vy;
console.log(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" fill="currentColor" role="img" aria-label="${escapeAttr(text)}"><path d="${parts.join(" ")}"/></svg>`
);
```

Use a **static** file of the chosen weight. A variable file outlines its default instance, usually 400, not the light weight the site uses. The reliable source an agent can fetch without downloading archives is Fontsource on npm, which ships one static file per weight, including for families Google serves as variable only (Sora, for one): `npm i -D @fontsource/<family>`, then use `node_modules/@fontsource/<family>/files/<family>-latin-300-normal.woff`. opentype.js parses WOFF (not WOFF2), and `next/og` reads the same WOFF ([seo.md](seo.md) §3), so copy it once to `assets/fonts/` (outside `public/`) and point both scripts at it. A static TTF or OTF from the foundry works the same way. The script applies the font's own pair kerning plus your tracking; for a hand-kerned result, export each glyph as its own `<path>` and adjust `x` per pair, or finish the outline in a vector editor. Apply the one modification from step 3 on the outlined paths.

5. Use `fill="currentColor"`, so the logo takes the ink color in light and dark surfaces without a second file.
6. **Test the modification at nav size** (about 1.25 to 1.5rem tall). A thin full-width rule under a word reads as a link underline there, and a cut terminal can vanish. If it fails at nav size, make it thicker, shorter or part of a letter. The modification goes into the SVG as its own element after the outlined path (a `<rect>`, a `<path>`), so it can be tuned without re-outlining.

## 4. The mark

The mark is the logo reduced to one shape that works at 16px: the favicon, the loader, the menu button, the social avatar. Draw it as SVG by construction, never by freehand path guessing:

- **Monogram:** the first letter from the wordmark outlines, with the same modification, sitting in a deliberate bounding shape (or none).
- **Symbol:** built from the concept's motif with primitives (`circle`, `rect`, `line`, arcs) on a 24 or 48 unit grid. Whole or half units only. One stroke weight or one fill, never both.
- **Test** at 16, 32 and 512px, on the darkest and lightest surface in the palette. If it turns to mush at 16px, simplify.

Build it so it can move. Strokes (not fills) can be drawn on with DrawSVG for the `draw-mark-loader`; a mark built from the same number of points as a second shape can morph into it for `logo-morph` ([svg-motion.md](svg-motion.md), [showcase.md](showcase.md)).

## 5. The file set

Write these, wired into the framework's conventions (Next.js App Router shown):

| File | What |
|---|---|
| `brand/logo.svg` | Wordmark, outlined, `currentColor` |
| `brand/mark.svg` | Mark, outlined, `currentColor` |
| `components/brand/Logo.tsx` | Both inlined as components with a `title` for accessibility, so they can animate and take color |
| `app/icon.svg` | The mark on a solid surface tile; check it at 16px |
| `app/apple-icon.png` | 180 by 180, the mark on the surface color with padding |
| `app/opengraph-image.tsx` | Owned by [seo.md](seo.md) §3, and built in the SEO workflow step once the routes exist. The brand supplies the wordmark, surface color and display face it uses. |

Vite: the same SVGs in `public/` and `<link rel="icon" type="image/svg+xml">`; the static OG PNGs are covered in [seo.md](seo.md) §7.

## 6. Voice

One line in STRUQ.md that every piece of copy is checked against: register, sentence length, what it never does. For example: "plain and certain; short sentences; numbers instead of adjectives; never exclamation marks, never 'unlock' or 'elevate'." The copy rules in [page-architecture.md](page-architecture.md) §5 apply on top.

## Tells

- A name chosen before the positioning exists
- Twelve candidates that are one idea in twelve spellings
- A wordmark in a different family from the site's display face, for no reason
- Three modifications on one wordmark
- A mark that is a generic icon (a leaf, a lightbulb, a rocket, an abstract swoosh, a hexagon network)
- A gradient logo, a logo that only works on one background
- A favicon that is the full wordmark at 16px
- Claiming a name is "available" without having checked
