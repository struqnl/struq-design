# Next.js Adapter

## Install

```bash
npm install gsap @gsap/react lenis three @react-three/fiber @react-three/drei motion
```

Copy `cinematic/examples/code/shared` to `src/experience`.

Then use the files in this folder as the App Router adapter. The main experience component is a client component because it uses browser APIs, animation lifecycles, and WebGL.

Verify GSAP plugin imports against your installed version. Keep semantic content available outside the canvas, and add a WebGL fallback appropriate to the actual project.
