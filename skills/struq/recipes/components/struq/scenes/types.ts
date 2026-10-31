// components/struq/scenes/types.ts (Struq recipe)
// The contract every hero scene follows. HeroCanvas owns the renderer, the clock, the pointer,
// the pause and the poster; a scene owns only its scene graph and its uniforms.
import type * as THREE_NS from "three";

export type Palette = {
  /** CSS colour strings read from :root: hex or rgb(). */
  surface: string;
  surface2: string;
  ink: string;
  accent: string;
};

export type SceneState = {
  /** Seconds on gsap.ticker. */
  time: number;
  /** Smoothed pointer, -1 to 1 on both axes, y up. */
  pointer: { x: number; y: number };
  /** 0 to 1: how far the hero has scrolled out of view. */
  scroll: number;
  /** 0 to 1: recent pointer speed, decays on its own. */
  velocity: number;
};

export type SceneInput = {
  THREE: typeof THREE_NS;
  renderer: THREE_NS.WebGLRenderer;
  palette: Palette;
  image?: { src: string; width: number; height: number };
  grade: number;
};

export type HeroScene = {
  scene: THREE_NS.Scene;
  camera: THREE_NS.Camera;
  update(state: SceneState): void;
  resize(width: number, height: number): void;
  dispose(): void;
};

export type CreateScene = (input: SceneInput) => Promise<HeroScene>;

/** Shared GLSL: hash, value noise and fbm. Cheap enough for a full-screen pass on a phone. */
export const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
    return v;
  }
`;
