export type Shot = {
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  subject: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  };
};

export const shots: Record<'arrival' | 'material' | 'portal' | 'interior', Shot> = {
  arrival: {
    camera: { position: [0, 0.25, 5.8], target: [0, 0, 0], fov: 34 },
    subject: { position: [0.55, -0.1, 0], rotation: [0.08, -0.55, 0], scale: 1 },
  },
  material: {
    camera: { position: [-0.4, 0.35, 4.4], target: [0.1, 0, 0], fov: 36 },
    subject: { position: [0.15, -0.05, 0], rotation: [0.05, -0.2, 0], scale: 0.95 },
  },
  portal: {
    camera: { position: [0, 0.05, 2.25], target: [0, 0, 0], fov: 29 },
    subject: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1.3 },
  },
  interior: {
    camera: { position: [0, 0, 0.55], target: [0, 0, -3], fov: 46 },
    subject: { position: [0, 0, -2], rotation: [0, 0, 0], scale: 1 },
  },
};

export const experienceDirection = {
  scrollVh: 10,
  labels: {
    arrivalStart: 0,
    materialStart: 1,
    portalStart: 2,
    interiorStart: 3,
    end: 4,
  },
  pointerStrength: {
    arrival: 0.035,
    material: 0.05,
    critical: 0.008,
    interior: 0.02,
  },
  mobile: {
    portalScale: 1.55,
    pointerMultiplier: 0,
  },
};
