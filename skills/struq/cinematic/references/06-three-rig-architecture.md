# Three.js and React Three Fiber Rig Architecture

## Why rigs matter

Rigs turn transform conflicts into explicit composition. A rig is simply a parent `Object3D` or `Group` created to own one category of motion.

Without rigs:

```text
GSAP writes camera.position
pointer handler writes camera.position
noise loop writes camera.position
route transition writes camera.position
```

With rigs:

```text
cameraPlacementRig          ← route or viewport placement
└── cameraNarrativeRig      ← chapter and handoff timelines
    └── cameraReactionRig   ← pointer and velocity modulation
        └── cameraShakeRig  ← procedural noise
            └── camera
```

The final transform is composed by the scene graph.

## Suggested camera hierarchy

```tsx
<group ref={placementRig}>
  <group ref={narrativeRig}>
    <group ref={reactionRig}>
      <group ref={shakeRig}>
        <PerspectiveCamera ref={camera} makeDefault />
      </group>
    </group>
  </group>
  <object3D ref={targetRig} />
</group>
```

The target may have its own narrative and reactive hierarchy if needed.

```text
targetNarrativeRig
└── targetReactionRig
    └── targetAnchor
```

During each frame, orient the physical camera toward the resolved target anchor. If roll is used, apply it after look-at orientation through a roll rig or quaternion composition.

## Suggested subject hierarchy

```text
subjectWorldAnchor
└── subjectPlacementRig      ← chapter composition
    └── subjectTransitionRig ← handoff ownership
        └── subjectReactionRig
            └── subjectIdleRig
                └── modelRoot
```

Not every project needs every rig. Add a rig only when a distinct system must own a transform channel.

## Named anchors

Create anchors inside or around the model:

```text
productRoot
├── anchor:center
├── anchor:lens
├── anchor:logo
├── anchor:detailA
├── anchor:portalPlane
└── anchor:cameraTarget
```

Anchors support:

- shot targeting,
- DOM labels aligned to 3D,
- transition portals,
- particle emitters,
- lighting attachment,
- screen-space measurements,
- authored motion paths.

Prefer anchors exported from the 3D file or created in a model setup module instead of repeated magic coordinates.

## Camera shot application

A shot contains target values. Apply it to narrative rigs, not reactive rigs.

```ts
function addShotTween(
  tl: gsap.core.Timeline,
  rig: THREE.Group,
  target: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
  shot: ShotPreset,
  position: gsap.Position,
  duration: number,
) {
  tl.to(rig.position, {
    x: shot.camera.position[0],
    y: shot.camera.position[1],
    z: shot.camera.position[2],
    duration,
    ease: shot.ease ?? 'power2.inOut',
  }, position);

  tl.to(target.position, {
    x: shot.camera.target[0],
    y: shot.camera.target[1],
    z: shot.camera.target[2],
    duration,
    ease: shot.targetEase ?? shot.ease ?? 'power2.inOut',
  }, position);

  tl.to(camera, {
    fov: shot.camera.fov,
    duration,
    ease: shot.fovEase ?? 'power1.inOut',
    onUpdate: () => camera.updateProjectionMatrix(),
  }, position);
}
```

For performance, avoid creating new vectors every frame. Reuse temporary objects.

## Frame composition

`useFrame` is suitable for high-frequency visual composition inside the Canvas.

```tsx
useFrame((state, delta) => {
  const runtime = runtimeRef.current;

  reactionRig.current.rotation.y = damp(
    reactionRig.current.rotation.y,
    runtime.pointer.x * direction.pointerYaw,
    direction.pointerDamping,
    delta,
  );

  shakeRig.current.position.y =
    Math.sin(state.clock.elapsedTime * 0.7) * direction.idleFloat;

  camera.current.lookAt(targetAnchor.current.getWorldPosition(tempTarget));
});
```

GSAP owns narrative rig values. `useFrame` owns reaction, ambient motion, and final camera look-at resolution.

