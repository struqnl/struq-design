# Experience Architecture

## Architectural goals

The architecture must make these operations easy:

- define a new chapter without rewriting the orchestrator,
- inspect the active state,
- scrub any chapter independently,
- combine narrative and reactive motion without property conflicts,
- reverse through a transition safely,
- switch responsive choreography,
- cleanly unmount a route,
- tune values without hunting through components.

A useful architecture separates **direction data**, **runtime state**, **visual systems**, and **timeline construction**.

## Suggested project structure

```text
src/
├── app/ or routes/
├── experience/
│   ├── direction/
│   │   ├── chapters.ts
│   │   ├── shots.ts
│   │   ├── handoffs.ts
│   │   ├── motion.ts
│   │   └── responsive.ts
│   ├── runtime/
│   │   ├── ExperienceProvider.tsx
│   │   ├── experience-state.ts
│   │   ├── experience-registry.ts
│   │   ├── progress-router.ts
│   │   ├── input-system.ts
│   │   └── lifecycle.ts
│   ├── timelines/
│   │   ├── build-master-timeline.ts
│   │   ├── build-intro.ts
│   │   ├── chapters/
│   │   └── handoffs/
│   ├── stage/
│   │   ├── ExperienceCanvas.tsx
│   │   ├── CameraRig.tsx
│   │   ├── LightingRig.tsx
│   │   ├── SubjectRig.tsx
│   │   ├── environments/
│   │   └── effects/
│   ├── dom/
│   │   ├── ExperienceOverlay.tsx
│   │   ├── ChapterCopy.tsx
│   │   ├── SvgBridges.tsx
│   │   └── InterfaceLayer.tsx
│   ├── debug/
│   │   ├── ExperienceHUD.tsx
│   │   ├── TimelineScrubber.tsx
│   │   └── PerformancePanel.tsx
│   └── types.ts
└── styles/
```

Do not enforce this tree mechanically. Preserve the separation of responsibilities even when the project uses a different naming scheme.

## Direction data

Direction data describes the intended experience without containing component logic.

```ts
export type ShotPreset = {
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
    roll?: number;
  };
  subject?: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number | [number, number, number];
  };
  focus?: {
    distance: number;
    aperture: number;
  };
  exposure?: number;
  notes: string;
};

export type ChapterDirection = {
  id: string;
  scrollVh: number;
  phases: Record<string, [number, number]>;
  incomingShot: string;
  heroShot: string;
  outgoingShot: string;
  interactionEnvelope: [number, number];
  copyCues: string[];
  bridgeToNext?: string;
};
```

Direction data should be serializable when possible. That makes it easier to inspect, expose in controls, save presets, and let an agent update values safely.

## Runtime state

Use mutable runtime state for values that change every frame. Do not push every pointer or progress update through React state.

A simple state object can be enough:

```ts
export type ExperienceRuntime = {
  globalProgress: number;
  activeChapterId: string;
  chapterProgress: number;
  elapsedTime: number;
  deltaTime: number;
  scrollVelocity: number;
  scrollDirection: -1 | 0 | 1;
  pointer: { x: number; y: number; speed: number };
  transition: {
    id: string | null;
    progress: number;
    phase: 'idle' | 'entering' | 'active' | 'leaving';
  };
};
```

React state remains appropriate for semantic UI state, accessibility state, route state, and values that must trigger a render. Refs, external stores, or mutable objects are more appropriate for high-frequency visual values.

## Registry pattern

Timelines often need to animate objects owned by different React components. Avoid global DOM selectors and brittle imports. Use a registry of named targets.

```ts
export type ExperienceTargets = {
  cameraNarrativeRig?: THREE.Group;
  cameraTarget?: THREE.Object3D;
  subjectPlacementRig?: THREE.Group;
  subjectMaterial?: THREE.ShaderMaterial;
  heroTitle?: HTMLElement;
  bridgePath?: SVGPathElement;
};
```

Components register targets when mounted and unregister them when disposed. Timeline builders receive the registry rather than querying the entire document.

Benefits:

