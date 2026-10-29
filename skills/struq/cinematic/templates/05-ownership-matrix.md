# Property Ownership Matrix

## Rules

- Every mutable visual property has one authoritative writer at a time.
- Additive behavior uses separate rigs or named channels.
- Ownership changes occur only at semantic cues.
- Route-level transitions can temporarily take ownership only through a documented handoff.

## Matrix

| Target | Property | Narrative owner | Reactive channel | Ambient channel | Discrete owner | Transfer cue | Final resolution |
|---|---|---|---|---|---|---|---|
| Camera | position | | | | | | |
| Camera | target | | | | | | |
| Camera | FOV | | | | | | |
| Subject | position | | | | | | |
| Subject | rotation | | | | | | |
| Subject | scale | | | | | | |
| Material | transition progress | | | | | | |
| Shader | distortion | | | | | | |
| DOM title wrapper | transform | | | | | | |
| SVG bridge | path/morph | | | | | | |
| Post FX | bloom | | | | | | |

## Conflict findings

| Property | Current writers | Symptom | Correction |
|---|---|---|---|
