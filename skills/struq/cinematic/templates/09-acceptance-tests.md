# Experience Acceptance Tests

## Narrative and continuity

- [ ] The experience can be described as one coherent transformation.
- [ ] Every chapter performs a distinct narrative action.
- [ ] Every boundary has a visible or conceptual bridge.
- [ ] Shared end and start states match.
- [ ] No transition relies solely on hiding a jump with opacity.

## Timeline and ownership

- [ ] Every important property has one authoritative writer.
- [ ] Chapter and handoff timelines are separated.
- [ ] Semantic labels coordinate DOM and WebGL.
- [ ] Reverse scrub reconstructs valid states.
- [ ] Critical intervals attenuate reactive effects.

## Camera and composition

- [ ] Every chapter has named key shots.
- [ ] Camera position and target are authored together.
- [ ] Holds provide comprehension and reading time.
- [ ] Mobile shots preserve the intended focal hierarchy.
- [ ] FOV and focus changes are deliberate.

## Interaction

- [ ] Scroll owns macro progression.
- [ ] Pointer and hover remain additive.
- [ ] Touch has equivalent behavior.
- [ ] Keyboard navigation is available where required.
- [ ] Gesture modes provide a clear exit.

## Responsive and reduced motion

- [ ] Desktop, tablet, and mobile choreography are tested.
- [ ] Reduced motion preserves story and visibility.
- [ ] Transition covers work at all aspect ratios.
- [ ] Typography re-splits or rebuilds safely.

## Performance

- [ ] Target frame-rate behavior is documented.
- [ ] DPR and effects scale by tier.
- [ ] Next-chapter assets are ready before the handoff.
- [ ] No recurring allocations or React state updates occur in the frame loop.
- [ ] Transparent overdraw and render targets are controlled.

## Lifecycle

- [ ] ScrollTriggers are killed on unmount.
- [ ] GSAP ticker callbacks are removed.
- [ ] Lenis state is restored.
- [ ] Event listeners are removed.
- [ ] custom WebGL resources are disposed.
- [ ] route back/forward behavior is valid.