`useFrame` runs on the single clock: the canvas is mounted with `frameloop="never"` and advanced from `gsap.ticker` (see [`07-stack-integration.md`](07-stack-integration.md) and [`../examples/code/shared/GsapFrameLoop.tsx`](../examples/code/shared/GsapFrameLoop.tsx)). Because scroll, timelines and rendering share one ticker, there is no separate render loop that can drift out of step with the narrative values `useFrame` reads.

## Animating Three.js with GSAP

GSAP can tween numeric object properties directly:

```js
gsap.to(group.rotation, { y: Math.PI * 0.75, duration: 1 });
gsap.to(material, { opacity: 0.2, duration: 0.4 });
gsap.to(uniforms.uProgress, { value: 1, duration: 1 });
```

Use proxy objects when:

- several final values must be composed,
- a uniform requires clamping or transformation,
- a timeline should remain decoupled from a material instance,
- responsive variants share the same logical channel.

```ts
const channels = {
  narrativeDistortion: 0,
  velocityDistortion: 0,
};

gsap.to(channels, { narrativeDistortion: 0.7 });

useFrame(() => {
  material.uniforms.uDistortion.value = Math.min(
    1,
    channels.narrativeDistortion + Math.abs(channels.velocityDistortion),
  );
});
```

## Reparenting and continuity

When a bridge object must move between rigs, preserve world transform.

Three.js `Object3D.attach()` can reparent while preserving world transform when the hierarchy has compatible scale assumptions. Test carefully when non-uniform scale exists.

Alternative:

1. read world position, quaternion, and scale,
2. reparent,
3. convert world transform into the new parent's local space,
4. apply values,
5. continue the timeline from that local state.

Document the coordinate-space requirement in the handoff contract.

## DOM-to-WebGL alignment

For labels, masks, or shared transitions, convert world positions to normalized device coordinates and then screen pixels.

```ts
worldPosition.project(camera);
const x = (worldPosition.x * 0.5 + 0.5) * viewportWidth;
const y = (-worldPosition.y * 0.5 + 0.5) * viewportHeight;
```

Consider:

- device pixel ratio,
- DOM scroll transforms,
- canvas bounds,
- perspective scale,
- visibility behind the camera,
- occlusion,
- responsive safe areas.

Do not update React state every frame solely to position a DOM label. Write to a CSS transform through a ref or use an established HTML-in-3D helper when appropriate.

## Scene strategy

### One persistent scene
Best for a unified product or world with continuous lighting and camera behavior.

### Multiple scene roots in one scene
Toggle or blend environment groups while sharing a camera and effects pipeline.

### Multiple scenes with render targets
Best for portals, compositing, cross-scene displacement, or radically different render settings.

### Route-specific canvases
Best when routes are independently immersive and route transition continuity can be handled outside the canvas or through snapshots.

Choose the least complex strategy that supports the handoff language.

## Lighting rigs

Separate lighting responsibilities:

```text
lightingRoot
├── narrativeLightingRig
│   ├── key
│   ├── fill
│   └── rim
├── environmentLightingRig
└── reactiveAccentLights
```

Animate intensity, color, position, and environment contribution through named lighting states. Avoid changing every light independently without a state plan.

## Effects ownership

Post-processing should support narrative state:

- bloom increases at a reveal apex,
- depth of field shifts during rack focus,
- chromatic displacement responds briefly to velocity,
- vignette increases before a portal pass,
- grain remains ambient and stable,
- color grading transitions between chapter moods.

Create effect channels rather than allowing each chapter to instantiate its own independent composer.

## Performance rules

- Reuse geometries and materials where possible.
- Avoid mounting and unmounting large model trees during a visible handoff.
- Preload assets needed by the next transition.
- Limit transparent particle overdraw.
- Use instancing for repeated geometry.
- Avoid React state updates in `useFrame`.
- Reuse vectors, matrices, and quaternions.
- Scale DPR and post-processing by performance tier.
- Dispose custom resources on unmount.
- Profile actual target devices.
