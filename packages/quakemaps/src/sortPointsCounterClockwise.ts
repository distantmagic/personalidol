import { Vector3 } from "three/src/math/Vector3";

import { getCenterOfMass } from "./getCenterOfMass";

import type { Vector3 as IVector3 } from "three";

const _ca = new Vector3();
const _cb = new Vector3();
const _caXcb = new Vector3();

// https://stackoverflow.com/a/14371081/1011156
export function sortPointsCounterClockwise(normal: IVector3, points: ReadonlyArray<IVector3>): Array<IVector3> {
  // You have the center C and the normal n.
  const c = getCenterOfMass(points);

  return Array.from(points).sort(function (a: IVector3, b: IVector3) {
    _ca.set(a.x - c.x, a.y - c.y, a.z - c.z);
    _cb.set(b.x - c.x, b.y - c.y, b.z - c.z);

    // To determine whether point B is clockwise or counterclockwise from
    // point A, calculate dot(n, cross(A-C, B-C)).
    _caXcb.crossVectors(_ca, _cb);

    // If the result is positive, B is counterclockwise from A;
    if (normal.dot(_caXcb) > 0) {
      return -1;
    }

    // B is either clockwise from A or points are colinear. If points are
    // colinear, they are both clockwise and counterclockwise in relation to
    // each other. We just arbitrarily decide that B is clockwise then.
    return 1;
  });
}
