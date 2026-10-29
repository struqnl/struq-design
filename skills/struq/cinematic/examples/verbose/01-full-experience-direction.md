# Full Experience Direction Example: Aether One

This example demonstrates the expected level of direction for a fictional premium spatial-audio product. It is not intended as a visual style to copy. Its purpose is to show how a brief becomes chapters, states, camera shots, timelines, handoffs, responsive variants, and acceptance criteria.

## 1. Brief summary

**Product:** Aether One, a sculptural spatial-audio object with an outer ring, suspended acoustic core, and internal waveguide.

**Objective:** Make the visitor understand that the product does not merely play sound; it shapes a room as a responsive acoustic field.

**Required messages:**

1. Aether One is a physical object with a distinctive silhouette.
2. Its material construction creates controlled acoustic behavior.
3. Its internal waveguide shapes spatial sound.
4. It adapts to the room and listener.
5. The user can explore details and proceed to a product page or purchase flow.

**Available assets:** optimized GLB with named nodes, room environment map, four SVG diagrams, editorial typeface, short ambient audio loop, product renders, and a lightweight noise shader.

**Target:** modern desktop and mobile devices, with a balanced performance tier as the default.

## 2. Experience thesis

The viewer approaches Aether One as a silent sculptural object, gradually discovers that its physical layers form an acoustic instrument, passes through its central aperture into the waveguide, and emerges into a room transformed by a responsive sound field. The outer ring remains the principal bridge across the experience, changing from silhouette to mechanism to portal to field boundary. The emotional progression is restraint → curiosity → mechanical clarity → spatial immersion → calm resolution.

## 3. Experience contract

### Persistent-stage strategy

A single viewport-locked stage persists from the opening through the room resolution. The Three.js canvas, camera hierarchy, lighting root, product root, grain, cursor, and progress indicator remain mounted. Semantic DOM chapters provide content and scroll ranges. The visible world evolves without resetting the camera or canvas at chapter boundaries.

### Chapter map

| ID | Name | Purpose | Main transformation | Scroll budget | Bridge |
|---|---|---|---|---:|---|
| `arrival` | Silent Object | Establish silhouette and premium material presence. | Darkness becomes a controlled hero composition. | 2.2 vh | Outer ring silhouette |
| `material` | Built to Shape | Reveal shell, suspension, and acoustic layers. | Complete object separates into functional layers. | 3.4 vh | Outer ring aligns to camera |
| `interior` | Inside the Wave | Explain the internal waveguide spatially. | Camera passes through ring into a luminous acoustic tunnel. | 4.0 vh | Traveling wave ribbon |
| `field` | The Room Responds | Show the product shaping a room-scale field. | Tunnel wave expands into a room and listener field. | 3.8 vh | Wave ribbon becomes room contour |
| `resolve` | A Quiet Centre | Return control and present product action. | Field contracts around the complete product in a calm final pose. | 2.3 vh | Ring becomes CTA focus |

`vh` here means viewport-height units of scroll distance, not literal CSS units inside the timeline.

### Motion language

**Camera:** controlled dolly and truck movement with small target leads; no perpetual orbit. Stable hero poses and one major pass-through form the spatial punctuation.

**Product:** weighty, precise, mechanically plausible. Layer separation uses restrained overshoot only on suspended internal parts.

**Typography:** large editorial lines appear through directional masks, then reduce into small technical labels. Type follows the same visual axes as product geometry.

**SVG:** thin technical lines initially describe physical construction, then become the traveling wave ribbon and finally the room-field contour.

**Ambient:** subtle material shimmer, low-amplitude particle drift, minute light motion, and slow wave shader movement continue when scrolling stops.

**Transition language:** object bridge, camera pass-through, vector morph, light continuity, and screen-space matching. No full-screen fade between narrative chapters.

### Input ownership

