import { sortPointsCounterClockwise } from "./sortPointsCounterClockwise";

import type { Vector3 } from "three";

import type { TriangleSimple } from "./TriangleSimple.type";

export function* triangulateFacePoints(
  faceNormal: Vector3,
  pointsInput: ReadonlyArray<Vector3>
): Generator<TriangleSimple> {
  if (pointsInput.length < 3) {
    throw new Error(`Can't triangulate 2, 1 or 0 points. Got ${pointsInput.length} points.`);
  }

  const points = sortPointsCounterClockwise(faceNormal, pointsInput);

  for (let i = 0; i < points.length - 2; i += 1) {
    yield [points[0], points[i + 1], points[i + 2]] as TriangleSimple;
  }
}
