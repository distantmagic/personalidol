// @flow

import ElementRotation from "../classes/ElementRotation";

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementRotation as ElementRotationInterface } from "../interfaces/ElementRotation";

function partialTheta(sx: number, sy: number, ex: number, ey: number): number {
  const dy = ey - sy;
  const dx = ex - sx;

  // range (-PI, PI]
  return Math.atan2(dy, dx);
}

export function deg2radians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function theta<T: ElementPositionUnit>(
  p1: ElementPosition<T>,
  p2: ElementPosition<T>
): ElementRotationInterface<"radians"> {
  return new ElementRotation<"radians">(
    partialTheta(p1.getZ(), p1.getY(), p2.getZ(), p2.getY()),
    partialTheta(p1.getZ(), p1.getX(), p2.getZ(), p2.getX()),
    partialTheta(p1.getX(), p1.getY(), p2.getX(), p2.getY())
  );
}
