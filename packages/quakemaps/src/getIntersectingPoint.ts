import { Matrix3 } from "three/src/math/Matrix3";
import { Vector3 } from "three/src/math/Vector3";

import { marshalCoords } from "./marshalCoords";

import type { Vector3 as IVector3 } from "three";

import type { HalfSpace } from "./HalfSpace.type";
import type { IntersectingPointsCache } from "./IntersectingPointsCache.type";

const detMatrix = new Matrix3();
const xMatrix = new Matrix3();
const yMatrix = new Matrix3();
const zMatrix = new Matrix3();

function getIntersectionDeterminant(hs1: HalfSpace, hs2: HalfSpace, hs3: HalfSpace): number {
  detMatrix.set(
    hs1.plane.normal.x,
    hs1.plane.normal.y,
    hs1.plane.normal.z,
    hs2.plane.normal.x,
    hs2.plane.normal.y,
    hs2.plane.normal.z,
    hs3.plane.normal.x,
    hs3.plane.normal.y,
    hs3.plane.normal.z
  );

  return detMatrix.determinant();
}

export function getIntersectingPoint(hs1: HalfSpace, hs2: HalfSpace, hs3: HalfSpace, pointsCache: IntersectingPointsCache): null | IVector3 {
  const det = getIntersectionDeterminant(hs1, hs2, hs3);

  if (det === 0) {
    return null;
  }

  // prettier-ignore
  xMatrix.set(
    hs1.plane.constant, hs1.plane.normal.y, hs1.plane.normal.z,
    hs2.plane.constant, hs2.plane.normal.y, hs2.plane.normal.z,
    hs3.plane.constant, hs3.plane.normal.y, hs3.plane.normal.z
  );
  // prettier-ignore
  yMatrix.set(
    hs1.plane.normal.x, hs1.plane.constant, hs1.plane.normal.z,
    hs2.plane.normal.x, hs2.plane.constant, hs2.plane.normal.z,
    hs3.plane.normal.x, hs3.plane.constant, hs3.plane.normal.z
  );
  // prettier-ignore
  zMatrix.set(
    hs1.plane.normal.x, hs1.plane.normal.y, hs1.plane.constant,
    hs2.plane.normal.x, hs2.plane.normal.y, hs2.plane.constant,
    hs3.plane.normal.x, hs3.plane.normal.y, hs3.plane.constant
  );

  const x = Math.round((-1 * xMatrix.determinant()) / det);
  const y = Math.round((-1 * yMatrix.determinant()) / det);
  const z = Math.round((-1 * zMatrix.determinant()) / det);
  const marshaled = marshalCoords(x, y, z);

  if (pointsCache.hasOwnProperty(marshaled)) {
    return pointsCache[marshaled];
  }

  const vector = new Vector3(x, y, z);

  pointsCache[marshaled] = vector;

  return vector;
}
