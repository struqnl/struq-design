# Handoff Contracts

## Why handoffs determine quality

Most animated sites feel like separate sections because chapter transitions are treated as decorative effects after each section has already been designed. A cinematic experience treats the boundary itself as a designed state interval.

A handoff must answer:

- what continues,
- what changes,
- what hides the change,
- who owns each shared property,
- when the incoming world becomes authoritative,
- how the transition behaves in reverse.

## Contract schema

```ts
export type HandoffContract = {
  id: string;
  fromChapter: string;
  toChapter: string;
  progressWindow: [number, number];
  bridgeElements: string[];
  outgoingState: Record<string, unknown>;
  incomingState: Record<string, unknown>;
  ownershipTransfer: Array<{
    property: string;
    outgoingOwner: string;
    transferCue: string;
    incomingOwner: string;
  }>;
  cameraContinuity: string;
  occlusionStrategy: string;
  lightingContinuity: string;
  typographyContinuity: string;
  interactionGating: string;
  reverseBehavior: string;
  readinessRequirements: string[];
  completionCondition: string;
};
```

## State equality

For every shared property:

```text
outgoing final value = incoming initial value
```

This equality may exist in world space, local space, or screen space. Specify which one.

Example:

```text
The ring's world position changes because it is reparented, but its screen-space center and apparent scale must remain unchanged during the transfer.
```

Reparenting may require preserving world transforms before attaching an object to a new parent.

## Ownership transfer

A handoff often has three ownership phases:

```text
outgoing owner
→ shared transition owner
→ incoming owner
```

Example:

```text
Chapter 2 controls the product placement rig until `handoff:armed`.
The handoff timeline controls the placement rig from `handoff:armed` to `handoff:resolved`.
Chapter 3 controls the rig after `handoff:resolved`.
```

Do not let the outgoing chapter and incoming chapter animate the same property during the overlap unless their values are explicitly blended through a transition channel.

## Bridge strategies

### Object bridge
A persistent 3D object changes role while remaining visible.

Use when the product or central symbol should unify the story.

### Aperture or portal bridge
A hole, screen, lens, door, or surface reveals the next state.

Use when the transition should feel spatial and the incoming scene can be rendered behind or inside a mask.

### Occluder bridge
A near-camera object fills the frame and hides a swap.

Use when assets or scene topology must change discontinuously.

### Typography bridge
A glyph or phrase changes scale, depth, mask, or position to become the next composition.

Use when editorial direction is central.

### Vector bridge
An SVG line, path, or shape draws, bends, and morphs into an incoming visual structure.

Use with DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, masks, and clip paths.

### Light bridge
Incoming color temperature, direction, or contrast appears before incoming geometry.

Use for subtle continuity and mood shifts.

### Render-target bridge
The outgoing or incoming world is rendered into a texture for portals, crossfades, displacement, feedback, or material transitions.

Use when simple DOM masking cannot produce the required spatial relationship.

### Motion bridge
The direction, velocity, or rhythm of an outgoing movement continues through the incoming state.

Use when no physical object persists but the kinetic logic should.

## Handoff progress design

A useful pattern:

```text
0.00-0.25  outgoing chapter begins preparation
0.25-0.50  bridge becomes visually dominant
0.50-0.75  incoming state appears under cover
0.75-0.90  ownership transfers
0.90-1.00  incoming state resolves and interactions enable
```

The exact proportions depend on the concept. Always reserve enough time for the viewer to understand the bridge.

## Occlusion conditions

Do not say only “swap when covered.” Define measurable coverage:

- bridge bounding box covers at least 95% of the viewport,
- depth buffer confirms the transition surface is nearest across the central safe area,
- opacity or mask coverage reaches a threshold,
- camera crosses a named portal plane,
- shader transition progress exceeds a defined value.

For responsive variants, the coverage condition may require different scale or path values.

## Camera continuity patterns

### Continuous path
The same camera rig moves through the boundary.

### Match-pose transfer
The outgoing and incoming cameras have matching position, target, FOV, and framing before the scene source changes.

### Virtual cut under cover
The camera changes discontinuously while the viewport is fully occluded.

### Render blend
Two camera outputs are blended or distorted through render targets.

### Subject-relative continuity
The camera's world position changes, but its relationship to the bridge subject remains stable.

## Reverse behavior

Specify one of:

- fully reversible scrub,
- reversible until a commit threshold,
- snap-backed state transition,
- replayed inverse timeline,
- route transition with no reverse scroll.

For scroll-driven experiences, fully reversible behavior is the default expectation. Avoid destroying outgoing assets before the reverse threshold can no longer be crossed.

## Complete example

```md
### Handoff: Material → Interior

**Window:** global progress 0.48 to 0.58

**Bridge:** circular lens opening on the product shell

**Outgoing state:**
- product placement rig at `[0.25, -0.10, 1.40]`
- product yaw `-18deg`
- camera shot `materialMacro`
- environment brightness `0.35`
- title reduced to one persistent word: “Inside”

**Incoming state:**
- tunnel root begins at the lens plane
- camera shot begins at the exact `materialMacro` pose
- interior light color already present at 15%
- “Inside” is screen-space aligned with the tunnel axis

**Ownership:**
- chapter `material` owns product transforms until `handoff:armed`
- handoff timeline owns product and camera from `handoff:armed` to `handoff:resolved`
- chapter `interior` owns the camera target and tunnel progression after resolution

**Sequence:**
1. Reduce pointer influence from 0.06 to 0.01.
2. Rotate the product to align the lens normal with the camera axis.
3. Dolly forward while tightening FOV from 34 to 29.
4. Begin rendering the tunnel behind the lens at handoff progress 0.32.
5. Reach 96% aperture coverage at 0.68.
6. Disable the outer shell and release the interior depth fog at 0.72.
7. Transfer camera target ownership at 0.78.
8. Restore pointer influence to 0.035 by 1.00.

**Reverse:**
- keep outer shell and material environment loaded until global progress exceeds 0.64
- reverse all visibility through progress-derived values
- restore outgoing chapter interactions below handoff progress 0.18

**Completion:**
- camera is inside the tunnel,
- the lens edge is no longer visible,
- interior lighting is authoritative,
- chapter `interior` local progress is 0,
- no transform changes at the ownership transfer frame.
```

## Handoff review checklist

- Is there a bridge the viewer can understand?
- Is the outgoing state prepared for the incoming state?
- Are shared values equal at transfer?
- Is the coordinate space specified?
- Is the camera continuous or covered?
- Is incoming content visible before outgoing content is discarded?
- Are interactions attenuated during the critical interval?
- Is the transition reversible?
- Are assets retained long enough?
- Is the mobile coverage condition valid?
- Is the completion condition measurable?
