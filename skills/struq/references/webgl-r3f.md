# WebGL / R3F: the integration recipe (per-project add-on)

Three.js is NOT pre-installed in this stack. It is ~150kB+ of JS that most
sites don't need, so it is added per project, only when a section genuinely
calls for it (shader hero backdrop, distorted-image hover, particle field,
product 3D). This file is self-contained: the *wiring* recipe for how a
`<Canvas>` island coexists with the Lenis + GSAP single-RAF setup without
fighting it, plus a minimal scene pattern (§3b) that completes the island.

This integration recipe is the foundation for everything 3D in Struq. Build on
it, don't replace it. [webgl-scenes.md](webgl-scenes.md) covers what goes
inside the canvas: Drei helpers, postprocessing, interactive pointer-driven
scenes, and performance tiers. For multi-chapter directed experiences where
the whole page behaves as one continuous 3D film, see
[../cinematic/README.md](../cinematic/README.md).

```bash
npm i three @react-three/fiber @react-three/drei
npm i -D @types/three
```

Budget rule: **one canvas per page.** Multiple WebGL contexts multiply GPU
memory and lose hardware acceleration arbitration. If two sections need 3D,
render both scenes through one canvas (drei `<View>`) or cut one.

---

## 1. The canonical island (lazy, SSR-free, poster-fallback)

WebGL must never be in the initial JS bundle or the SSR tree. The island is a
client component loaded with `next/dynamic` + `ssr: false`, sitting on top of a
poster so the page is complete without it. Two rules carry the whole pattern:

- **The parent section always renders the poster**, server-side, as a real
  `next/image` (`fill`, `preload`). It is the LCP candidate and the permanent
  fallback, not a loading state.
- **The parent decides whether WebGL loads at all.** The gate (reduced motion,
  coarse pointer) runs in the parent *before* the dynamic import is rendered,
  so gated users never download three.js. A gate inside the lazy chunk is too
  late: by then the chunk is already on the wire.

```tsx
// components/sections/HeroScene.tsx: the SECTION owns the poster, the gate and the lazy boundary
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

// The canvas chunk is requested only when <SceneCanvas /> is rendered, which
// happens only after the gate passes. No loading UI: the poster is already there.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

// ONE gate string. If this section also pins or scrubs, its gsap.matchMedia uses the same
// constant, so the canvas and the pin can never disagree (webgl-scenes.md §4, product-rig).
// Policy per project: skip touch entirely (default, below), or allow it with a lower dpr.
export const GATE = "(prefers-reduced-motion: no-preference) and (pointer: fine)";

export function HeroScene() {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(GATE);
    const sync = () => setWebgl(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Always rendered: the design without WebGL, and the LCP image with it.
          `preload` or `priority`, whichever the installed next/image declares (setup.md §0). */}
      <Image src="/media/hero-poster.webp" alt="" fill preload sizes="100vw"
             className="object-cover" />
      {webgl && <SceneCanvas />}
      <div className="relative z-10 section-shell">{/* content */}</div>
    </section>
  );
}
```

The lazy chunk is now only the canvas; it never re-checks the gate:

```tsx
// components/sections/SceneCanvas.tsx
"use client";

import { Canvas } from "@react-three/fiber";

export default function SceneCanvas() {
  return (
    <Canvas
      aria-hidden                            // decoration: the real copy lives in the DOM
      className="absolute inset-0"
      frameloop="never"                      // driven by the GSAP ticker, §2
      dpr={[1, 1.75]}                        // clamp: retina tax caps at 1.75
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      {/* scene content, minimal pattern in §3b */}
    </Canvas>
  );
}
```

- `dpr={[1, 1.75]}`: full devicePixelRatio on a 3× phone triples the pixel
  budget for zero perceived gain. On mobile, drop to `[1, 1.5]`.
- `antialias: false` + post-process or MSAA-off is fine for soft/abstract
  scenes; turn it on only for hard-edged geometry.
- R3F handles resize observation itself, so do NOT wire your own resize → ticker
  loops.

---

## 2. One clock: drive R3F from the GSAP ticker

The whole baseline runs on a single RAF (Lenis is driven by `gsap.ticker`). An
R3F canvas with default `frameloop="always"` starts a SECOND RAF; the two
sample on different frames and scroll-tied scenes micro-stutter. It is the same
disease as Lenis + GSAP unsynced, in a new vector. `frameloop="never"` + a
ticker bridge restores one clock:

