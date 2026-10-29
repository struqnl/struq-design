# Full Audit Example: Generic but Technically Impressive Portfolio

## Evidence supplied

The current portfolio contains:

- six `100vh` sections,
- a fixed R3F canvas,
- one model per section toggled by active index,
- Lenis and ScrollTrigger,
- separate GSAP timelines inside each section,
- Motion hover effects on cards,
- pointer camera parallax inside `useFrame`,
- post-processing bloom and chromatic aberration,
- section titles revealed with SplitText,
- a recording showing fast-scroll jumps and repeated fade transitions.

## Executive diagnosis

The implementation has strong individual effects but no authoritative experience state or handoff system. Each section behaves as an independent animation scene, while the fixed canvas only creates the appearance of persistence. Camera, model visibility, and environment state reset at each boundary. Multiple systems write to camera and DOM transforms, so final poses vary by input speed. The result feels like six demos placed in sequence rather than one directed experience.

## Scorecard

| Category | Score / 5 | Evidence | Priority |
|---|---:|---|---|
| Experience thesis | 2 | “Experimental portfolio” is a style, not a transformation. | High |
| Persistent continuity | 2 | Canvas persists, but scene state resets per section. | Critical |
| Chapter purpose | 2 | Sections correspond to content categories only. | High |
| Handoff quality | 1 | Opacity crossfade and model visibility toggle. | Critical |
| State continuity | 1 | Camera and model transforms jump to defaults. | Critical |
| Property ownership | 1 | GSAP and `useFrame` both write camera transform. | Critical |
| Timeline hierarchy | 2 | Local timelines exist but no route or handoff composition. | High |
| Semantic cues | 1 | Anonymous numeric offsets. | Medium |
| Rhythm and pacing | 2 | Continuous motion with no reading holds. | High |
| Camera direction | 2 | Repeated orbit and push-in, no named shots. | Critical |
| Subject choreography | 3 | Good model animation inside sections. | Medium |
| Typography | 2 | Same SplitText reveal in every section. | Medium |
| SVG integration | 0 | None. | Optional |
| Input arbitration | 1 | Pointer fights scroll camera. | Critical |
| Interaction envelopes | 1 | Hover remains active during transitions. | High |
| Reverse behavior | 1 | Visibility callbacks leave stale models. | Critical |
| Responsive choreography | 1 | Desktop values multiplied by 0.7. | High |
| Reduced motion | 0 | Not implemented. | High |
| Performance | 2 | All models stay active; post effects fixed at full quality. | High |
| Lifecycle | 2 | Some cleanup exists; duplicate triggers after route return. | Critical |
| Tuning readiness | 1 | Values spread across components. | High |
| Validation | 1 | Desktop forward scroll only. | High |

**Total:** 30 / 110

The page is visually capable but structurally weak. Decorative polish should pause until continuity, ownership, and lifecycle are corrected.

## Current continuity map

| Boundary | Persistent element | Current transition | Camera continuity | Ownership | Result |
|---|---|---|---|---|---|
| Hero → About | canvas only | hero fades; portrait model toggles on | camera reset | both sections briefly write | visible snap |
| About → Work | canvas only | background crossfade | orbit restarts | active index callback | generic section change |
| Work → Project 1 | card thumbnail | DOM card scales; 3D model appears separately | no shared pose | Motion and GSAP overlap | broken shared-element illusion |
| Project 1 → Project 2 | none | opacity crossfade | camera returns to origin | callbacks | full reset |
| Projects → Contact | grain | all 3D fades out | camera unused | unclear | experience collapses into normal footer |

## Property-conflict map

### Camera position

**Writers:**

- hero GSAP timeline,
- about GSAP timeline,
- project GSAP timeline,
- pointer `useFrame` lerp,
- route transition.

**Symptom:** final framing varies by scroll speed and pointer position.

**Correction:** introduce route, narrative, reaction, and shake rigs. Chapters and handoffs own only the narrative rig. Pointer owns reaction. Route transition owns a parent route rig.

### Model visibility

**Writers:**

- active-section React state,
- GSAP `autoAlpha` proxy,
- conditional mounting.

**Symptom:** reverse scroll leaves the wrong model visible; mounting causes frame drops.

