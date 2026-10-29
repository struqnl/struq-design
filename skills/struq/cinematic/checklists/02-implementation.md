# Implementation Checklist

- [ ] GSAP plugins are registered once in the correct client context.
- [ ] Lenis and ScrollTrigger use one documented integration path.
- [ ] The persistent stage and semantic scroll regions are separated.
- [ ] Runtime state avoids per-frame React updates.
- [ ] Timeline targets use refs or a registry rather than global selectors.
- [ ] Camera, subject, and effects use explicit rigs or channels.
- [ ] One complete chapter and handoff work before expansion.
- [ ] Chapter timelines use semantic labels.
- [ ] Shared state matches at ownership transfer.
- [ ] Reverse scroll is tested continuously.
- [ ] Interaction is gated during critical intervals.
- [ ] Direction values are centralized.
- [ ] A debug HUD and scrubber exist.
- [ ] Resize and font/model readiness trigger controlled rebuilds.
- [ ] Route unmount kills timelines, triggers, callbacks, and listeners.