- clear dependencies,
- easier testing,
- fewer selector collisions,
- safer route cleanup,
- direct Three.js object animation,
- more useful missing-target errors.

## Progress router

The progress router converts global or scroll-based progress into local chapter and handoff progress.

```ts
export function rangeProgress(
  value: number,
  start: number,
  end: number,
): number {
  if (end <= start) return value >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}
```

For large experiences, store chapter ranges centrally:

```ts
const narrativeRanges = {
  arrival: [0.00, 0.18],
  reveal: [0.18, 0.42],
  transform: [0.42, 0.72],
  resolve: [0.72, 1.00],
} as const;
```

ScrollTrigger can also own each chapter's local progress. Choose one model and document the source of truth.

### Global master mapping

Use when:

- the experience is one uninterrupted scroll narrative,
- many systems need a common global progress,
- transitions overlap deeply,
- a global scrubber is important.

### Per-chapter ScrollTriggers

Use when:

- chapters have independent semantic sections,
- lazy activation matters,
- chapters can be mounted separately,
- content height is dynamic.

A hybrid is common: per-chapter triggers feed local progress into a route-level state model.

## Timeline builder pattern

Timeline builders should be pure enough to recreate safely.

```ts
export function buildChapterReveal({
  gsap,
  targets,
  direction,
}: BuildTimelineArgs) {
  const tl = gsap.timeline({ paused: true });

  tl.addLabel('chapter:enter', 0)
    .fromTo(
      targets.heroTitle,
      { autoAlpha: 0, yPercent: 120 },
      { autoAlpha: 1, yPercent: 0, duration: 0.18, ease: 'power3.out' },
      'chapter:enter+=0.04',
    )
    .to(
      targets.cameraNarrativeRig.position,
      {
        x: direction.heroShot.camera.position[0],
        y: direction.heroShot.camera.position[1],
        z: direction.heroShot.camera.position[2],
        duration: 0.32,
        ease: 'power2.inOut',
      },
      'chapter:enter',
    )
    .addLabel('subject:established', 0.32)
    .addLabel('handoff:armed', 0.82)
    .addLabel('chapter:resolved', 1);

  return tl;
}
```

Use a normalized timeline duration of `1` for scroll-driven chapters when that makes phase reasoning easier. For time-driven intros and route transitions, use natural seconds.

## DOM and WebGL coordination

DOM and WebGL should share semantic cues, not necessarily the same implementation layer.

Example:

```text
cue: subject:established
- camera reaches hero shot
- subject key light reaches 80%
- title line 1 settles
- metadata becomes interactive
```

A GSAP timeline can animate DOM and Three.js objects directly. Alternatively, it can animate proxy values consumed by R3F. Use direct animation for simple object transforms and proxy/state channels for shader values or composed effects.

## Route lifecycle

A route-level experience must define:

- when scroll is locked or unlocked,
- when assets are ready enough to begin,
- intro timeline behavior,
- route-leave transition,
- ScrollTrigger creation and refresh,
- Lenis start/stop behavior,
- history restoration,
- timeline and ticker cleanup,
- WebGL resource disposal,
- document class and style restoration.

A route transition should not leave the previous experience's scroll spacers, ticker functions, event listeners, or render targets alive.

## Error handling and readiness

Do not silently build timelines against missing targets. Validate the registry:

```ts
function requireTarget<T>(value: T | undefined, name: string): T {
  if (!value) throw new Error(`Missing experience target: ${name}`);
  return value;
}
```

Create timelines only after required assets and targets are ready. For partial readiness, define which elements are optional and which are blockers.

## Architecture acceptance tests

The architecture is healthy when:

- a chapter can be scrubbed independently,
- a handoff can be reversed repeatedly without jumping,
- pointer movement cannot overwrite camera narrative movement,
- a mobile shot can be swapped without changing timeline logic,
- route unmount removes all animation and frame callbacks,
- tuning values are discoverable in direction files,
- the current chapter, cue, and owners can be inspected,
- disabling post-processing does not break the narrative,
- reduced motion retains hierarchy and continuity.
