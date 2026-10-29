# WebGL Scenes: Drei, postprocessing and interactive 3D

**Read [webgl-r3f.md](webgl-r3f.md) first.** It owns the integration and this file never contradicts it: a lazy, SSR-free island behind a real poster; one canvas per page; `frameloop="never"` driven by `gsap.ticker` (or `"demand"` plus `invalidate()` for reactive-only scenes); scroll written into refs and uniforms, never React state. This file is what goes **inside** that canvas: Drei helpers, the postprocessing stack, the four 3D recipes from [showcase.md](showcase.md), performance tiers and the tells.

For a whole page that behaves as one continuous 3D film, switch to Directed mode: [../cinematic/README.md](../cinematic/README.md).

```bash
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing
npm i -D @types/three
```

`postprocessing` is listed explicitly because the samples import `BlendFunction` and `ToneMappingMode` from it.

## 0. The architecture every recipe shares

**The DOM side owns time and scroll; the canvas side only reads.** The section component creates every ScrollTrigger inside `useGSAP` (scoped, reduced-motion aware, cleaned up on unmount) and writes plain numbers into refs. The scene reads those refs in `useFrame`. Nothing crosses the boundary as React state.

```tsx
// components/three/shared.ts
"use client";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { gsap } from "@/lib/gsap";

export type Box<T> = { current: T };

/** webgl-r3f.md §2 driver, plus an offscreen pause: no frames while the section is out of view.
 *  Replaces webgl-r3f.md's GsapTickerDriver; never mount both. */
export function TickerDriver({ active }: { active: Box<boolean> }) {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    const tick = (time: number) => { if (active.current) advance(time); };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance, active]);
  return null;
}
```

```tsx
// the section side, used by every recipe below
const outer = useRef<HTMLElement>(null);   // <section ref={outer}>: never pinned, so it holds the pin-spacer
const wrap = useRef<HTMLDivElement>(null); // <div ref={wrap}> inside it: the element a recipe may pin
const active = useRef(false);
const progress = useRef(0);

useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    ScrollTrigger.create({
      trigger: outer.current,
      start: "top bottom",
      end: "bottom top",
      refreshPriority: -1,                                         // measure after any pin in the section
      onToggle: (self) => { active.current = self.isActive; },   // offscreen pause
      onUpdate: (self) => { progress.current = self.progress; }, // scroll into a ref
    });
  });
}, { scope: outer });

// the island, inside the section (lazy, behind the poster: webgl-r3f.md §1)
<Canvas frameloop="never" dpr={dpr} gl={{ alpha: true }}>
  <TickerDriver active={active} />
  {/* the recipe's scene */}
</Canvas>
```

- **Every canvas** in this file is `frameloop="never"` with exactly one `<TickerDriver active={active} />` inside it. `AmbientHero` (§4) mounts its own, so its canvas does not add another.
- **Why the outer trigger.** When a recipe pins `wrap` (product-rig), ScrollTrigger wraps it in a pin-spacer as tall as the pin. A trigger on `wrap` itself is measured against the unpinned box and toggles `active` off halfway through the pin, freezing the scene mid-shot. The `outer` section contains the spacer, so its trigger spans the whole pinned distance; `refreshPriority: -1` makes it refresh after the pin has added its spacing.

When the driver resumes after a pause, the first `delta` covers the whole time away. Clamp it in any damping code: `const dt = Math.min(delta, 1 / 30)`.

