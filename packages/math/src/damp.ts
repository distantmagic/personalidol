import { lerp } from "./lerp";

function doDamp(x: number, y: number, lambda: number, dt: number): number {
  return lerp(x, y, 1 - Math.exp(-lambda * dt));
}

export function damp(x: number, y: number, lambda: number, dt: number): number {
  if (x === y) {
    return x;
  }

  return doDamp(x, y, lambda, dt);
}