| Input | Responsibility | Strength | Gating |
|---|---|---:|---|
| Scroll | Primary narrative progress | 1.0 | Always, except intro and route leave locks |
| Time | Ambient wave, material shimmer, room particles | Low | Continuous |
| Pointer | Micro camera target shift and product reaction | 0.02-0.055 | Reduced during pass-through and final CTA focus |
| Scroll velocity | Brief wave stretch and slight chromatic displacement | Max 0.18 | Disabled in reduced motion; attenuated during reading holds |
| Hover | Local technical labels and CTA feedback | Local | Only inside chapter interaction envelopes |
| Click/tap | Detail state, sound toggle, CTA route transition | Discrete | Disabled during critical handoffs |
| Keyboard | Chapter links, details, CTA, sound control | Equivalent | Always available |

### Prohibited patterns

- No chapter begins from a blank or default camera pose.
- No repeated title fade-up from `y: 50` as the default reveal.
- No equal-strength pointer parallax throughout.
- No separate full-screen background color swap without a light or geometry bridge.
- No direct camera mutation from pointer code.
- No model layer unmount during a reversible transition.
- No desktop-only pass-through copied unchanged to mobile.

## 4. State model

```ts
type AetherExperienceState = {
  route: 'home' | 'product';
  routePhase: 'idle' | 'entering' | 'active' | 'leaving';
  activeChapter:
    | 'arrival'
    | 'material'
    | 'interior'
    | 'field'
    | 'resolve';
  globalProgress: number;
  chapterProgress: number;
  handoffId: string | null;
  handoffProgress: number;
  elapsedTime: number;
  deltaTime: number;
  scrollVelocity: number;
  scrollDirection: -1 | 0 | 1;
  pointer: {
    x: number;
    y: number;
    speed: number;
  };
  interactionMode: 'narrative' | 'explore' | 'detail' | 'route-transition';
  viewport: 'desktop-wide' | 'desktop' | 'tablet' | 'mobile';
  motionPreference: 'full' | 'reduced';
  performanceTier: 'high' | 'balanced' | 'safe';
  assets: {
    productReady: boolean;
    interiorReady: boolean;
    roomReady: boolean;
    fontsReady: boolean;
  };
};
```

## 5. Property ownership matrix

| Target/property | Narrative owner | Reactive channel | Ambient channel | Discrete owner |
|---|---|---|---|---|
| camera placement | route timeline only during route transitions | none | none | route transition |
| camera narrative position | active chapter or handoff timeline | none | none | none |
| camera reaction rotation | none | pointer damping | tiny breathing target offset | disabled during critical handoff |
| camera shake | none | velocity accent | low noise | disabled in reduced motion |
| camera target narrative | chapter or handoff timeline | none | none | route transition under cover |
| product placement | chapter or handoff timeline | none | none | detail state when chapter allows |
| product reaction | none | pointer yaw/pitch | suspended-core idle | detail state attenuates |
| product layer separation | material chapter | none | small follow-through | handoff owns ring after cue |
| wave shader narrative progress | interior/field timelines | velocity additive channel | time phase | none |
| title wrapper transform | GSAP chapter timeline | none | none | route transition cover may own outer wrapper |
| title inner hover | none | Motion local interaction | none | none |
| SVG bridge path | handoff timeline | none | dash shimmer | none |
| bloom strength | chapter/effect channel | velocity additive | base level | route cover may override |
| grain | none | none | global ambient | none |

## 6. Scene and rig hierarchy

```text
ExperienceScene
├── WorldRoot
│   ├── ProductWorldAnchor
│   │   └── ProductPlacementRig
│   │       └── ProductTransitionRig
│   │           └── ProductReactionRig
│   │               └── ProductIdleRig
│   │                   └── ProductModel
│   │                       ├── shell
│   │                       ├── outerRing
│   │                       ├── suspendedCore
│   │                       ├── waveguide
│   │                       └── named anchors
│   ├── InteriorRoot
│   │   ├── Tunnel
│   │   └── WaveRibbon
│   ├── RoomRoot
│   │   ├── RoomGeometry
│   │   ├── FieldContours
│   │   └── ListenerAnchor
│   └── AtmosphereRoot
│       ├── Particles
│       └── VolumetricAccents
├── CameraPlacementRig
│   └── CameraNarrativeRig
│       └── CameraReactionRig
│           └── CameraShakeRig
│               └── PerspectiveCamera
├── CameraTargetNarrativeRig
│   └── CameraTargetReactionRig
│       └── CameraTargetAnchor
├── LightingRoot
│   ├── NarrativeLightingRig
│   ├── EnvironmentLightingRig
│   └── ReactiveAccentRig
└── Effects
    ├── Bloom
    ├── DepthOfField
    ├── VelocityDisplacement
    ├── ColorGrade
    └── Grain
```

