# Shared Architecture Example

Copy this folder to `src/experience` inside either the Next.js or Vite example.

This code demonstrates:

- one persistent stage,
- one mutable runtime for high-frequency signals,
- a named target registry,
- camera and subject rig separation,
- GSAP chapter and handoff timelines,
- ScrollTrigger mapping,
- Lenis integration in the framework adapters,
- the single clock: Lenis (`autoRaf: false`) and the R3F canvas (`frameloop="never"`, advanced by `GsapFrameLoop`) both run from `gsap.ticker`,
- Motion used only for local interface behavior,
- centralized direction values.

It is intentionally visually plain. The point is to prove orchestration and ownership before adding production assets, shaders, post-processing, or detailed styling.

Verify plugin imports against the GSAP version installed in the project. The examples use the modern `motion/react` import path documented by Motion for React.
