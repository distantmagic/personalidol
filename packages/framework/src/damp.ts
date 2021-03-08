import { MathUtils } from "three/src/math/MathUtils";

export function damp(x: number, y: number, lambda: number, dt: number): number {
  if (x === y) {
    return x;
  }

  return MathUtils.damp(x, y, lambda, dt);
}
