# Concise Chapter Example: Product Disassembly

## Purpose

Reveal three functional systems by spatially separating one hero object while preserving it as a single readable composition.

## State

**Incoming:** complete object in shot `heroThreeQuarter`; title visible; pointer yaw strength `0.045`.

**Outgoing:** three layers separated along the camera's depth axis; outer ring centered and facing camera as the bridge into the next chapter.

## Progress

| Range | Action |
|---|---|
| 0.00-0.12 | Hold hero pose; lower ambient noise and prepare rim light. |
| 0.12-0.30 | Dolly 8% closer; SplitText title exits by lines toward the left vanishing point. |
| 0.30-0.62 | Separate the three product layers with 60 ms overlap; reveal one feature label per layer. |
| 0.62-0.78 | Hold separation; allow restrained pointer depth response. |
| 0.78-0.90 | Rotate outer ring toward camera and move other layers behind it. |
| 0.90-1.00 | Reduce pointer influence; ring reaches viewport center and becomes the transition aperture. |

## Cues

- `chapter:enter` at 0.00
- `camera:commit` at 0.12
- `layers:readable` at 0.62
- `handoff:armed` at 0.78
- `aperture:aligned` at 0.94
- `chapter:resolved` at 1.00

## Ownership

- GSAP chapter timeline owns narrative camera and layer placement rigs.
- R3F `useFrame` owns layer idle float and pointer reaction rigs.
- SplitText timeline owns the title mask wrappers.
- Handoff timeline takes the outer-ring placement rig at `handoff:armed`.

## Mobile

Use a shallower layer separation and move labels below the subject. Replace lateral camera truck with a target shift. Increase ring scale by 18% to guarantee transition coverage.
