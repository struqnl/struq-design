// components/struq/scenes/contours.ts (Struq recipe)
// Drifting contour lines, like a survey map of a slow landscape: hairlines in the ink, every
// sixth line in the accent, on the page surface with a fine grain. The pointer bends the field
// and scrolling lifts it. Quiet enough to sit behind a display headline. Needs no photo.
// Suits: architecture, studios, consultancies, nature, research, anything calm and precise.
import { NOISE_GLSL, type CreateScene } from "./types";

export const createScene: CreateScene = async ({ THREE, palette }) => {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
    uSurface: { value: new THREE.Color(palette.surface) },
    uInk: { value: new THREE.Color(palette.ink) },
    uAccent: { value: new THREE.Color(palette.accent) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec2 uRes; uniform vec2 uPointer; uniform float uScroll;
      uniform vec3 uSurface; uniform vec3 uInk; uniform vec3 uAccent;
      varying vec2 vUv;
      ${NOISE_GLSL}
      void main() {
        vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.4;
        float t = uTime * 0.035;
        vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
        vec2 bend = (uPointer * vec2(uRes.x / uRes.y, 1.0) * 1.2 - p);
        float pull = exp(-dot(bend, bend) * 0.9) * 0.35;
        float h = fbm(p + 1.4 * q + vec2(0.0, uScroll * 0.8)) + pull;
        float bands = 16.0;
        float f = fract(h * bands);
        float w = fwidth(h * bands);
        float line = 1.0 - smoothstep(0.0, w * 1.6, min(f, 1.0 - f));
        float major = step(5.5, mod(floor(h * bands + 0.5), 6.0));
        vec3 col = uSurface;
        col = mix(col, uInk, line * 0.22 * (1.0 - major));
        col = mix(col, uAccent, line * 0.7 * major);
        col += (hash(vUv * uRes + fract(uTime * 7.0)) - 0.5) * 0.03;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));

  return {
    scene,
    camera,
    update(state) {
      uniforms.uTime.value = state.time;
      uniforms.uPointer.value.set(state.pointer.x, state.pointer.y);
      uniforms.uScroll.value = state.scroll;
    },
    resize(width, height) {
      uniforms.uRes.value.set(width, height);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
};
