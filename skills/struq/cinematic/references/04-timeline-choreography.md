# Timeline Choreography

## Choreography is authored attention

A timeline is not merely a list of property changes. It is a system for controlling attention, expectation, energy, and comprehension.

At every meaningful interval answer:

- What should the viewer notice first?
- What should remain stable while that happens?
- What anticipates the next action?
- Where is the visual apex?
- When is there enough stillness to read or understand?
- What motion prepares the handoff?

## The chapter phase grammar

Use this grammar as a starting point:

```text
pre-roll
→ entrance
→ establish
→ development
→ transformation
→ handoff preparation
→ handoff
→ resolution
→ post-roll
```

### Pre-roll
Prepare hidden state, load assets, place off-screen objects, or start incoming light before the viewer consciously enters.

### Entrance
Introduce the primary subject or compositional idea. Avoid introducing every layer simultaneously.

### Establish
Give the viewer a stable enough composition to understand what has arrived.

### Development
Reveal supporting copy, details, interactions, or secondary geometry.

### Transformation
Perform the chapter's principal visual idea.

### Handoff preparation
Move shared elements into positions and states that can validly begin the next chapter.

### Handoff
Transfer state ownership while preserving continuity.

### Resolution
Settle into the incoming chapter's stable composition.

### Post-roll
Park, hide, recycle, or release outgoing resources after they are no longer needed.

## Normalize scroll-driven timelines

A scroll-driven timeline is easier to reason about when its logical duration is `1`.

```js
const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });

tl.addLabel('chapter:enter', 0.00)
  .addLabel('entrance:complete', 0.18)
  .addLabel('establish:complete', 0.32)
  .addLabel('transformation:start', 0.55)
  .addLabel('transformation:apex', 0.76)
  .addLabel('handoff:armed', 0.82)
  .addLabel('handoff:occluded', 0.93)
  .addLabel('chapter:resolved', 1.00);
```

Durations can then correspond directly to progress ranges. This does not mean every tween should use `ease: none`. The timeline is scrubbed linearly, while individual beats may still use shaped eases.

## Timing hierarchy

Think at four scales:

### Experience rhythm
The alternation of dense and quiet chapters across the whole route.

### Chapter rhythm
The pattern of entrance, hold, development, apex, and resolution.

### Beat timing
The relationship between camera, subject, copy, light, sound, and effects around one event.

### Microtiming
Small offsets that create causality and material feel.

Example microtiming around a title reveal:

```text
0 ms    key light begins increasing
40 ms   camera begins final 4% settle
90 ms   first title line begins
170 ms  second title line begins
240 ms  camera stops
280 ms  title reaches full contrast
340 ms  metadata becomes interactive
```

The camera stopping before the title fully resolves can make the type feel anchored. Reversing that order can make the type feel like it is chasing the composition.

## Motion relationships

### Simultaneous
Use when elements behave as one physical or conceptual unit.

### Sequential
Use when reading order or cause-and-effect matters.

### Overlapping
Use to maintain flow and avoid stop-start chapter boundaries.

### Counter-motion
Move foreground and background in opposing directions to create depth or tension.

### Follow-through
Allow secondary motion to continue after the primary action resolves.

### Anticipation and release
Pull away, compress, darken, or pause before a stronger movement.

### Echo
Repeat a motion motif at a different scale or in another medium. A camera arc can be echoed by a curved SVG line or letter stagger.

## Easing by physical and emotional character

Choose easing based on the intended material and beat.

- `power2` or `power3`: controlled general-purpose movement.
- `expo`: decisive arrivals and strong acceleration contrast.
- `sine`: soft environmental drift.
- `circ`: rounded, orbital movement.
- custom ease: branded motion signatures and carefully controlled camera moves.
- elastic or bounce: only when material and tone justify visible spring or impact.

For scrubbed cinematic camera moves, excessively expressive easing can feel unstable because the user controls the playhead. Use ease to shape perception, but keep spatial paths readable in both directions.

## Camera and target must be choreographed together

Animating camera position alone often creates unwanted arcs or aim changes. Author:

- camera rig position,
- target rig position,
- field of view,
- roll,
- focus distance,
- exposure when required.

A useful pattern is to animate the target slightly before the camera so attention begins shifting before the body of the move.

```text
target begins at 0.42
camera begins at 0.46
FOV tightens at 0.52
focus reaches detail at 0.61
camera settles at 0.66
```

## Holds are active design

A hold does not require a completely static screen. During a hold:

- major narrative transforms pause,
- ambient motion continues,
- pointer response may increase slightly,
- copy becomes readable,
- a minor detail may develop,
- sound or shader texture may sustain tension.

Avoid constant major motion. Without contrast, no beat feels important.

## Staggers require direction

Do not apply the same line or character stagger everywhere.

Specify:

- split type: lines, words, characters,
- visual origin: top, bottom, pointer, center, path direction,
- order: document, reverse, center-out, edges-in, random with seed,
- temporal spacing,
- transform axis,
- clipping strategy,
- re-split behavior,
- relationship to camera and subject.

Example:

> Split the heading by lines. Reveal bottom-to-top through overflow masks with a 70 ms line stagger. Start the first line after the camera has completed 65% of its push-in. Let the final line finish 120 ms after the subject light settles.

## Critical intervals and interaction attenuation

Define a narrative criticality curve:

```ts
function criticality(progress: number): number {
  // Example only: strongest during the pass-through.
  return smoothRange(progress, 0.72, 0.90);
}

pointerStrength = basePointerStrength * (1 - criticality(progress) * 0.85);
```

This preserves the authored move while keeping the experience responsive elsewhere.

## Scroll velocity as an effect signal

Never map raw velocity directly to a strong effect.

Use:

1. signed input,
2. clamp,
3. normalize,
4. ease or shape,
5. smooth attack,
6. slower decay,
7. effect-specific maximum.

```ts
const normalized = clamp(scrollVelocity / 1800, -1, 1);
const shaped = Math.sign(normalized) * Math.pow(Math.abs(normalized), 0.65);
velocityTarget = shaped;
velocityVisual = damp(velocityVisual, velocityTarget, 8, deltaTime);
```

Map velocity differently by channel. Directional smear may preserve sign; bloom intensity usually uses absolute magnitude.

## Reverse-scroll choreography

Scrubbing backward must be designed, not assumed.

Check:

- visibility states reverse cleanly,
- paths and morphs remain valid,
- incoming interactions disable at the right threshold,
- scene changes are reversible or covered,
- asset unloading does not occur too early,
- callbacks do not create irreversible side effects,
- labels and ownership return correctly.

Avoid using timeline callbacks for state mutations that cannot be reconstructed from progress. Prefer deriving visual state from progress or using idempotent transitions.

## Timeline review questions

For each chapter ask:

- Can I describe the chapter's main action in one sentence?
- Is there a stable hero pose?
- Is there a hold?
- Is there one clear apex rather than several equal accents?
- Does the next chapter begin preparing before this one ends?
- Are type and camera choreographed relationally?
- Does every motion have an owner?
- Can the sequence reverse without a jump?
- Does the mobile version preserve the same intention?
- Can I tune the phase boundaries from one location?