**Correction:** retain adjacent bridge assets, derive visibility from local progress, and transfer scene-group ownership through handoff timelines. Unmount only outside reversible ranges.

### DOM project card transform

**Writers:**

- Motion hover scale,
- GSAP project-open timeline,
- CSS transition.

**Symptom:** card jumps at click and exits from an unpredictable scale.

**Correction:** assign Motion to an inner hover wrapper and GSAP/Flip to an outer transition wrapper. Remove CSS transform transition from the outer layer.

### Chromatic aberration

**Writers:**

- raw scroll velocity,
- project transition timeline.

**Symptom:** effect spikes during fast scroll and remains elevated after route interruption.

**Correction:** separate `velocityAberration` and `transitionAberration` channels, clamp and damp them, and resolve the final value centrally.

## Architecture findings

### Finding 1: Section index is not an experience state model

The current `activeSection` integer controls model visibility and copy, but it cannot represent overlaps, handoff progress, interaction gating, or transition ownership.

**Correction:** introduce chapter and handoff state:

```ts
{
  activeChapter,
  chapterProgress,
  activeHandoff,
  handoffProgress,
  interactionMode,
  cameraOwner,
  viewportClass,
  reducedMotion,
  performanceTier
}
```

Keep high-frequency values outside React render state.

### Finding 2: Fixed canvas without persistent state is superficial continuity

The canvas remains mounted, but each section restores default camera, background, light, and model transforms.

**Correction:** identify one persistent visual motif. For this portfolio, use a “lens plane” that changes role:

- hero: abstract refractive plane,
- about: portrait distortion surface,
- work: project index portal,
- project: view into project world,
- contact: plane resolves into a clear glass interface.

The lens plane becomes the bridge. Camera and lighting evolve around it.

### Finding 3: Chapter construction follows content categories

“About,” “Work,” and “Contact” are information labels, not visual actions.

**Correction:** redefine chapters as transformations:

| Current | Directed chapter | Visual action |
|---|---|---|
| Hero | `arrival` | lens plane condenses from noise into a stable portal |
| About | `identity` | portrait and biography emerge through the lens depth field |
| Work index | `selection` | lens multiplies into project apertures along a path |
| Project detail | `immersion` | selected aperture expands and becomes the project world |
| Contact | `return` | project world collapses into one transparent communication plane |

Semantic headings can remain About, Work, and Contact in the DOM.

## Choreography findings

### Repeated reveal language

Every heading reveals by characters from `yPercent: 100` with the same stagger and ease.

**Consequence:** chapters have no differentiated character.

**Correction:** define a small branded vocabulary:

- arrival titles: line masks with slow contrast emergence,
- identity copy: words refracted across the lens axis,
- work labels: path-ordered reveals along project apertures,
- project title: screen-space matched expansion from selected card,
- contact: restrained opacity and line drawing with no large travel.

### No holds

The camera, model, type, and background move throughout each scroll range.

**Correction:** add stable intervals:

- arrival hero hold after lens resolves,
- biography reading hold with camera fixed and pointer response enabled,
- work selection hold where pointer exploration is primary,
- project hero hold before deeper narrative progression,
- contact final state with no forced movement.

### Equal emphasis

Bloom, scale, camera travel, and SplitText all peak together at each boundary.

**Correction:** assign one apex per transition. For hero-to-identity, make the lens refraction and portrait emergence primary; camera and typography support it at lower intensity.

## Camera findings

### Current pattern

Each section uses an orbit from left to right plus a forward move. Camera target remains at world origin.

### Problems

- repeated movement language,
- no target leading,
- no composition safe areas,
- pointer drift changes final shot,
- mobile crops subjects,
- no visual reason for the orbit.

### New shot plan

```text
arrivalWide
identityPortrait
selectionTopological
projectApertureMacro
projectWorldHero
contactResolve
```

Each shot receives desktop and mobile variants. Target anchors follow the lens, portrait eye line, selected project aperture, and contact plane rather than remaining at origin.

## Handoff redesign

### Hero → Identity

**Bridge:** refractive lens plane.

The plane moves from abstract central composition to a right-side portrait lens. The camera trucks slightly left while the target follows the lens. Portrait texture appears inside the plane before abstract noise fades. The hero title compresses into a small vertical identity marker.

