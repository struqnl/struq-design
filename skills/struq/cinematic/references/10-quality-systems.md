# Responsive, Performance, and Accessibility Systems

## Responsive choreography

Responsive work is not a scale transform applied to desktop direction. It is a reinterpretation of the same narrative intent under different spatial and input constraints.

Define viewport classes such as:

```ts
type ViewportClass =
  | 'desktop-wide'
  | 'desktop'
  | 'tablet'
  | 'mobile-portrait'
  | 'mobile-landscape';
```

For each class define:

- shot presets,
- subject scale and anchors,
- typography composition,
- scroll-distance budgets,
- interaction strengths,
- transition coverage values,
- particle and effect tier,
- copy density,
- controls and navigation behavior.

## Mobile direction changes

Common intentional changes include:

- reduce camera lateral travel,
- favor target movement over large camera orbit,
- shorten or simplify portal passes,
- move copy into a stable safe region,
- use word-based rather than line-based splitting,
- reduce pointer-dependent behavior,
- replace hover interactions with tap or scroll responses,
- reduce transparent particles and depth-of-field,
- increase handoff occluder scale to guarantee coverage,
- allocate more scroll distance for dense reading.

## Reduced-motion choreography

Reduced motion should preserve story and hierarchy while reducing:

- long spatial travel,
- rapid acceleration,
- large parallax,
- camera roll,
- depth tunneling,
- repeated oscillation,
- velocity-linked distortion,
- disorienting zoom changes.

Possible substitutions:

- dissolve within the same composition rather than fly through space,
- cut between matched key poses under a short cover,
- reveal type by opacity and contrast instead of large masked translation,
- use limited scale changes,
- disable pointer parallax and camera shake,
- preserve bridge objects but reduce movement distance.

Reduced motion is still directed. Do not simply disable all animation and leave broken visibility states.

## Semantic content and accessibility

The experience must preserve:

- meaningful document order,
- readable text outside the canvas,
- keyboard access,
- focus visibility,
- accessible controls,
- route announcements where needed,
- alternatives for gesture-only interactions,
- sufficient contrast,
- non-blocking scroll escape,
- meaningful fallback when WebGL is unavailable.

Canvas visuals should not be the only source of essential information.

## Input accessibility

If wheel or touch gestures advance discrete chapters, also provide:

- keyboard navigation,
- visible progress or navigation,
- a way to escape or return,
- sensible browser-history behavior,
- focus management,
- reduced-motion behavior,
- no accidental trapping inside nested scrollers.

## Performance tiers

Example:

```ts
type PerformanceTier = 'high' | 'balanced' | 'safe';
```

### High

- full post-processing,
- higher DPR cap,
- dense particles,
- dynamic shadows,
- higher texture or geometry detail.

### Balanced

- selected post effects,
- moderate DPR,
- reduced particles,
- limited shadows,
- optimized texture sizes.

### Safe

- minimal post-processing,
- low DPR cap,
- simplified materials,
- static or baked lighting,
- reduced geometry and particles,
- simpler transitions preserving the bridge concept.

Do not rely on a single device heuristic. Allow manual override and respond to observed performance when appropriate.

## Frame-budget thinking

At 60 Hz the total frame duration is about 16.7 ms. This includes JavaScript, style, layout, paint, and GPU rendering. Treat long main-thread tasks, shader cost, overdraw, and asset decoding as part of one budget.

Profile:

- CPU frame time,
- GPU frame time when available,
- JS allocations,
- layout and style recalculation,
- texture memory,
- draw calls,
- triangles,
- transparent overdraw,
- shader complexity,
- render-target count and resolution.

## Asset strategy

Define asset readiness by chapter:

```text
critical for first paint
critical for intro
required before chapter 2 handoff
prefetch during chapter 1 hold
optional enhancement for high tier
```

Preload the next chapter's bridge assets before the handoff. Do not load every high-resolution asset before showing anything unless the concept requires a fully controlled opening.

## Common performance failures

- full-resolution render targets for several effects,
- high DPR on dense mobile screens,
- unbounded transparent particles,
- shadows on many dynamic lights,
- rebuilding geometry or materials during render,
- React state updates every frame,
- layout reads and writes interleaved in pointer handlers,
- multiple independent RAF loops doing redundant work (including R3F's default loop running next to the Lenis ticker, which should be a single `gsap.ticker` clock),
- oversized textures,
- mounting the incoming scene during the critical frame,
- excessive blur filters on large DOM layers,
- SplitText or ScrollTrigger refresh loops during resize.

## Quality validation matrix

Test combinations, not isolated features:

| Dimension | Cases |
|---|---|
| Input | mouse, trackpad, touch, keyboard |
| Motion | normal, reduced motion |
| Performance | high, balanced, safe |
| Viewport | wide desktop, laptop, tablet, mobile portrait |
| Scroll | slow, fast, reverse, jump via navigation |
| Lifecycle | first load, route enter, route leave, back navigation |
| Assets | warm cache, cold cache, delayed model, delayed font |
| Visibility | foreground tab, background and resume |

## Graceful failure

Define behavior for:

- WebGL unavailable,
- model fails to load,
- shader compilation fails,
- reduced-data preference,
- autoplay audio unavailable,
- low-memory device,
- missing optional plugin effect.

The fallback should preserve content and visual hierarchy, not display an empty stage.
