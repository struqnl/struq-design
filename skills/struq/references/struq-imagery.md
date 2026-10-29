# Struq imagery: the beeldbank before stock

## Decide here

Planning reads only this section ([direction.md](direction.md) §4); the rest is for the build.

- **When:** the brief has no photos of its own, or only some. The client's own photos always come first ([imagery.md](imagery.md) §4, rung 1); the beeldbank fills what is left, before generated images and long before stock.
- **What it is:** Struq's own beeldbank at [struq.nl/beeldbank](https://struq.nl/beeldbank): twenty sector packs of 24 real photographs each, every pack shot and graded as one set. CC0; credit to struq.nl is appreciated, not required, and a Struq build gives it anyway (§5).
- **One pack per site.** Each pack carries one grade, so one pack keeps the page on one grade ([imagery.md](imagery.md) §1). Never mix two packs on one site.
- **Pick by brief, then by grade:** the pack whose `sector` matches the brief, then the one whose grade sits with the planned palette and preset temperature. If no pack fits both, the beeldbank is out for this site (§6).
- **Context, never the product.** Beeldbank photos show the world around the client: the place, the material, the work in general. Never the client's own product, team, premises or projects.
- **Record in STRUQ.md:** under SYSTEM, `Imagery: <grade> (Struq beeldbank, pack <slug>), ratios <...>, grain <...>`; under MATERIALS Missing, which shot-list lines the pack fills and which stay placeholders.

---

## 1. When to reach for it

| The brief has | Do |
|---|---|
| Real photos for every planned image | Use them. No beeldbank. |
| Real photos for some images | Real photos where they exist; fill the remaining context slots from one pack whose grade sits closest to them, and run both through the same `GradedImage` layer ([imagery.md](imagery.md) §1) |
| No photos at all | One pack for every context image; product shots stay placeholders ([imagery.md](imagery.md) §4b) |

The materials request at the gate still asks for photos ([direction.md](direction.md) §5). The beeldbank stands in until they arrive; when they do, the client's photos replace the pack slot by slot.

---

## 2. Fetch the packs

Two public endpoints, JSON, no auth, CORS open. Use `curl` or the agent's own fetch tool.

```bash
# every pack: slug, title, sector, description, imageCount, slots, aspectRatios
curl -s https://struq.nl/api/media/packs

# one pack: its images with id, slot, publicUrl, alt (Dutch) and description
curl -s https://struq.nl/api/media/packs/<slug>
```

- The index returns `{ totalImages, packCount, license, packs: [...] }`. Read `sector` and `description` to match the brief, `slots` for how many images each role has, and `aspectRatios` for the crops on offer.
- The pack returns `{ pack, totalImages, images: [...] }`. Each image has `id`, `slot`, `publicUrl` (an absolute `https://struq.nl/media/packs/...` WebP), `alt` in Dutch and a longer `description`.
- Read the `description` of each image before choosing it; the `alt` is short on purpose.

---

## 3. Map the site plan to slots

Every image in the PLAN (the arc rows and the shot list under `Assets to produce`) gets one slot from the chosen pack:

| Slot | Takes the plan's |
|---|---|
| `hero` | hero image, the LCP image of the page |
| `band` | full-bleed statement between sections |
| `card` | standard content or work-thumb frames |
| `column` | tall images beside a column of text |
| `detail` | close-ups, material, texture beside copy |
| `backdrop` | decorative media behind type: `alt=""` or `aria-hidden` ([imagery.md](imagery.md) §5) |

- Place each image in the site's declared ratio set ([imagery.md](imagery.md) §2), choosing from the pack's `aspectRatios`. Crop to the declared ratio; never add a ratio to fit a photo.
- A slot that runs out takes an image from another slot of the **same pack**, recropped. Never a second pack. If nothing in the pack fits the frame, that frame stays a placeholder ([imagery.md](imagery.md) §4b).
- Do not use an image twice on one page.

---

## 4. Download, never hotlink

The chosen files live in the project, not on struq.nl. A hotlinked image breaks the day the pack changes, and it puts a second origin in front of the LCP.

```bash
# one file per chosen image, named by its role on the site
curl -sL -o public/images/hero.webp "https://struq.nl/media/packs/<slug>/<file>.webp"
```

- Keep a short list of what came from where (role, pack slug, image `id`) under LOG in STRUQ.md, so a later swap for the client's own photo is a lookup, not a hunt.
- **Optimise per [performance.md](performance.md).** Check each file against the budgets in §1 there (hero 250KB at 1920w, content 150KB at 1440w). Any file over budget goes through the `sharp-cli` line in §4 there to a new file, never over the download. Then serve through `next/image` with `sizes`, width and height or `fill`, and the LCP hint on the hero only.
- **The grade is already in the pixels.** Tune the `GradedImage` constants against the pack, so the layer unifies the page instead of stacking a second grade on top ([imagery.md](imagery.md) §1).

---

## 5. Alt text and the credit

- **Alt:** on a Dutch site, use the pack's `alt` as it is. On a site in another language, translate it, keeping it a plain description of the subject. Adjust it where your crop no longer shows what it names. Decorative slots stay `alt=""`.
- **Credit:** one quiet line in the footer, or on the credits or colophon page if the site has one:

  `Beeld: Struq (struq.nl/beeldbank)`

  Set in `text-small`, `ink-muted`, with the address as a plain link. Never a badge, never a logo, never above the fold.

---

## 6. When the beeldbank is not the answer

Go back to the sourcing ladder in [imagery.md](imagery.md) §4 (generated on-brief, then treated stock, or placeholders) when:

- struq.nl does not answer, or either endpoint returns an error;
- no pack matches the brief's sector, or the only sector match fights the planned palette and grade;
- the site needs images of the client's own product, people or projects (those are shot, or they are placeholders).

Write the reason under LOG in STRUQ.md, in one line.

---

**Never present a beeldbank photo as the client's own work.** No pack image in a portfolio or work index, no caption that names it as the client's project, team, kitchen or workshop, no "our studio" over a stranger's room. It shows the world the client works in; the client's work stays theirs to shoot.

**Cheap tell:** two packs on one page, a hotlinked struq.nl URL, a Dutch alt on an English site, a pack photo captioned as the client's project.
**Instead:** one pack, matched to the sector and the grade, downloaded and optimised, slots mapped to the plan, alt in the site's language, one quiet credit line.