### Identity → Selection

**Bridge:** lens plane splits into three project apertures.

Use a vector line as a spatial guide. Biography copy exits along that path. Apertures appear sequentially, but the original lens remains the first aperture, preserving continuity.

### Selection → Project detail

**Bridge:** selected project aperture and DOM card.

Use Flip on an outer DOM project-card wrapper to preserve screen-space bounds while the WebGL aperture matches those bounds. Expand both toward the viewport under one GSAP transition timeline. Motion retains hover on an inner wrapper and is disabled after click intent.

### Project detail → Contact

**Bridge:** project color field contracts into a clear glass plane.

The camera pulls out rather than resetting. Project typography reduces into contact metadata. The final state releases the persistent stage into normal document flow.

## Responsive findings

The current mobile version multiplies camera positions and model scale by constants. This fails because composition is not linear.

### Corrections

- author mobile shots,
- use centered lens compositions,
- reduce lateral camera movement,
- move biography into normal flow during the reading hold,
- replace hover exploration with tap selection,
- use a shorter project aperture transition,
- increase bridge coverage based on the short viewport edge,
- reduce simultaneous model count and post-processing.

## Reduced-motion plan

- preserve lens-plane continuity,
- move between matched shots with short masked transitions,
- remove orbit, large parallax, and chromatic velocity effect,
- use opacity and small scale changes for type,
- keep project selection keyboard accessible,
- make normal document flow available without scroll trapping.

## Performance findings

1. All six models render continuously, including invisible models.
2. Three full-resolution render targets remain allocated.
3. DPR is uncapped.
4. Chromatic aberration and bloom run at all times.
5. pointer movement sets React state.
6. models mount at section callbacks, causing decode and shader work during transitions.

### Correction sequence

- preload only current and next bridge assets,
- retain adjacent models through reversible ranges,
- disable rendering for inactive groups,
- cap DPR by tier,
- reduce render-target resolution,
- move pointer values to refs,
- centralize effects channels,
- profile route return for leaks.

## Lifecycle findings

`ScrollTrigger.getAll().forEach(kill)` is called globally on one route, affecting unrelated site triggers. A Lenis ticker callback is added on every mount but removed with a different function identity.

### Correction

- scope timeline and trigger instances to the route,
- retain callback references for removal,
- use `useGSAP` or a scoped context,
- dispose route render targets,
- restore document overflow and cursor state,
- test browser back/forward.

## Remediation sequence

### Stage 1: State and rig foundation

- introduce experience runtime,
- create camera rig hierarchy,
- centralize direction data,
- remove direct pointer writes to camera narrative transforms,
- fix ticker cleanup.

**Validation:** current hero behaves identically after repeated mount/unmount and pointer movement does not alter narrative end pose.

### Stage 2: First directed vertical slice

Rebuild hero-to-identity using the lens bridge, named shots, one handoff timeline, responsive variants, and reduced motion.

**Validation:** forward and reverse boundary contains no reset or opacity-only swap.

### Stage 3: Work selection architecture

Create persistent aperture system, interaction envelope, and screen-space alignment between DOM cards and WebGL apertures.

### Stage 4: Project transition

Separate Motion hover and GSAP/Flip transition wrappers. Implement route cover and destination readiness.

### Stage 5: Remaining chapters and quality

Migrate contact resolution, performance tiers, accessibility, recordings, and full rubric audit.

## Before-and-after behavior specification

### Before

The hero model fades out. The camera returns to origin. The about portrait fades in. The same character stagger reveals the heading. Pointer motion continues throughout.

### After

The hero lens plane moves toward the portrait composition while remaining visible. The camera target follows it before the camera trucks left. The portrait appears inside the lens while the abstract shader still surrounds it. The hero title compresses into a vertical identity marker. Pointer influence reduces during the transfer and returns during the biography hold. No camera or environment reset occurs.

## Validation tests

- repeat every handoff forward and backward ten times,
- compare final shot transforms after slow and fast scroll,
- test pointer at all viewport corners during camera landings,
- resize inside each handoff,
- test route leave during transition and browser back,
- test mobile portrait and short-height laptop,
- test reduced motion and keyboard-only navigation,
- inspect trigger, ticker, listener, texture, and render-target counts after five route cycles.
