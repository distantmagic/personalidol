import { Vector3 } from "three/src/math/Vector3";

import type { Vector3 as IVector3 } from "three";

export function getCenterOfMass(points: ReadonlyArray<IVector3>): IVector3 {
  if (points.length < 2) {
    throw new Error("Can't get center of mass of less than two points.");
  }

  const acc = new Vector3(0, 0, 0);

  for (let i = 0; i < points.length; i += 1) {
    acc.add(points[i]);
  }

  return acc.divideScalar(points.length);
}
