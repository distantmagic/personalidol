// @flow

import type { Vector3 } from "three";

export default function vector3(vector: Vector3): string {
  return JSON.stringify(vector.toArray());
}
