# Vite Adapter

## Create and install

```bash
npm create vite@latest cinematic-experience -- --template react-ts
cd cinematic-experience
npm install
npm install gsap @gsap/react lenis three @react-three/fiber @react-three/drei motion
```

Copy `cinematic/examples/code/shared` to `src/experience`, then use the adapter files in this folder.

Vite does not require a Next.js client boundary, but the same cleanup, target readiness, ownership, and responsive rules apply.
