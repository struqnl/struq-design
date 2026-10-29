export type ViewportClass = 'desktop' | 'tablet' | 'mobile';
export type PerformanceTier = 'high' | 'balanced' | 'safe';

export type ExperienceRuntime = {
  globalProgress: number;
  activeChapter: 'arrival' | 'material' | 'interior';
  chapterProgress: number;
  activeHandoff: string | null;
  elapsedTime: number;
  deltaTime: number;
  scrollVelocity: number;
  scrollDirection: -1 | 0 | 1;
  pointer: {
    x: number;
    y: number;
    speed: number;
  };
  channels: {
    pointerCameraStrength: number;
    narrativeDistortion: number;
    velocityDistortion: number;
    interiorReveal: number;
  };
  viewport: ViewportClass;
  reducedMotion: boolean;
  performanceTier: PerformanceTier;
};

export const runtime: ExperienceRuntime = {
  globalProgress: 0,
  activeChapter: 'arrival',
  chapterProgress: 0,
  activeHandoff: null,
  elapsedTime: 0,
  deltaTime: 0,
  scrollVelocity: 0,
  scrollDirection: 0,
  pointer: { x: 0, y: 0, speed: 0 },
  channels: {
    pointerCameraStrength: 0.035,
    narrativeDistortion: 0,
    velocityDistortion: 0,
    interiorReveal: 0,
  },
  viewport: 'desktop',
  reducedMotion: false,
  performanceTier: 'balanced',
};

export function updateViewportClass(width: number): void {
  runtime.viewport = width < 768 ? 'mobile' : width < 1100 ? 'tablet' : 'desktop';
}
