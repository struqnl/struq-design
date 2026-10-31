// components/struq/scenes/dots.ts (Struq recipe)
// A field of points seen at a low angle, rolling like a slow swell. The pointer raises a soft
// hill where it is, the crests catch the accent, and scrolling lowers the field away.
// Suits: mobility, logistics, technology, sport, energy, data: anything about movement or scale.
import { NOISE_GLSL, type CreateScene } from "./types";

export const createScene: CreateScene = async ({ THREE, renderer, palette }) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 5.5, 13);
  camera.lookAt(0, 0, -2);
  renderer.setClearColor(new THREE.Color(palette.surface), 1);

  const cols = 150;
  const rows = 80;
  const positions = new Float32Array(cols * rows * 3);
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions[i++] = (c / (cols - 1) - 0.5) * 40;
      positions[i++] = 0;
      positions[i++] = (r / (rows - 1) - 0.5) * 26 - 4;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
    uDpr: { value: renderer.getPixelRatio() },
    uInk: { value: new THREE.Color(palette.ink) },
    uAccent: { value: new THREE.Color(palette.accent) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      uniform float uTime; uniform vec2 uPointer; uniform float uScroll; uniform float uDpr;
      varying float vH; varying float vFade;
      ${NOISE_GLSL}
      void main() {
        vec3 p = position;
        float h = fbm(p.xz * 0.11 + vec2(uTime * 0.045, uTime * 0.03));
        vec2 hill = p.xz - vec2(uPointer.x * 14.0, -uPointer.y * 9.0 - 3.0);
        h += exp(-dot(hill, hill) * 0.035) * 0.55;
        p.y += h * 2.4 - 1.0 - uScroll * 2.5;
        vH = h;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vFade = smoothstep(40.0, 12.0, -mv.z);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uDpr * 26.0 / -mv.z;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uInk; uniform vec3 uAccent;
      varying float vH; varying float vFade;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.32, d);
        vec3 col = mix(uInk, uAccent, smoothstep(0.62, 0.95, vH));
        gl_FragColor = vec4(col, a * vFade * (0.28 + 0.6 * vH));
        #include <colorspace_fragment>
      }
    `,
  });

  scene.add(new THREE.Points(geometry, material));

  return {
    scene,
    camera,
    update(state) {
      uniforms.uTime.value = state.time;
      uniforms.uPointer.value.set(state.pointer.x, state.pointer.y);
      uniforms.uScroll.value = state.scroll;
    },
    resize(width, height) {
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      uniforms.uDpr.value = renderer.getPixelRatio();
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
};
