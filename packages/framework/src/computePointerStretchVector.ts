import type { Vector2 } from "three/src/math/Vector2";

export function computePointerStretchVector(
  target: Vector2,
  initialClientX: number,
  currentClientX: number,
  initialClientY: number,
  currentClientY: number,
  spread: number = 200
): void {
  const xDiff: number = currentClientX - initialClientX;
  const yDiff: number = currentClientY - initialClientY;

  target.x = (xDiff / spread) * 2;
  target.y = ((-1 * yDiff) / spread) * 2;
  target.clampLength(0, 1);
}
