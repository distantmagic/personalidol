import type { Object3D } from "three/src/core/Object3D";

import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";
import type { Raycastable } from "@personalidol/input/src/Raycastable.interface";

import type { ViewState } from "./ViewState.type";

export interface View extends Mountable, Pauseable, Raycastable {
  readonly isView: true;
  readonly object3D: Object3D;
  readonly state: ViewState;
}