## 7. Shot presets

Values are starting points for tuning, not assumed final composition.

### `arrivalSilhouette`

```ts
{
  camera: {
    position: [0.00, 0.15, 6.20],
    target: [0.00, 0.05, 0.00],
    fov: 31,
    roll: 0
  },
  subject: {
    position: [0.40, -0.20, 0.00],
    rotation: [0.02, -0.42, 0.00],
    scale: 1.00
  },
  exposure: 0.72,
  composition: 'Product sits right of centre; left side reserved for title. Ring silhouette is readable but inner construction remains dark.'
}
```

### `arrivalHero`

```ts
{
  camera: {
    position: [0.10, 0.22, 4.90],
    target: [0.14, 0.06, 0.00],
    fov: 34,
    roll: -0.008
  },
  subject: {
    position: [0.34, -0.16, 0.00],
    rotation: [0.03, -0.30, 0.01],
    scale: 1.04
  },
  exposure: 1.00,
  composition: 'Clear premium three-quarter hero; title still occupies left safe area.'
}
```

### `materialExploded`

```ts
{
  camera: {
    position: [-0.52, 0.34, 4.15],
    target: [0.12, 0.02, 0.00],
    fov: 36,
    roll: 0.006
  },
  subject: {
    position: [0.18, -0.08, 0.00],
    rotation: [0.02, -0.08, 0.00],
    scale: 0.96
  },
  exposure: 1.08,
  composition: 'Layer depth is readable; technical labels occupy right and lower-left safe regions.'
}
```

### `ringMacro`

```ts
{
  camera: {
    position: [0.05, 0.08, 2.15],
    target: [0.02, 0.02, 0.00],
    fov: 29,
    roll: 0
  },
  subject: {
    position: [0.00, 0.00, 0.00],
    rotation: [0.00, 0.00, 0.00],
    scale: 1.18
  },
  exposure: 0.92,
  composition: 'Ring aperture dominates the central safe area and supports full occlusion on continued dolly.'
}
```

### `interiorTravel`

```ts
{
  camera: {
    position: [0.00, 0.00, 0.80],
    target: [0.00, 0.00, -3.00],
    fov: 47,
    roll: -0.015
  },
  exposure: 0.82,
  composition: 'Wave ribbon enters lower-left and leads to central vanishing point.'
}
```

### `roomEstablish`

```ts
{
  camera: {
    position: [-3.20, 1.45, 5.80],
    target: [0.20, 0.70, 0.00],
    fov: 42,
    roll: 0
  },
  exposure: 1.05,
  composition: 'Room context is clear; product remains visible as the source of the field.'
}
```

### `finalResolve`

```ts
{
  camera: {
    position: [0.00, 0.30, 5.20],
    target: [0.00, 0.10, 0.00],
    fov: 33,
    roll: 0
  },
  subject: {
    position: [0.00, -0.12, 0.00],
    rotation: [0.02, 0.00, 0.00],
    scale: 1.03
  },
  exposure: 0.96,
  composition: 'Calm centered product; CTA sits below the ring without competing with the silhouette.'
}
```

## 8. Master timeline hierarchy

```text
route:home
├── preload
├── intro
│   ├── darkness hold
│   ├── ring edge-light
│   ├── title entrance
│   └── scroll release
├── narrative master
│   ├── chapter:arrival
│   ├── handoff:arrival-material
│   ├── chapter:material
│   ├── handoff:material-interior
│   ├── chapter:interior
│   ├── handoff:interior-field
│   ├── chapter:field
│   ├── handoff:field-resolve
│   └── chapter:resolve
├── details
│   ├── material-detail-open
│   └── material-detail-close
└── route leave
```

