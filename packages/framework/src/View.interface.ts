import type { Object3D } from "three/src/core/Object3D";

import type { Mountable } from "./Mountable.interface";

export interface View extends Mountable {
  readonly isScene: false;
  readonly isView: true;
  readonly needsUpdates: boolean;
  readonly object3D: Object3D;
}