```tsx
// Inside the Canvas tree:
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

function GsapTickerDriver() {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    const tick = (time: number) => advance(time); // gsap gives seconds; consistent
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance]);
  return null;
}
// <Canvas frameloop="never"> … <GsapTickerDriver /> … </Canvas>
```

**One driver per canvas.** This is the minimal driver. When the scene comes from
webgl-scenes.md, use the `TickerDriver` in [webgl-scenes.md](webgl-scenes.md) §0 instead:
it is this driver plus an offscreen pause, and it **replaces** `GsapTickerDriver`. Never
mount both in one canvas, or every frame advances twice.

Cheaper variant for scenes that only change with scroll or pointer (most hero
backdrops): `frameloop="demand"` and call `invalidate()` from the things that
change it, so no frames are rendered while the user is idle:

```tsx
const invalidate = useThree((s) => s.invalidate);
// in a ScrollTrigger onUpdate, pointermove handler, or uniform setter:
invalidate();
```

Decision rule: continuously animated scene (particles drifting, shader time
uniform) → `never` + ticker driver. Reactive-only scene → `demand` +
`invalidate()`. Never ship `always`.

---

## 3. Scroll-linking a scene (uniforms, not React state)

Bind scroll to the scene exactly like any other scrub target: one ScrollTrigger
writes into a mutable ref / uniform. **Never `setState` per scroll frame.** A
React render per frame kills both clocks.

```tsx
function ScrollBoundRig() {
  const progress = useRef(0);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#hero",            // the DOM section the canvas lives in
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress; // mutate, don't render
        invalidate();                      // demand-mode: request one frame
      },
    });
    return () => st.kill();
  }, [invalidate]);

  useFrame(({ camera }) => {
    camera.position.z = 5 - progress.current * 2; // read in the frame loop
  });
  return null;
}
```

The same pattern feeds shader uniforms (`material.uniforms.uProgress.value =
self.progress`). Lenis needs no special handling: ScrollTrigger is already
synced to it by the provider, and the scene inherits the smoothing for free,
which is exactly what makes scroll-bound WebGL feel expensive.

---

## 3b. A minimal scene (completing the island)

The canonical section-backdrop scene is a full-frame shader plane with two
uniforms, `uTime` (ambient life) and `uProgress` (scroll), not a floating
mesh. It reacts to the page instead of performing at it:

```tsx
// Inside <Canvas>, alongside ONE driver (GsapTickerDriver, or webgl-scenes.md's TickerDriver) and ScrollBoundRig
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function BackdropPlane({ progress }: { progress: React.RefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
  }), []);

  useFrame((_, delta) => {
    mat.current!.uniforms.uTime.value += delta;
    mat.current!.uniforms.uProgress.value = progress.current ?? 0;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={/* glsl */ `
          varying vec2 vUv; uniform float uTime; uniform float uProgress;
          void main() {
            float wave = sin(vUv.x * 6.0 + uTime * 0.4) * 0.04 * (1.0 - uProgress);
            vec3 a = vec3(0.04, 0.04, 0.045), b = vec3(0.10, 0.10, 0.11); // surface-0 → surface-1 world
            gl_FragColor = vec4(mix(a, b, vUv.y + wave), 1.0);
          }`}
      />
    </mesh>
  );
}
```

- `scale={[viewport.width, viewport.height, 1]}` fills the camera frustum.
  The plane IS the backdrop, no layout math.
- The fragment shader is the design surface: keep its palette inside the
  page's token world (tonal ramp of the surfaces, never a foreign gradient).
- `uTime` movement stays subtle and damped by `uProgress`. The "nothing moves
  the user didn't cause" doctrine ([feel-layer.md](feel-layer.md) §5) applies
  to shaders too.

---

## 4. Performance & accessibility floor

- The canvas section must hold 60fps with CPU 4× throttle alongside the page's
  other scrub work; if it can't, cut scene cost before cutting page motion.
- Reduced motion = poster. Not "slower scene": no scene.
- Touch/mobile = project decision, but the default is poster or `dpr [1, 1.5]`
  with halved particle/segment counts. Battery is a design constraint.
- The page must be 100% complete without WebGL: real poster, real content,
  no layout shift when the canvas pops in (absolute-fill behind content).
- `aria-hidden` on the canvas wrapper; it is decoration, never content.

**Cheap tell:** a spinning torus-knot/blob over a gradient, `frameloop="always"`,
shipped in the main bundle, white flash before context creation, dead on mobile.
**Instead:** A scene that reacts to scroll/pointer through the one synced clock, behind a
lazy boundary, with a poster path so good you could ship it alone.
