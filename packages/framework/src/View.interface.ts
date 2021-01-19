import type { Euler } from "three/src/math/Euler";
import type { Vector3 } from "three/src/math/Vector3";

import type { Mountable } from "./Mountable.interface";

export interface View extends Mountable {
  readonly isScene: false;
  readonly isView: true;
  readonly needsUpdates: boolean;
  readonly viewPosition: Vector3;
  readonly viewRotation: Euler;
}
