import { Vector3 } from "three/src/math/Vector3";

import { UnmarshalException } from "./UnmarshalException";

import type { Vector3 as IVector3 } from "three";

export function sanitizeVector3(filename: string, lineno: number, inputX: string, inputY: string, inputZ: string): IVector3 {
  const x = Number(inputX);
  const y = Number(inputY);
  const z = Number(inputZ);

  if (isNaN(x) || isNaN(y) || isNaN(y)) {
    throw new UnmarshalException(filename, lineno, "Point consists of invalid numbers.");
  }

  // .map files use different coordinates system than THREE, Oimo, etc
  // XYZ -> YZX
  return new Vector3(y, z, x);
}
