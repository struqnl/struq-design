export function damp(
  current: number,
  target: number,
  lambda: number,
  deltaTime: number,
): number {
  return target + (current - target) * Math.exp(-lambda * deltaTime);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