**Many Drei helpers animate in `useFrame`** (`Float`, `MeshTransmissionMaterial`'s temporal distortion, `ContactShadows` unless baked, `PerformanceMonitor`). They need frames, so a scene that uses them runs `frameloop="never"` with the driver. A purely scroll-reactive scene without them can use `"demand"` and `invalidate()` from `onUpdate`.

## 1. Drei on a marketing site

| Helper | Use it for | Notes |
|---|---|---|
| `Environment` | Image-based lighting: believable reflections on metal, glass, satin | `preset="studio"` (also `city`, `warehouse`, `sunset`, `dawn`, `night`, `forest`, `apartment`, `lobby`, `park`) fetches an HDR from a CDN at runtime; in production self-host it: `files="/hdr/studio.hdr"`. `background` shows it; leave it off and let the page surface be the background. |
| `Lightformer` | Art-directed reflections: soft rectangles and rings you place like studio softboxes | Children of `<Environment>`; props `form` (`"rect"`, `"circle"`, `"ring"`), `intensity`, `color`, plus position, rotation, scale. Controlled highlights are what make a product look shot rather than rendered. |
| `Float` | A slow ambient drift on a subject | `speed`, `rotationIntensity`, `floatIntensity`, `floatingRange`. Keep them low (speed 1, intensities 0.2 to 0.5): it is breath, not bobbing. |
| `MeshTransmissionMaterial` | Glass, crystal, liquid | `thickness`, `roughness`, `ior`, `chromaticAberration`, `distortion`, `distortionScale`, `temporalDistortion`, `samples`, `resolution`, `backside`. It renders the scene again into a buffer every frame (twice with `backside`), so it is high tier only: `samples` 4 to 6, `resolution` 512 to 1024. |
| `MeshDistortMaterial` | A surface that wobbles | `distort`, `speed`. This is the floating-blob material: only with a reason, low `distort`, never purple. |
| `Text` | 3D type that has to live in the scene (on a surface, in depth) | `font` takes a URL to the display face file (`.ttf` or `.woff`), plus `fontSize`, `anchorX`, `anchorY`, `letterSpacing`, `lineHeight`, `maxWidth`, `color`. Decoration only: the same words exist in the DOM (§6). |
| `useGLTF` | Loading a model | `useGLTF(url)` has Draco and meshopt on by default (signature `useGLTF(url, useDraco = true, useMeshopt = true)`). The Draco decoder is fetched from gstatic only when a file is actually Draco-compressed; a meshopt or plain GLB never touches it. Self-host the decoder once, at module level in the island: `useGLTF.setDecoderPath("/draco/")` (copy `node_modules/three/examples/jsm/libs/draco/gltf/` to `public/draco/`). `useGLTF.preload(url)` buys nothing inside the lazy island (it runs only when the island chunk loads), and importing drei into the section to call it earlier pulls three into the page bundle; the poster covers the wait ([performance.md](performance.md) §5). |
| `ContactShadows` | A soft grounding shadow under a subject | `opacity`, `scale`, `blur`, `far`, `resolution`, `color`, `frames`. `frames={1}` bakes it once: free afterwards, but only while the subject's height, scale and tilt never change. If a shot lifts, scales or tilts the subject, drop `frames` on high tier (a live shadow) and keep those values constant on mid. |
| `Center` | Centring a model whose origin is wrong | Wrap the model. Cheaper than fixing every export. |
| `Bounds` | Fitting the camera to a model of unknown size | `fit`, `clip`, `observe`, `margin`. It moves the camera, so never combine it with a scroll or shot-driven camera. Good for a static product view; the named shots (§3) replace it otherwise. |
| `View` | Several small scenes through one canvas, each tracking a DOM box | Keeps the one-canvas budget when two sections need 3D. Mount one `<View.Port />` inside a single fixed `<Canvas eventSource={...}>`. Every view still costs a render: two or three, not twelve. |
| `PerformanceMonitor` | Live tiering | `onDecline`, `onIncline`, `onChange` (with a `factor` 0 to 1), `onFallback`, `flipflops`. Drives the tier in §5. Setting state here is fine: it fires a handful of times, not per frame. |
| `AdaptiveDpr` | Dropping resolution during regressions | Works only when something calls R3F's `performance.regress()` and the canvas sets `performance={{ min: 0.5 }}`. On a marketing scene that is rarely true; prefer `PerformanceMonitor` setting `dpr` directly. |
| `Preload` | Uploading textures and compiling shaders before first view | `<Preload all />` inside the canvas. Removes the hitch the first time a hidden object appears. |

### Why not `ScrollControls`

Drei's `ScrollControls` creates its own scroll container over the canvas with its own damping. On a Struq page that is a second scroll source fighting Lenis (double smoothing, two velocities), ScrollTrigger stops seeing the scroll it was built for, and its HTML layer moves real content into a container search engines and screen readers handle badly. The page already has one scroll and one clock: ScrollTrigger reads Lenis, writes refs, the scene reads refs (§0). Use that.

## 2. Postprocessing, with restraint

```tsx
// components/three/Grade.tsx
import { EffectComposer, Noise, Vignette, ChromaticAberration, ToneMapping } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import * as THREE from "three";

export function Grade({ tier, caOffset }: { tier: "high" | "mid"; caOffset: THREE.Vector2 }) {
  return (
    <EffectComposer multisampling={tier === "high" ? 4 : 0}>
      {/* Only when the subject has emissive parts (rule below); add Bloom to the import:
          <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.6} /> */}
      <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
      <Vignette offset={0.3} darkness={0.55} />
      {tier === "high" ? <ChromaticAberration offset={caOffset} radialModulation modulationOffset={0.3} /> : <></>}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
```

**The restraint rule:**

- **Default stack: grain and vignette.** `Noise` at 0.03 to 0.05 opacity with an overlay blend ties the 3D to the photographic grade of the page ([imagery.md](imagery.md)); `Vignette` focuses the frame. That is the whole look most of the time.
- **`Bloom` only with emissive subjects.** `luminanceThreshold` around 0.9, `luminanceSmoothing` 0.1 to 0.3, `intensity` 0.4 to 1, `mipmapBlur`. Bloom on a non-emissive scene washes everything into a haze; bloom on everything is the 2019 crypto look.
- **`ChromaticAberration`: tiny, and tied to scroll velocity.** At rest the offset is zero. Pass a memoised `THREE.Vector2` as `offset` and mutate it from velocity in `useFrame` (§3, product-rig); a static offset is just blur on the edges.
- **`DepthOfField`** (`focusDistance`, `focalLength`, `bokehScale`) is expensive and fights text legibility. Use it for one macro shot, never as an always-on look.
- **`ToneMapping` last.** With a composer, put the tone-mapping pass at the end so the grade is applied once. If colours look washed out or double-graded, compare with `<Canvas flat>` (no renderer tone mapping) and keep only one.
- **Composer off on low tier.** Every pass is a full-screen draw. Below high tier, drop CA; on low tier, no composer at all, the scene renders straight.

## 3. Shots and scroll

Never scatter raw camera numbers across `useFrame` calls. Name the poses, then let one scrubbed GSAP timeline move a plain object between them; the scene copies that object into transforms each frame. Directed mode formalises this as shot presets ([../cinematic/README.md](../cinematic/README.md)); on a site with one 3D section, three or four named shots are enough.

```ts
// components/three/shots.ts
// y, s and rotX stay constant so the baked ContactShadows (frames={1}) stays true;
// the camera dolly (camZ) and the turn (rotY) carry the shots.
export const SHOTS = {
  intro:  { rotY: -0.5, rotX: 0.1, y: 0, s: 1, camZ: 6.0 },
  side:   { rotY: 1.2,  rotX: 0.1, y: 0, s: 1, camZ: 5.2 },
  detail: { rotY: 2.4,  rotX: 0.1, y: 0, s: 1, camZ: 4.0 },
} as const;
export type Shot = { rotY: number; rotX: number; y: number; s: number; camZ: number };
```

GSAP tweens plain objects, so the timeline writes numbers and the scene never re-renders.

## 4. Recipes

### `product-rig`: scroll turns it, the pointer tilts it

The rule that makes it feel solid: **the scroll writer and the pointer writer never share a transform.** If both write `rotation.y`, the last write wins each frame and the object jitters between two opinions. Nest them: the outer group belongs to scroll, the inner group to the pointer, the model sits inside both.

```tsx
// components/three/ProductRig.tsx (inside the Canvas)
"use client";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Box } from "./shared";
import type { Shot } from "./shots";

const damp = THREE.MathUtils.damp;

export function ProductRig({ rig, velocity, caOffset, tilt }: {
  rig: Box<Shot>;            // written by the section's scrubbed timeline
  velocity: Box<number>;     // ScrollTrigger getVelocity(), px/s
  caOffset: THREE.Vector2;   // the vector passed to ChromaticAberration
  tilt: boolean;             // false on touch: scroll only
}) {
  const scrollGroup = useRef<THREE.Group>(null);
  const pointerGroup = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { scene } = useGLTF("/models/product.glb");

  useEffect(() => {
    if (!tilt) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [tilt]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const s = rig.current, g = scrollGroup.current!, p = pointerGroup.current!;
    // scroll writer: outer group and camera only
    g.rotation.set(s.rotX, s.rotY, 0);
    g.position.y = s.y;
    g.scale.setScalar(s.s);
    state.camera.position.z = s.camZ;
    // pointer writer: inner group only, damped, small
    p.rotation.y = damp(p.rotation.y, pointer.current.x * 0.25, 4, dt);
    p.rotation.x = damp(p.rotation.x, pointer.current.y * 0.15, 4, dt);
    // velocity into a tiny chromatic aberration, zero at rest
    const target = Math.min(Math.abs(velocity.current) / 4000, 1) * 0.0015;
    caOffset.x = caOffset.y = damp(caOffset.x, target, 6, dt);
  });

  return (
    <>
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} position={[0, 4, -3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[-4, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={[4, 4, 1]} />
      </Environment>
      <group ref={scrollGroup}>
        <group ref={pointerGroup}>
          <Center><primitive object={scene} /></Center>
        </group>
      </group>
      <ContactShadows position={[0, -1.2, 0]} opacity={0.35} blur={2.5} scale={6} far={2} frames={1} />
    </>
  );
}
useGLTF.setDecoderPath("/draco/"); // self-hosted; fetched only if the GLB is Draco-compressed
```

The section side builds the shot timeline and velocity inside the §0 `useGSAP` branch. It pins `wrap`; the `active` trigger stays on `outer` (§0):

```ts
const rig = useRef<Shot>({ ...SHOTS.intro });
const velocity = useRef(0);
// inside mm.add(...), alongside the §0 active trigger:
gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: wrap.current, start: "top top", end: "+=250%", pin: true, scrub: 1,
    onUpdate: (self) => { velocity.current = self.getVelocity(); },
  },
})
  .to(rig.current, { ...SHOTS.side })
  .to(rig.current, { ...SHOTS.detail });
```

- `ContactShadows` with `frames={1}` is baked once, which holds only because every shot keeps `y`, `s` and `rotX` constant: the scroll group turns the product, the camera dollies, the footprint stays put. A shot that lifts, scales or tilts the subject needs a live shadow: drop `frames` on high tier and keep the mid-tier shots flat.
- Pin rules (and `anticipatePin` with smooth scroll): [pinning-scrub.md](pinning-scrub.md).
- Copy for each shot (the feature it shows) is DOM text stepping beside the canvas, not 3D text.
- Touch: `tilt={false}`, shorter pin. Below the performance floor: the poster, which is a render of `SHOTS.intro`.

### `hover-distortion-gallery`: a plane per image, a hover uniform

Real `<img>` elements stay in the DOM for layout, alt text, SEO and the touch fallback. One canvas fills the gallery section; each image gets a plane at the image's exact box; the DOM image fades out once its texture is on screen. With an orthographic camera at `zoom: 1`, one world unit is one CSS pixel, so DOM boxes map straight onto planes.

```tsx
// components/three/DistortGallery.tsx
// inside <Canvas frameloop="never" orthographic flat camera={{ zoom: 1, position: [0, 0, 100] }}>
//   <TickerDriver active={active} /> <Suspense fallback={null}><DistortGallery ... /></Suspense>
"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Box } from "./shared";

export type Slot = { x: number; y: number; w: number; h: number }; // px, relative to the section
export type HoverState = { v: number; mx: number; my: number };    // tweened by the DOM side

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const frag = /* glsl */ `
  uniform sampler2D uTex; uniform vec2 uPlane; uniform vec2 uImage;
  uniform float uHover; uniform vec2 uMouse; uniform float uTime;
  varying vec2 vUv;
  vec2 cover(vec2 uv) {                                    // object-fit: cover
    float rp = uPlane.x / uPlane.y, ri = uImage.x / uImage.y;
    vec2 s = rp > ri ? vec2(1.0, ri / rp) : vec2(rp / ri, 1.0);
    return (uv - 0.5) * s + 0.5;
  }
  void main() {
    vec2 p = (vUv - uMouse) * vec2(uPlane.x / uPlane.y, 1.0);   // aspect-correct distance
    float d = length(p);
    float ripple = sin(d * 26.0 - uTime * 3.0) * 0.01 * uHover * (1.0 - smoothstep(0.0, 0.5, d));
    vec2 uv = cover(vUv + normalize(p + 1e-5) * ripple);
    uv = (uv - 0.5) * (1.0 - 0.04 * uHover) + 0.5;           // slight push-in on hover
    gl_FragColor = texture2D(uTex, uv);
    #include <colorspace_fragment>
  }`;

function Plane({ url, slot, hover }: { url: string; slot: Slot; hover: HoverState }) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  const size = useThree((s) => s.size);
  const img = tex.image as HTMLImageElement;
  const uniforms = useMemo(() => ({
    uTex: { value: tex }, uTime: { value: 0 }, uHover: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uPlane: { value: new THREE.Vector2(1, 1) },
    uImage: { value: new THREE.Vector2(img.width, img.height) },
  }), [tex, img]);

  useFrame((_, delta) => {
    uniforms.uPlane.value.set(slot.w, slot.h); // mutate; never swap the uniforms object
    uniforms.uTime.value += Math.min(delta, 1 / 30);
    uniforms.uHover.value = hover.v;
    uniforms.uMouse.value.set(hover.mx, hover.my);
  });

  return (
    <mesh position={[slot.x + slot.w / 2 - size.width / 2, size.height / 2 - (slot.y + slot.h / 2), 0]}
          scale={[slot.w, slot.h, 1]}>
      <planeGeometry />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

export function DistortGallery({ urls, slots, hovers, onReady }: {
  urls: string[]; slots: Slot[]; hovers: Box<HoverState[]>; onReady: () => void;
}) {
  const ready = useRef(false);
  useFrame(() => {               // first frame after every texture resolved (Suspense): planes are on screen
    if (ready.current) return;
    ready.current = true;
    onReady();
  });
  return <>{urls.map((u, i) => <Plane key={u} url={u} slot={slots[i]} hover={hovers.current[i]} />)}</>;
}
```

- **Uniforms are bound once.** three uploads the `uniforms` object to the program when the material compiles; a new object from a re-run `useMemo` is never seen by the shader, so the plane would keep its first size. The memo depends only on `[tex, img]`, and size-dependent values (`uPlane`) are mutated in `useFrame`.

The section side:

- Wrap `DistortGallery` in `<Suspense fallback={null}>` inside the canvas. Until textures resolve, the DOM images are what people see. `onReady` fires from the first rendered frame (a ref flag, so once), not from an effect: an effect runs on commit, before anything has been drawn, and the DOM images would fade over an empty canvas. It sets `data-gl-ready` on the section and CSS fades the `<img>` elements to `opacity: 0`.
- **Create the hover states before the canvas mounts,** one per url: `const hovers = useRef<HoverState[]>(urls.map(() => ({ v: 0, mx: 0.5, my: 0.5 })))`. Each `Plane` reads its object by index on first render; an empty array there is an `undefined` hover and a crash in `useFrame`. If `urls` can change, rebuild the array in the same render that changes them.
- Measure slots with one `ResizeObserver` on the section (rects relative to the section's own box). Store them in state: resize is rare, so a React render there is fine.
- Hover handlers on each DOM figure, built with `contextSafe` from `useGSAP`: `gsap.to(hovers.current[i], { v: 1, duration: 0.6, ease: "expo.out" })` on enter, `v: 0` with `power2.out` on leave, and `pointermove` writes `mx` and `my` (0 to 1 within the figure, y flipped). GSAP tweens the plain object; the plane reads it. No state per frame.
- `flat` on the canvas: photographs must not be tone mapped, and `colorspace_fragment` returns the sRGB texture to the screen's colour space untouched.
- Touch and reduced motion: the canvas never mounts (the [webgl-r3f.md](webgl-r3f.md) gate), the DOM images are the gallery. Texture size: 1600px on the long edge is plenty for a grid tile.
- **When not to:** fewer than four strong images, or a gallery that is also the page's showpiece pin. Distortion is a garnish on images worth looking at.

### `particle-field`: a small point field

A few thousand points drifting in a shader, pushed aside by the pointer, stirred by scroll velocity. One breather moment, not a background for the whole site.

```tsx
// components/three/ParticleField.tsx (inside the Canvas)
"use client";
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Box } from "./shared";

export function ParticleField({ count, pointer, velocity }: {
  count: number;                         // 4000 high, 1500 mid; low tier gets the poster
  pointer: Box<{ x: number; y: number }>; // -1 to 1, written by a window listener
  velocity: Box<number>;
}) {
  const dpr = useThree((s) => s.viewport.dpr); // the canvas's real dpr, after tiering
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 10;
      a[i * 3 + 1] = (Math.random() - 0.5) * 6;
      a[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return a;
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uStir: { value: 0 },
    uSize: { value: 2.2 },
    uColor: { value: new THREE.Color("#F2F2F0") },            // ink token of the preset
  }), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const { width, height } = state.viewport;
    uniforms.uTime.value += dt;
    uniforms.uSize.value = 2.2 * dpr;                         // follows PerformanceMonitor's dpr changes
    uniforms.uPointer.value.set(pointer.current.x * width / 2, -pointer.current.y * height / 2);
    uniforms.uStir.value = THREE.MathUtils.damp(uniforms.uStir.value, Math.min(Math.abs(velocity.current) / 3000, 1), 3, dt);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={uniforms}
        vertexShader={/* glsl */ `
          uniform float uTime; uniform vec2 uPointer; uniform float uStir; uniform float uSize;
          void main() {
            vec3 p = position;
            p.y += sin(uTime * 0.2 + p.x * 0.7) * (0.08 + uStir * 0.3);  // slow drift, faster when scrolled
            vec2 away = p.xy - uPointer;
            p.xy += normalize(away + 1e-5) * 0.6 * (1.0 - smoothstep(0.0, 1.2, length(away))); // pointer pushes aside
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = uSize * (4.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(uColor, (1.0 - smoothstep(0.0, 0.5, d)) * 0.6);
            #include <colorspace_fragment>
          }`}
      />
    </points>
  );
}
```

- **Shader rules.** `smoothstep` edges go in ascending order (`edge0 < edge1`); a reversed pair is undefined in GLSL and renders differently per GPU, so a falloff is written `1.0 - smoothstep(0.0, r, d)`. `#include <colorspace_fragment>` after `gl_FragColor` converts the token colour (stored linear by `THREE.Color`) back to sRGB, so the field matches the CSS ink exactly.
- Colour comes from the preset's ink or accent token, at low alpha. A rainbow field is the screensaver tell.
- Touch: half the count and no pointer (pass a zero pointer). Low tier: the poster, which is a still frame of the field.
- **When not to:** behind running text (moving points under copy hurt reading) or anywhere a second WebGL moment already lives.

### `ambient-hero-scene`: one subject, lit, graded

A restrained hero: one object or one field, lit by an environment, with grain and vignette, reacting to scroll. It should look like a photograph that happens to move.

```tsx
// components/three/AmbientHero.tsx (inside <Canvas frameloop="never" dpr={dpr} ...>; it mounts its own TickerDriver)
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Preload } from "@react-three/drei";
import * as THREE from "three";
import { Grade } from "./Grade";
import { TickerDriver, type Box } from "./shared";

const damp = THREE.MathUtils.damp;

export function AmbientHero({ active, progress, velocity, tier, children }: {
  active: Box<boolean>; progress: Box<number>;
  velocity: Box<number>;   // ScrollTrigger getVelocity(), px/s, written by the §0 trigger's onUpdate
  tier: "high" | "mid" | "low"; children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const caOffset = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const p = progress.current;
    state.camera.position.z = 5 + p * 1.5;   // slow pull-out as the hero scrolls away
    group.current!.position.y = p * 0.6;
    // velocity into a tiny chromatic aberration, zero at rest (same as product-rig)
    const target = Math.min(Math.abs(velocity.current) / 4000, 1) * 0.0015;
    caOffset.x = caOffset.y = damp(caOffset.x, target, 6, dt);
  });

  return (
    <>
      <TickerDriver active={active} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={1.6} position={[2, 3, -2]} scale={[6, 1.5, 1]} />
        <Lightformer form="ring" intensity={0.6} position={[-3, -1, 2]} scale={2} />
      </Environment>
      <group ref={group}>
        {tier === "low" ? children : <Float speed={1} rotationIntensity={0.25} floatIntensity={0.3}>{children}</Float>}
      </group>
      {tier !== "low" && <Grade tier={tier} caOffset={caOffset} />}
      <Preload all />
    </>
  );
}
```

- `children` is the subject: the brand's mark extruded, or a GLB through `useGLTF`. Not a torus knot, not a blob.
- The §0 trigger also writes `velocity.current = self.getVelocity()` in its `onUpdate`; without it the CA pass would sit at zero and cost a full-screen draw for nothing. Low tier drops `Float` and the composer: the subject holds still and only scroll moves it.
- The page surface is the background (`alpha: true` on the canvas, no `Environment background`), so the scene sits inside the palette instead of on a foreign gradient.
- Real h1 and copy sit in the DOM above the canvas ([typography.md](typography.md) §5 `line-rise-hero`). The scene supports the headline; it never replaces it.

## 5. Performance tiers and fallbacks

Pick a starting tier before mounting, then let `PerformanceMonitor` move it.

| Tier | Who | dpr | Composer | Scene budget |
|---|---|---|---|---|
| **high** | Fine pointer, 8+ cores | `[1, 1.75]` ([webgl-r3f.md](webgl-r3f.md) default); `[1, 2]` only for a hard-edged product hero | grain, vignette, velocity CA, bloom if emissive | Transmission allowed, 4000 particles, 2048 textures |
| **mid** | Laptops, tablets, decline from high | `[1, 1.5]` | grain and vignette only | No transmission (use `meshPhysicalMaterial`), 1500 particles, 1024 textures |
| **low** | Decline from mid | `1` | none | Static lighting, baked shadows, no `Float` |
| **poster** | Reduced motion, touch by default, `onFallback` | no canvas | n/a | The poster image is the design |

```tsx
// starting guess, in the island's gate effect (webgl-r3f.md §1)
const start = navigator.hardwareConcurrency >= 8 ? "high" : "mid";

// inside <Canvas frameloop="never" dpr={DPR[tier]}>, next to <TickerDriver active={active} />
// const DPR: Record<Tier, number | [number, number]> = { high: [1, 1.75], mid: [1, 1.5], low: 1 };
<PerformanceMonitor
  onDecline={() => setTier((t) => (t === "high" ? "mid" : "low"))}
  onIncline={() => setTier((t) => (t === "low" ? "mid" : t))}
  flipflops={3}
  onFallback={() => setTier("low")}
/>
```

- **Never climb back to high** after a decline: flip-flopping between tiers is more visible than either tier.
- **Poster always.** Same framing as the first frame of the scene, so the canvas fades in over an identical image ([webgl-r3f.md](webgl-r3f.md) §1). It is also the LCP candidate: sized, compressed, preloaded ([seo.md](seo.md) §6).
- **Offscreen pause.** The §0 driver stops advancing when the section leaves the viewport. A canvas rendering below the fold is battery spent on nothing. The trigger lives on the unpinned outer section, so a pin never pauses the scene mid-shot.
- **Textures** at 2048 maximum on desktop, 1024 for mobile variants, WebP through gltf-transform ([performance.md](performance.md) §5). Textures, not triangles, are usually the weight.
- **Mobile.** Default is the poster on touch; when a project opts in, it starts at mid tier with half counts and no pointer writer.
- **Reduced motion is the poster.** Not a slower scene: no scene ([webgl-r3f.md](webgl-r3f.md) §4).

## 6. Real copy stays in the DOM

Text inside a canvas is invisible to search engines, screen readers, translation and text selection. Every word a visitor must read is DOM text, positioned over or beside the canvas; drei `Text` is for decorative 3D type only, and its words also exist in the DOM. The canvas wrapper is `aria-hidden`. Details: [seo.md](seo.md) §6.

## 7. Tells

| Tell | Replace with |
|---|---|
| Spinning torus knot, floating blob or chrome sphere as the hero | One subject that belongs to the brand: its product, its mark, its material |
| `ScrollControls` on a Lenis page | ScrollTrigger into refs (§0) |
| Bloom on a scene with nothing emissive | Grain and vignette |
| Permanent chromatic aberration | CA from scroll velocity, zero at rest |
| `Environment background` with a stock HDR behind the subject | The page surface as background, lightformers for reflections |
| Photos through ACES tone mapping, looking grey | `flat` on image canvases |
| Scroll and pointer writing the same rotation | Nested groups: scroll outside, pointer inside |
| A canvas still rendering two screens below | Offscreen pause |
| Transmission glass on a phone at 20fps | Tiered: physical material on mid, poster on low |
| Headline set in 3D text only | DOM headline; 3D type as decoration |
| A second canvas for a second section | One canvas with `View`, or cut one |
