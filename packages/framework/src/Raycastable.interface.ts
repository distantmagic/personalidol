import type { Object3D } from "three/src/core/Object3D";

import type { RaycastableState } from "./RaycastableState.type";

export interface Raycastable {
  readonly isRaycastable: true;
  readonly object3D: Object3D;
  readonly state: RaycastableState;
}
