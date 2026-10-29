# Audit Rubric

Score each category from 0 to 5.

- `0`: absent or broken
- `1`: severely weak
- `2`: inconsistent or generic
- `3`: functional and intentional
- `4`: strong and polished
- `5`: exceptional, coherent, and resilient

## 1. Experience thesis

**Question:** Can the whole experience be described as one visual and emotional transformation?

- 0: no unifying idea
- 3: clear idea but not consistently expressed
- 5: every major beat reinforces the thesis

## 2. Persistent-world continuity

**Question:** Does the page feel like one evolving world?

Inspect:

- persistent stage,
- retained subjects,
- environment continuity,
- chapter resets,
- route continuity.

## 3. Chapter purpose

**Question:** Does each chapter perform a distinct narrative action rather than merely display content?

## 4. Handoff quality

**Question:** Is every boundary an authored transfer with a bridge, coverage, ownership, and reverse behavior?

## 5. State continuity

**Question:** Do shared end and start states match without hidden jumps?

## 6. Property ownership

**Question:** Can every animated property be traced to one authoritative writer?

Red flags:

- GSAP and Motion on one transform,
- pointer and narrative writing the same camera object,
- callbacks creating irreversible state,
- local components mutating global experience values.

## 7. Timeline hierarchy

**Question:** Are route, chapter, handoff, and discrete timelines separated and composed clearly?

## 8. Semantic cues

**Question:** Are important moments named and used to coordinate systems?

## 9. Rhythm and pacing

**Question:** Does the experience contain contrast between motion, holds, accents, and resolution?

## 10. Camera direction

**Question:** Are shots, targets, FOV, paths, and composition intentionally authored?

Red flags:

- constant orbit,
- camera movement with no target plan,
- excessive float,
- no stable hero pose,
- large mobile travel copied from desktop.

## 11. Subject choreography

**Question:** Does the principal object have clear placement, role changes, and material behavior?

## 12. Typography choreography

**Question:** Does type share beats and spatial logic with the visual world?

Red flags:

- every heading uses the same fade-up,
- type ignores camera and safe areas,
- SplitText breaks on resize,
- unreadable motion density.

## 13. SVG and graphic integration

**Question:** Are vector effects meaningful bridges or explanatory systems rather than decoration?

## 14. Input arbitration

**Question:** Are scroll, pointer, hover, click, drag, and time assigned distinct responsibilities?

## 15. Interaction envelopes

**Question:** Are interactions enabled, attenuated, and disabled at deliberate states?

## 16. Reverse behavior

**Question:** Can a user reverse through scrubbed sequences without discontinuity or stale state?

## 17. Responsive choreography

**Question:** Does each viewport class preserve intent through authored composition changes?

## 18. Reduced motion

**Question:** Is there a coherent reduced-motion experience rather than a broken or entirely static fallback?

## 19. Performance architecture

**Question:** Are effects, assets, render settings, and frame work budgeted by device capability?

## 20. Lifecycle and cleanup

**Question:** Are timelines, triggers, listeners, ticker callbacks, styles, and GPU resources cleaned up?

## 21. Tuning readiness

**Question:** Can important values be inspected and changed from a central direction system?

## 22. Validation coverage

**Question:** Has the experience been tested across input, viewport, performance, motion preference, asset readiness, and route lifecycle?

## Audit output template

```md
# Audit Summary

## Executive diagnosis
[One paragraph identifying the dominant structural issue.]

## Scorecard
| Category | Score | Evidence | Priority |
|---|---:|---|---|

## Structural findings
### Finding
- Symptom:
- Cause:
- Perceptual consequence:
- Correction:
- Validation:

## Continuity map
| Boundary | Persistent bridge | Camera continuity | Ownership transfer | Reverse-safe | Result |

## Property conflict map
| Property | Writers | Conflict | Correction |

## Remediation sequence
1. Foundation
2. First corrected vertical slice
3. Remaining chapter migrations
4. Responsive and performance pass
5. Final direction pass
```

## Score interpretation

- `90 to 110`: exceptional architecture; focus on art direction and microtiming.
- `70 to 89`: strong foundation with identifiable weaknesses.
- `50 to 69`: impressive moments but inconsistent system quality.
- `30 to 49`: effect-driven page with structural continuity problems.
- `<30`: rebuild the experience architecture before adding polish.

The numerical score supports prioritization. The written evidence is more important than the total.
