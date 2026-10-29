# Camera and Composition Shot Presets

## Shot schema

```ts
type ShotPreset = {
  id: string;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
    roll: number;
  };
  focus?: {
    distance: number;
    aperture: number;
  };
  subject?: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number | [number, number, number];
  };
  exposure?: number;
  composition: string;
  safeArea: string;
};
```

## Presets

### `shot-name`

**Purpose:**

**Camera position:** `[x, y, z]`

**Target:** `[x, y, z]`

**FOV:**

**Roll:**

**Focus distance:**

**Aperture:**

**Subject transform:**

**Exposure:**

**Composition:**

**Typography safe area:**

**Desktop notes:**

**Mobile variant:**

**Transition compatibility:**
