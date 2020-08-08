import { marshalCoords } from "./marshalCoords";

import type { Vector3 } from "three";

export function marshalVector3(vector: Vector3): string {
  return marshalCoords(vector.x, vector.y, vector.z);
}
