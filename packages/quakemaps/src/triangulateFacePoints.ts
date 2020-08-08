import type { Vector3 } from "three";

import { sortPointsCounterClockwise } from "./sortPointsCounterClockwise";

type YieldType = [Vector3, Vector3, Vector3];

export function* triangulateFacePoints(faceNormal: Vector3, pointsInput: ReadonlyArray<Vector3>): Generator<YieldType> {
  if (pointsInput.length < 3) {
    throw new Error("Can't triangulate 2, 1 or 0 points");
  }

  const points = sortPointsCounterClockwise(faceNormal, pointsInput);

  for (let i = 0; i < points.length - 2; i += 1) {
    yield [points[0], points[i + 1], points[i + 2]] as YieldType;
  }
}
