# GSAP Plugin Patterns

This reference assigns each plugin a clear role inside a cinematic experience. Use plugins because they solve a transition or direction problem, not because they are available.

## ScrollTrigger

Use for:

- chapter progress mapping,
- persistent-stage pin ranges,
- activation and deactivation,
- velocity and direction signals,
- scroll labels and debug markers,
- optional snapping.

Direction questions:

- What is the scroll-distance budget?
- Is the stage pinned once or per chapter?
- What happens before and after the range?
- Is the timeline fully scrubbed or partly state-based?
- What must happen in reverse?
- When are measurements refreshed?

Avoid creating one trigger for every small element when a chapter timeline can coordinate them.

## SplitText

Use for:

- line, word, and character choreography,
- masked editorial reveals,
- directional reading order,
- typographic bridges,
- reflow-aware text sequences.

Direction schema:

```text
split unit: lines
mask: overflow hidden per line
origin: bottom
order: document order
stagger: 70 ms
relationship: begins when camera move reaches 65%
resolve: final line settles 120 ms after key light
responsive: mobile splits by words, not lines
```

Keep accessible original text available and revert split markup during cleanup.

## DrawSVGPlugin

Use for:

- technical drawing reveals,
- paths that guide the camera or eye,
- diagrams and annotations,
- vector bridge elements,
- line accents tied to chapter beats.

Direction schema:

```text
path role: bridge from product outline to tunnel axis
start: 0% drawn
entrance: draw 0 to 58% during establish
hold: preserve 58% while copy is readable
handoff: complete draw and move highlight along the final 42%
reverse: exact scrub reversal
```

Prepare paths carefully. Multi-segment paths may need to be separated for predictable drawing.

## MorphSVGPlugin

Use for:

- icon-to-object transitions,
- typography-to-symbol bridges,
- mask deformation,
- portal shape transitions,
- vector states that preserve conceptual identity.

Direction questions:

- Are source and target paths semantically related?
- Should the form rotate, scale, or move during the morph?
- Which contour point should visually remain anchored?
- Is the morph a primary beat or a transition cover?
- Does the shape remain valid on mobile?

Prepare source and target paths to reduce unexpected point correspondence. Break complex forms into multiple paths when needed.

## MotionPathPlugin

Use for:

- camera or object travel along authored curves,
- particles following a visual axis,
- interface elements attached to a path,
- spatial carry through a transition.

Separate path progress from auto-rotation when direction must be art-directed. A camera path should also define target behavior and FOV.

## Flip

Use for:

- moving an element between DOM layouts while preserving visual continuity,
- grid-to-detail transitions,
- navigation and overlay expansion,
- shared-element route transitions.

A FLIP transition is a state-layout bridge. It does not replace the chapter state model. Define which wrapper GSAP owns and keep Motion layout animation off that same layer.

## Observer

Use for:

- wheel or touch gestures that advance discrete chapters,
- controlled full-screen state experiences,
- drag and swipe intent,
- gesture locking,
- pausing native scroll during an immersive mode (stop Lenis with `lenis.stop()` and resume it on exit).

Define thresholds, cooldowns, reversibility, focus behavior, keyboard alternatives, and escape conditions. Do not trap the user without an accessible navigation path.

## ScrollToPlugin

Use for:

- explicit chapter navigation,
- restoring a progress location,
- menu links into an immersive sequence,
- guided demos.

With Lenis active, `lenis.scrollTo()` is the one authoritative scroll command path. Do not tween the root scroller with ScrollToPlugin at the same time, or two scroll animations will fight. Use ScrollToPlugin only for non-root scroll containers.

## CustomEase

Use for:

- branded camera acceleration,
- a repeated product motion signature,
- transition covers requiring exact velocity shape,
- matching motion to sound or film reference.

Document the intended feel and reuse the same named ease across related beats. Avoid a different custom ease for every tween.

## CustomWiggle and CustomBounce

Use sparingly for:

- physically justified impacts,
- tactile UI accents,
- elastic materials,
- stylized object responses.

They are rarely appropriate for the main camera.

## Draggable and InertiaPlugin

Use for:

- object exploration,
- carousels with physical response,
- 3D model rotation proxies,
- timeline scrubbing controls,
- spatial interfaces.

Define boundaries, snapping, inertia, handoff to scroll, and what happens when the narrative timeline becomes active.

## TextPlugin

Use for controlled text replacement, counters, or terminal-like effects. Do not use typewriter behavior as a default “tech” aesthetic without narrative justification.

## Physics and procedural plugins

Physics-based plugins can create useful particles and impacts, but WebGL particle systems may be more appropriate for large quantities. Choose based on visual role and performance.

## Plugin registration pattern

Register only in the browser for frameworks that render on the server.

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    MorphSVGPlugin,
    MotionPathPlugin,
  );
}
```

Verify import paths and bundler behavior against the installed GSAP version and official documentation.

## Plugin review rule

For every plugin in the project, document:

- the experience problem it solves,
- its authoritative properties,
- its lifecycle and cleanup,
- responsive behavior,
- reverse behavior,
- fallback when disabled.

If a plugin cannot be tied to a clear responsibility, remove it from the central experience architecture.
