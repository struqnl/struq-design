# Hero scenes: the WebGL layer behind the hero

Every Struq marketing site carries a WebGL layer in its hero. `components/struq/HeroCanvas.tsx` owns everything that makes such a layer safe in production; a scene owns only what it draws.

| HeroCanvas owns | The scene owns |
|---|---|
| Loading three.js in its own chunk after first paint | Its `THREE.Scene` and camera |
| The poster (the photo, or the flat surface) and the fade-in after the first frame | Its geometry, material and uniforms |
| The DPR cap (1.75, phones 1.5) and a 2.4 million pixel budget | Reading the palette it is given |
| Pausing offscreen and in a hidden tab | `update(state)`: time, pointer, scroll, velocity into uniforms |
| One composed still frame under `prefers-reduced-motion` and on phones | `resize(w, h)`, an optional multi-pass `render(renderer)`, `dispose()` |
| The quiet zones: up to four `[data-quiet]` rects behind the copy, in device pixels | Calling `hush(v, gl_FragCoord.xy)` on its intensity |
| The pointer's `presence`, easing in on move and out on rest | Using it as a gentle modulation only |
| Running on `gsap.ticker`, the page's one clock | |
| Keeping the poster when WebGL or the scene fails | |

## The three shipped scenes

| Scene | Looks like | Needs | Suits |
|---|---|---|---|
| `contours` | contour lines drifting like a slow survey map, every sixth in the accent | nothing | architecture, studios, consultancy, nature, research |
| `ripple` | the hero photo as a liquid surface, rippling under the pointer, pushing in on scroll | `image` | hospitality, food, hotels, fashion, wellness |
| `dots` | a field of points rolling like a swell, a hill under the pointer | nothing | mobility, logistics, technology, sport, energy |

Props: `scene`, `image` (poster, and the texture for ripple), `grade` (0 to 1, how far ripple pulls the photo into the palette), `scrim` (0 to 0.6, a flat black layer for type in `text-on-photo`), `priority` (the poster is the LCP image).

## The craft bar

What separates a high-end ambient hero from a screensaver, and what every shipped scene does:

- **Clean:** fine marks (hairlines, small dots) on a flat ground, antialiased with `fwidth`, and where marks crowd closer than the screen can draw, they fade into a mist instead of moire.
- **Deep:** a perspective field (a horizon just above the top edge or in the upper third), marks compressing and thinning toward it, a fog toward the far side.
- **Calm behind the copy:** `hush` holds the field under a soft ceiling behind every `data-quiet` element, so the copy reads at 4.5:1 and the field still runs on behind it.
- **Composed:** the field is weighted to the right or the vanishing point sits on the right third; the left, where the headline sits, is the quiet side.
- **Slow:** the ambient clock is 0.02 to 0.06 of real time. The pointer only modulates (a soft lift, a ripple) and only while it is present.
- **Cheap:** noise runs once per field cell into a small target, never per screen pixel, where the look allows (`contours` shows the two-pass pattern).

## Writing a scene (or porting the MCP background)

A scene is one file in `components/struq/scenes/` that exports `createScene`:

```ts
// components/struq/scenes/<name>.ts
import { NOISE_GLSL, QUIET_GLSL, quietUniforms, type CreateScene } from "./types";

export const createScene: CreateScene = async ({ THREE, renderer, palette, image, grade, dark }) => {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quiet = quietUniforms(THREE, dark ? 0.08 : 0.12);
  const uniforms = {
    ...quiet.uniforms,
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2() },
    uScroll: { value: 0 },
    uSurface: { value: new THREE.Color(palette.surface) },
    uInk: { value: new THREE.Color(palette.ink) },
    uAccent: { value: new THREE.Color(palette.accent) },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      uniform float uTime; uniform vec2 uRes; uniform vec2 uPointer; uniform float uScroll;
      uniform vec3 uSurface; uniform vec3 uInk; uniform vec3 uAccent;
      varying vec2 vUv;
      ${NOISE_GLSL}
      ${QUIET_GLSL}
      void main() {
        float v = 0.0; // ... the look's intensity, from noise per cell where you can
        v = hush(v, gl_FragCoord.xy);
        vec3 col = mix(uSurface, uInk, v); // the three palette colours only
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));
  return {
    scene,
    camera,
    update(s) { uniforms.uTime.value = s.time; uniforms.uPointer.value.set(s.pointer.x, s.pointer.y); uniforms.uScroll.value = s.scroll; quiet.update(s); },
    resize(w, h) { uniforms.uRes.value.set(w, h); },
    dispose() { geometry.dispose(); material.dispose(); },
  };
};
```

Then register it in `HeroCanvas.tsx`:

```ts
const SCENES = {
  contours: () => import("./scenes/contours"),
  ripple: () => import("./scenes/ripple"),
  dots: () => import("./scenes/dots"),
  "<name>": () => import("./scenes/<name>"),
};
```

**The MCP background (`struq_achtergrond`).** It returns a background family with its shader or scene description and its parameters. Port it into this contract: its shader becomes the fragment shader, its colour inputs become `uSurface`, `uInk` and `uAccent` built from `palette` (that is the recolour: the site's tokens, never the colours in the MCP sample), its animation reads `uTime`, and its pointer or scroll inputs read `uPointer` and `uScroll`. Build it even when you cannot watch it: if it fails to compile, HeroCanvas logs the error and keeps the poster, so the hero is never empty. Check the browser console when you do have a browser.

## Rules that keep it fast

- Colours are linear inside the shader; end every fragment shader with `#include <colorspace_fragment>` and set `texture.colorSpace = THREE.SRGBColorSpace` on photo textures, or the palette renders too dark.
- One full-screen pass, at most five noise octaves, no loops over pixels. Points: up to about 15,000.
- One HeroCanvas per page. A second canvas further down is a deliberate WebGL moment ([webgl-r3f.md](webgl-r3f.md)), not a reflex.
- Never a glossy 3D blob, a purple glow or a mesh-gradient wash: the scene works in the palette's neutrals with the accent as a thread.