## 9. Chapter specifications

### Chapter `arrival`: Silent Object

**Narrative purpose:** establish restraint, silhouette, and premium material presence before explaining functionality.

**Incoming state:** black stage; product loaded in `arrivalSilhouette`; ring edge light at 8%; no scroll control until intro release.

**Outgoing state:** product in `arrivalHero`; outer ring edge is the brightest stable contour; the title has reduced to a small chapter marker; material chapter lighting is already present at 12%.

| Progress | Phase | Choreography |
|---:|---|---|
| 0.00-0.10 | pre-roll | Maintain near-darkness. Ambient material shimmer continues at very low amplitude. Scroll indicator becomes visible. |
| 0.10-0.28 | entrance | Dolly from `arrivalSilhouette` toward `arrivalHero`. Increase rim light from 0.08 to 0.62. Reveal title line 1 after camera has moved 35%. |
| 0.28-0.42 | establish | Camera movement decelerates. Reveal line 2 and product descriptor. Product rotation changes only 4 degrees to keep silhouette stable. |
| 0.42-0.64 | development | Increase fill light to reveal inner core. Pointer target influence fades from 0.00 to 0.035. Small SVG arc draws around 38% of ring circumference. |
| 0.64-0.78 | hold | Major motion stops. Copy is readable. Ambient wave faintly moves inside the product. |
| 0.78-0.90 | transformation | Title masks close toward the ring axis. Camera target shifts 6% right; product rotates toward a more analytical angle. |
| 0.90-1.00 | handoff prep | Material key light begins. SVG arc extends into the technical diagram axis. Outer ring remains the visual constant. |

**Cues:**

- `chapter:enter` 0.00
- `ring:readable` 0.18
- `title:primary` 0.28
- `product:hero` 0.42
- `copy:available` 0.52
- `handoff:armed` 0.82
- `chapter:resolved` 1.00

**Critical interval:** 0.78 to 1.00. Reduce pointer camera influence by 55% so the analytical framing lands reliably.

### Handoff `arrival-material`

**Bridge:** SVG arc plus outer ring contour.

**Method:** screen-space line continuation and light bridge.

**Sequence:** The title exits along the same left-to-right axis as the SVG arc. The arc completes the ring contour, then extends into three technical callout lines. Material lighting begins before the product separates. The camera does not cut; it trucks left and slightly upward into `materialExploded`.

**Ownership:** `arrival` owns product placement until `handoff:armed`; handoff owns camera, product placement, SVG arc, and lighting until the material hero pose; `material` then owns layer separation.

**Completion:** callout lines are stable, the camera is in the material establishing shot, and the complete product remains assembled at material local progress `0`.

### Chapter `material`: Built to Shape

**Narrative purpose:** convert sculptural mystery into mechanical clarity.

**Incoming state:** complete product in analytical three-quarter view; technical lines available; material lighting active.

**Outgoing state:** outer ring aligned to camera and centered; shell and core receded; title reduced to the single word “Inside”; interior scene rendered behind the aperture.

| Progress | Phase | Choreography |
|---:|---|---|
| 0.00-0.12 | establish | Hold complete object. Draw final 12% of technical lines. Reveal material label. |
| 0.12-0.36 | separation | Separate shell, ring, suspension, and core along authored local axes with 60 ms overlap. Truck camera slightly to preserve readable depth. |
| 0.36-0.58 | development | Reveal one feature statement per layer. Labels enter from their anchor direction rather than a common vertical fade. Pointer provides limited depth response. |
| 0.58-0.70 | hold | Major transforms pause. Let the suspended core continue a small follow-through and settle. |
| 0.70-0.82 | transformation | Non-ring layers rotate edge-on and recede. Ring moves toward screen centre. Copy collapses to “Inside.” |
| 0.82-1.00 | handoff | Align ring normal to camera, tighten FOV, and begin interior render behind the aperture. |

**Layer timing:** shell begins first, suspension follows 0.05 progress later, core follows 0.10 later. The ring initially remains stable to preserve orientation.

