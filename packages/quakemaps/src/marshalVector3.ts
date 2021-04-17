import { marshalCoords } from "./marshalCoords";

import type { Vector3Simple } from "./Vector3Simple.type";

export function marshalVector3(vector: Vector3Simple): string {
  return marshalCoords(vector.x, vector.y, vector.z);
}
