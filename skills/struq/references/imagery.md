# Imagery & Art Direction: one grade, declared ratios, treated assets

Imagery is now where generated builds fail hardest: the CSS can be flawless and the page still screams "AI" because the images are ungraded stock, glossy renders, or six unrelated looks. The fix is the same shape as the color system: **decide once, apply everywhere**. One grade, one ratio set, one sourcing standard.

Media *behavior* (window parallax, masked reveals, aspect-ratio for CLS) lives in [depth-parallax.md](depth-parallax.md) and [scroll-reveals.md](scroll-reveals.md); this file is about what the pixels *are*.

---

## 1. One grade per page

Every image on a page passes through the **same treatment**, chosen to match the preset's temperature ([vibe-presets.md](vibe-presets.md)). Mixed grading (a warm lifestyle shot next to a cool product render next to a saturated stock photo) is the single most reliable imagery tell. It says the images were *collected*, not *directed*.

Pick one:

| Grade | Character | Pairs with |
|---|---|---|
| **Warm film** | lifted blacks, warm midtones, gentle contrast | Warm Editorial |
| **Desaturated cool** | -20 to -40% saturation, cool shift, deep blacks | Dark Cinematic |
| **High-contrast BW** | full monochrome, punchy | the Brutalist genre appendix only, when the brief declares the genre (color arrives only via the accent) |
| **Soft neutral** | low contrast, airy highlights, near-monochrome palette subjects | Soft Modern (cool-leaning), Luxury Minimal (warm-leaning) |
| **Duotone** | surface color + ink (or accent) mapped to shadows/highlights | any preset, as the *signature* look |

Apply the grade in one reusable layer, not per-image in an editor:

```tsx
// The grade as a component. On a Struq build MediaFrame is this layer: add the filter to its <Image> className.
// components/ui/GradedImage.tsx: every content image renders through this
export function GradedImage({ src, alt, ratio = "4/3", className = "" }: {
  src: string; alt: string; ratio?: string; className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} className="h-full w-full scale-[1.18] object-cover
                                          [filter:saturate(0.82)_contrast(1.05)]" />
    </div>
  );
}
```