**Interaction envelope:** 0.32 to 0.70. Hovering labels may increase the associated layer scale by at most 2.5% through a child reaction rig. Disable label interaction after 0.70.

### Handoff `material-interior`

**Bridge:** outer ring aperture.

**Progress window:** global 0.40 to 0.49.

**Outgoing final state:** ring screen center `[0.50, 0.50]`; apparent outer diameter `1.16 × viewport short edge`; yaw within 0.5 degrees of camera normal; camera shot `ringMacro`.

**Incoming initial state:** tunnel entrance plane aligned with the ring aperture; camera position and target match the outgoing pose; interior light at 15%; wave ribbon visible at 8% opacity.

**Choreography:**

1. At handoff 0.00, pointer camera influence becomes `0.008`.
2. At 0.12, begin dolly and reduce FOV from 34 to 29.
3. At 0.24, activate render-target interior behind the aperture.
4. At 0.45, move the word “Inside” to the tunnel vanishing axis and reduce it to a thin outline.
5. At 0.68, ring coverage exceeds 95% of the central safe area.
6. At 0.72, hide outgoing shell and core under full cover.
7. At 0.76, transfer camera target ownership to the tunnel target rig.
8. At 0.82, morph the SVG ring outline into the wave ribbon origin.
9. At 1.00, pointer strength resolves to `0.022`; interior chapter local progress is 0.

**Reverse:** outgoing product layers stay mounted until global progress exceeds 0.55. Visibility and render blend derive from progress. No one-time callbacks destroy state.

### Chapter `interior`: Inside the Wave

**Narrative purpose:** let the viewer experience the waveguide as a spatial system rather than a diagram.

**Incoming state:** camera just inside tunnel; wave ribbon begins at aperture; low light and central vanishing point.

**Outgoing state:** ribbon expands beyond tunnel geometry; the camera reaches the tunnel exit; room color temperature is already visible beyond.

| Progress | Phase | Choreography |
|---:|---|---|
| 0.00-0.14 | entrance | Move slowly into tunnel; reveal wave ribbon from 0 to 32% with DrawSVG-like spatial equivalent. |
| 0.14-0.38 | development | Ribbon alternates between compression and expansion zones. Small copy labels attach to stable tunnel anchors. |
| 0.38-0.54 | hold | Camera travel slows by 65%. Viewer can read the waveguide explanation. Ambient wave continues. |
| 0.54-0.74 | transformation | Wave ribbon amplitude increases and tunnel ribs react sequentially. Velocity effect is clamped to preserve legibility. |
| 0.74-0.88 | apex | Camera accelerates moderately; FOV widens from 44 to 49; incoming room light blooms beyond the tunnel exit. |
| 0.88-1.00 | handoff prep | Ribbon leaves tunnel constraints and becomes a broad contour. Camera target moves to the listener anchor in the room. |

**Camera path:** cubic path with three authored points. Target path is separate and leads by 4 to 7% of chapter progress.

**Roll:** maximum `-0.018` radians and resolves to zero before room reveal.

**Critical interval:** 0.72 to 0.94. Disable pointer camera rotation and use pointer only for low-amplitude ribbon displacement.

### Handoff `interior-field`

**Bridge:** wave ribbon.

**Method:** spatial carry plus vector-role transformation.

The tunnel exit becomes a room window under bright cover. The ribbon continues in the same screen-space direction, expands laterally, and becomes the first room-field contour. The room is visible before the tunnel ribs dissolve. The camera target shifts to the listener anchor while the camera completes its forward motion and then cranes upward into `roomEstablish`.

**Completion:** room geometry is authoritative, tunnel ribs are fully hidden, ribbon contour belongs to the room field system, camera roll is zero, and field chapter local progress is 0.

### Chapter `field`: The Room Responds

**Narrative purpose:** demonstrate adaptive room-scale behavior while maintaining the product as the field source.

**Incoming state:** room establishing shot; product visible at left-midground; first field contour crosses the listener anchor.

**Outgoing state:** contours converge toward product and listener; room geometry reduces; product returns toward centered final presentation.

