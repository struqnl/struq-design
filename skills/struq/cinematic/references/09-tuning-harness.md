# Tuning Harness

## Manual tweaking is part of direction

Three.js composition requires visual judgment. The goal is not to eliminate manual tweaking; it is to make it fast, controlled, reversible, and understandable.

A tuning harness should let you answer:

- Where am I in the experience?
- Which chapter and phase are active?
- Which system owns the property I am inspecting?
- What are the current camera and target values?
- Can I isolate this chapter and handoff?
- Can I compare two settings without rebuilding?
- Can I capture the current composition as direction data?

## Minimum controls

### Narrative controls

- global progress slider,
- active chapter selector,
- local chapter progress slider,
- play and pause,
- forward and reverse,
- playback speed,
- jump to semantic label,
- isolate handoff,
- lock scroll while scrubbing.

### Camera controls

- camera world position,
- camera narrative-rig position,
- target world position,
- FOV,
- roll,
- near and far planes,
- focus distance,
- aperture,
- exposure,
- capture current values as a named shot.

### Subject controls

- placement position,
- rotation,
- scale,
- anchor visualization,
- bounding box,
- material and shader channels,
- capture current values as a key pose.

### Input controls

- pointer visualization,
- current pointer influence,
- scroll velocity and normalized velocity,
- direction,
- interaction envelope,
- force reduced motion,
- emulate touch input.

### Rendering controls

- FPS and frame duration,
- draw calls,
- triangles,
- textures,
- render targets,
- DPR,
- shadow toggle,
- post-processing toggle by pass,
- particle-density tier,
- wireframe and normals,
- scene-group visibility.

## Direction register

Maintain a central register:

```ts
export const direction = {
  chapters: {
    reveal: {
      scrollVh: 3.2,
      phases: {
        entrance: [0.00, 0.18],
        establish: [0.18, 0.36],
        development: [0.36, 0.68],
        transformation: [0.68, 0.84],
        handoff: [0.84, 1.00],
      },
      pointerStrength: 0.045,
      velocityStrength: 0.12,
    },
  },
  effects: {
    bloom: { base: 0.15, apex: 0.55 },
    grain: { strength: 0.08 },
    distortion: { maxVelocity: 0.22 },
  },
};
```

Use named values and units. Avoid ambiguous values such as `speed: 2` without defining what the number means.

## Preset capture

A capture action should output valid direction data:

```json
{
  "name": "productMacroDesktop",
  "camera": {
    "position": [0.12, 0.36, 2.18],
    "target": [0.04, 0.18, 0.00],
    "fov": 29,
    "roll": -0.012
  },
  "subject": {
    "position": [0.28, -0.14, 0.24],
    "rotation": [0.06, -0.31, 0.02],
    "scale": 1.18
  }
}
```

The agent can then compare, name, and integrate the preset into `shots.ts`.

## Debug overlays

Useful overlays include:

- viewport center and thirds,
- typography safe areas,
- camera target and forward axis,
- model anchors,
- portal plane,
- clipping and mask bounds,
- chapter and handoff range markers,
- active ownership labels,
- current cue names.

## Slow-motion review

Review time-driven intros and discrete transitions at `0.25x` and `0.5x` speed. Scrub scroll-driven timelines slowly. Look for:

- property jumps,
- target drift,
- hidden geometry appearing too early,
- opacity changes covering architectural mistakes,
- type and camera landing at the same instant without hierarchy,
- insufficient occlusion,
- interaction influence during critical moves,
- abrupt effect thresholds.

## Tuning order

Tune in this order:

1. state continuity,
2. camera and subject composition,
3. chapter phase boundaries,
4. handoff coverage and ownership,
5. hierarchy of beats,
6. typography timing,
7. interaction envelopes,
8. lighting and material response,
9. post-processing,
10. microtiming and accents.

Do not tune bloom, grain, and distortion before the camera path and state continuity are correct.

## Review recordings

Capture repeatable recordings at:

- slow deliberate scroll,
- normal trackpad scroll,
- fast scroll and direction reversal,
- touch scroll,
- mobile portrait,
- mobile landscape when supported,
- reduced motion,
- low-performance tier,
- route enter and leave,
- browser resize during the experience.

Compare the same chapter across revisions. A screen recording is useful evidence for agent audits when the code alone does not reveal perceptual timing.

## Acceptance thresholds

Define project-specific thresholds such as:

- no visible jump larger than one device pixel at ownership transfer,
- no frame longer than 50 ms during a normal chapter transition on the target device,
- stable 60 FPS on the primary desktop class or a documented lower target,
- mobile camera keeps the principal subject inside the safe area at all key poses,
- text remains readable for a minimum scroll interval,
- reduced-motion mode contains no large forced parallax or rapid camera pass-through,
- all triggers and ticker callbacks are removed after route leave.