- The `filter` values are **per-project constants**: tune once against the preset, then never per-image. (Static CSS filters are fine; it's *scrubbed* filters that cost, see [setup.md](setup.md) §5.)
- Duotone variant: `[filter:grayscale(1)_sepia(0.2)]` on the img. Never a tinted translucent layer over the photo: that is a tell of its own ([anti-patterns.md](anti-patterns.md) §20).
- `scale-[1.18]` is the parallax headroom from [depth-parallax.md](depth-parallax.md) §2, so grading and panning share the same frame component.

**Cheap tell:** every image at its source colors, six looks on one page. **Instead:** One `GradedImage` component; swap the page's grade by editing one filter line.

---

## 2. The ratio set: declared like tokens

Pick **2 to 3 aspect ratios per project** and use nothing else. A page whose media is 4/3, 16/9, 3/2, 1/1, and 21/9 at random reads as unplaced; the same images in a disciplined ratio set read as a system. (Explicit ratios are also the CLS guard, see [setup.md](setup.md) §6.)

| Role | Default | Alternatives by genre |
|---|---|---|
| Standard content / work thumb | `4/3` | `3/2` editorial, `1/1` brutalist grid |
| Full-bleed statement (1 per ~3 viewports) | `21/9` | `2/1` |
| Portrait accent (people, product detail) | `3/4` | `4/5` |

Declare them where the tokens live and reference by role, never ad-hoc:

```css
@theme {
  --ratio-standard: 4/3;
  --ratio-wide: 21/9;
  --ratio-portrait: 3/4;
}
```

---

## 3. Texture: grain, and when to stop

One **global grain overlay** unifies mixed sources better than any filter. It puts every image (and the surfaces) on the same "stock":

```tsx
// One fixed element at the end of <body>. z-index above content, below nav (composition.md z-ladder).
<div aria-hidden className="pointer-events-none fixed inset-0 z-40 opacity-[0.05] mix-blend-overlay"
     style={{ backgroundImage: "url(/noise.png)", backgroundSize: "128px" }} />
```

- `noise.png`: a 128px tileable monochrome noise tile (or an inline SVG `feTurbulence` data-URI). Opacity 0.03 to 0.06: visible on a dark surface if you look, never legible as a pattern.
- Grain suits film/cinematic/editorial registers; **skip it** for Luxury Minimal (clean air is the brand) and product-UI screenshots (they must stay crisp).
- Budget: grain is the *only* always-on texture. Grain + vignettes + gradients + blobs = mud.

---

## 4. Sourcing ladder: where images come from

In order of preference:

1. **Real assets**: the client's work, product, people, places. Always first; treatment (§1) makes even average photography cohesive.
2. **Struq's beeldbank**: real, graded, CC0 sector packs from struq.nl, one pack per site so the grade stays single, downloaded into the project and credited. The first stop when the client has no photos, or not enough. How to pick, fetch and credit: [struq-imagery.md](struq-imagery.md).
3. **Generated on-brief**, with any capable image model (Flux/SDXL-class local checkpoints or a hosted generator). The standard when real assets don't exist and no beeldbank pack fits. Treat each prompt as an art-direction document, not a subject description, and generate the whole set in one session with the same model and settings so it reads as one shoot. Prompt for the *page's* grade, not per-image whims:
   - State the grade in every prompt: light temperature ("warm late-afternoon window light" / "cool overcast studio light"), palette bias matching the preset's neutrals, film character ("35mm film grain, muted colors" vs "clean digital").
   - Keep **one lighting world** across the set. Consistent light does more for coherence than consistent subjects.
   - Compose for the crop: prompt the ratio you'll place (§2), and leave dead space where type will sit if it's a lockup image ([composition.md](composition.md) §3).
   - Avoid the AI-render look: no glossy 3D blobs, no purple-glow gradients, no hyperdetailed-everything. The §1 grade pass over generated output hides most remaining tells.
4. **Treated stock**: last resort, and only *through* the grade layer. Untreated stock (beaming laptop people, handshake photos) is below the floor.

**Beeldbank, stock and generated images show context, never the client's product.** The city, the canal, a rider, a room, a material: yes. A stranger's e-bike, a generated bottle or a stock ceramic presented as the product: never, because the visitor reads it as the thing they would buy. Until the real product is shot, it is type, a context image of the client's world, a declared 3D stand-in ([webgl-scenes.md](webgl-scenes.md) §4, "No model file yet"), or type.

**Never:** browser-chrome screenshot mockups tilted in perspective, generic "dashboard glow" renders, or watermark-adjacent placeholder imagery. If a section has no honest image, the strongest move is **no image**: type, space, and surface carry it (same logic as the no-icon rule, [iconography.md](iconography.md) §1).

---

## 4b. Never an empty frame

A slot that will one day hold the client's own photo holds a beeldbank image today. There is no placeholder state on a Struq site: no grey box, no tonal frame with a "photo to come" caption, no placeholder component.

- **Default:** `node <skill-dir>/scripts/images.mjs <pack>` fills every slot from the pack that matches the brief ([struq-imagery.md](struq-imagery.md)). It runs on every build, without asking: the images are free and CC0.
- **struq.nl unreachable:** the same script writes graded fallback plates in the site palette (two planes of light, a horizon hairline, grain) at each slot's ratio, and `lib/struq-images.ts` points at them. They are abstract images, not boxes. Run the script again when the network is back and the photos replace them in place.
- **The client's product, team or projects:** a beeldbank photo never stands in for those. Those sections use type, the WebGL layer or a context image of the client's world (the material, the place), and the gap is listed under Assumptions.
- **Markup:** every image goes through `MediaFrame`, which requires an `image`, so an empty frame cannot be written by accident. `check.mjs` fails on placeholder components, "photo to come" captions and empty `aspect-` boxes.

---

## 5. Accessibility & weight

- **Content images:** real `alt` describing the subject. **Decorative/texture images** (ghost imagery, grain, backdrop media): `alt=""` or `aria-hidden`, so "image of background texture" never leaks to screen readers.
- Ship AVIF/WebP with sensible `sizes`; a full-bleed hero stays at or under 250KB at 1920w and a content image at or under 150KB at 1440w, the budgets in [performance.md](performance.md) §1. Never 4MB.
- Ambient/looping video obeys the motion doctrine: muted, `playsinline`, poster, paused under `prefers-reduced-motion`. It also counts as the page's one autonomous mover ([feel-layer.md](feel-layer.md) §5).

---

**Cheap tell:** mixed-grade stock + a tilted browser-chrome screenshot + a purple-glow 3D blob, all at random ratios, alt-less.
**Instead:** One grade constant, one grain layer, 2 to 3 declared ratios, assets real or generated on-brief, treated identically. The imagery reads as *photographed for this site*.