| Progress | Phase | Choreography |
|---:|---|---|
| 0.00-0.18 | establish | Crane into room shot. Keep first contour stable long enough to establish scale. |
| 0.18-0.42 | development | Emit three contour families from the product. Each responds to room surfaces and listener position. Reveal concise statements at stable screen regions. |
| 0.42-0.62 | interaction hold | Allow pointer to move the listener anchor within a constrained zone. Field contours respond; camera remains largely stable. |
| 0.62-0.78 | transformation | Return listener anchor to authored position. Room surfaces dim and contour lines intensify. |
| 0.78-0.90 | handoff prep | Contours contract toward the product ring. Camera begins moving toward `finalResolve`. |
| 0.90-1.00 | handoff | Room becomes a dark field; the final contour aligns with the product ring and morphs into its edge light. |

**Interaction envelope:** pointer controls listener anchor only from 0.42 to 0.62. On touch, a short drag interaction is available within the same range with a visible “move the listening point” instruction. Keyboard controls move the point in four directions.

### Handoff `field-resolve`

**Bridge:** field contour becomes ring edge light.

**Method:** vector morph, spatial contraction, and camera match.

The final room contour contracts toward the product and becomes circular. MorphSVG controls the DOM/SVG overlay while the WebGL contour follows a matched proxy progress. At 72% coverage, room surfaces are fully dark. The product has already returned to complete form under the field lines. Camera reaches the final centered shot as the contour aligns to the ring.

**Reverse:** room remains mounted and dark until progress is below 0.18. Contours expand from the ring without a pop.

### Chapter `resolve`: A Quiet Centre

**Narrative purpose:** release intensity, restore agency, and present the final action.

**Incoming state:** complete product centered; ring edge light linked to final contour; dark calm environment.

**Outgoing state:** CTA route transition state or stable idle.

| Progress | Phase | Choreography |
|---:|---|---|
| 0.00-0.18 | resolution | Camera settles the final 3% after field contraction. Ambient sound and particles reduce. |
| 0.18-0.38 | copy entrance | Reveal final statement by two lines with restrained masks. No large translation. |
| 0.38-0.58 | CTA entrance | CTA and product details become interactive. Ring responds subtly to pointer proximity. |
| 0.58-1.00 | stable explore | Preserve a calm final state. Scroll can continue into semantic footer content without changing the product pose. |

**CTA transition:** clicking “Explore Aether One” expands the ring edge into a route cover, freezes narrative input, prefetches the destination, and transfers to the product route under full cover.

## 10. Semantic cue map

| Cue | Meaning | Responding systems |
|---|---|---|
| `intro:ring-edge` | First visible product contour | rim light, title pre-roll, ambient sound |
| `arrival:hero` | Product is fully legible | camera, copy, pointer envelope |
| `material:separate` | Mechanical explanation begins | layer rigs, labels, SVG callouts |
| `material:hold` | Reading state | camera hold, label interaction |
| `portal:armed` | Ring is prepared as aperture | interaction gate, interior preload, camera target |
| `portal:covered` | Outgoing swap is safe | scene visibility, environment ownership |
| `interior:apex` | Maximum spatial intensity | wave amplitude, FOV, velocity effect |
| `room:available` | Listener interaction can begin | pointer/drag/keyboard controls |
| `field:contract` | Resolution begins | contours, room lighting, camera move |
| `resolve:interactive` | CTA and details enabled | Motion UI, focus, route prefetch |

## 11. Responsive direction

### Desktop wide

Use full lateral composition, stronger room depth, and technical labels distributed around the product. Cap pointer camera yaw at `0.055` outside critical intervals.

### Laptop and tablet

Reduce camera truck distances by 20 to 30%. Keep labels closer to their anchors. Reduce tunnel FOV apex by 3 degrees. Use fewer room contour families.

### Mobile portrait

- Product remains near center rather than right-aligned in `arrival`.
- Title occupies top and lower regions rather than a single left column.
- Material layers separate vertically and slightly in depth instead of broadly horizontally.
- Ring portal scale increases by 18% and camera lateral offsets are removed.
- Interior travel is shorter and roll is disabled.
- Room chapter uses a simplified abstract field rather than full room geometry on safe tier.
- Listener interaction uses a visible drag area and can be skipped.
- Final CTA remains in normal DOM flow below the stage if viewport height is limited.

### Reduced motion

- Replace the fast portal dolly with a matched ring scale and short masked dissolve.
- Disable camera roll, velocity displacement, camera shake, and large parallax.
- Use three key camera poses with shorter interpolation.
- Preserve the ring, wave, and contour bridge concepts.
- Keep ambient motion low and optional.
- Type reveals through opacity and small clipping changes rather than large travel.

## 12. Performance tiers

### High

Full room geometry, depth of field, higher contour count, dynamic rim shadows, DPR cap 2.

### Balanced

Reduced room detail, selective bloom and color grade, moderate particles, DPR cap 1.5.

### Safe

Simplified room planes, no depth of field, low contour count, baked lighting, DPR cap 1.15, portal transition uses a mask without dual full-resolution render targets.

## 13. Implementation plan

### Slice 1: Foundation and arrival

- persistent DOM stage and semantic scroll regions,
- Lenis and ScrollTrigger integration,
- experience runtime and target registry,
- camera and product rigs,
- `arrival` timeline,
- shot capture controls,
- responsive `arrival` shots.

### Slice 2: Material and first handoff

- model layer registry and anchors,
- technical SVG overlay,
- material chapter timeline,
- label interaction envelope,
- `arrival-material` handoff,
- reverse validation.

### Slice 3: Portal proof

- ring alignment,
- interior render strategy,
- cover measurement,
- camera target transfer,
- `material-interior` handoff,
- mobile and safe-tier alternative.

This is the architectural proof. Do not build the full tunnel before the portal is reliable.

### Slice 4: Interior and field

- tunnel and wave systems,
- camera and target paths,
- velocity channels,
- room preloading,
- interior-field handoff,
- listener interaction.

### Slice 5: Resolution and routes

- field contraction,
- final product pose,
- CTA presence,
- route cover and cleanup,
- footer flow.

### Slice 6: Quality pass

- reduced motion,
- performance tiers,
- accessibility and keyboard flow,
- responsive choreography,
- recordings and rubric audit,
- final microtiming and sound synchronization.

## 14. Tuning register

Priority values:

```ts
export const aetherDirection = {
  arrival: {
    scrollVh: 2.2,
    titleStart: 0.18,
    heroSettle: 0.42,
    holdStart: 0.64,
    handoffStart: 0.82,
    pointerMax: 0.035,
  },
  material: {
    scrollVh: 3.4,
    separationStart: 0.12,
    separationEnd: 0.36,
    labelHoldEnd: 0.70,
    ringAlignStart: 0.78,
    layerDepth: 0.72,
  },
  portal: {
    pointerMin: 0.008,
    interiorVisible: 0.24,
    safeCoverage: 0.68,
    sceneTransfer: 0.72,
    targetTransfer: 0.76,
  },
  interior: {
    scrollVh: 4.0,
    holdStart: 0.38,
    holdEnd: 0.54,
    apexStart: 0.74,
    fovApex: 49,
  },
  field: {
    scrollVh: 3.8,
    interactionStart: 0.42,
    interactionEnd: 0.62,
    contractionStart: 0.78,
  },
};
```

## 15. Acceptance criteria

The experience passes when:

1. The outer ring remains a recognizable continuity device across all five chapters.
2. Every chapter has a stable, readable key pose.
3. The portal handoff exposes no invalid frame on desktop, mobile, or reverse scrub.
4. Pointer movement cannot alter the final narrative rig values.
5. The product and camera land on the same poses after slow, fast, and reversed scroll.
6. Copy remains readable during documented holds.
7. Mobile uses separately authored shots and portal coverage.
8. Reduced motion preserves all required content and transition logic without large tunnel travel.
9. Balanced tier sustains the documented target frame behavior on representative devices.
10. Route leave removes all triggers, ticker callbacks, listeners, and route-specific GPU resources.
