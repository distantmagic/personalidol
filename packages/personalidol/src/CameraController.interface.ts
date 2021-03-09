import type { OrthographicCamera } from "three/src/cameras/OrthographicCamera";
import type { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import type { Vector3 } from "three/src/math/Vector3";

import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";

import type { CameraControllerState } from "./CameraControllerState.type";

export interface CameraController extends Mountable, Pauseable {
  readonly camera: OrthographicCamera | PerspectiveCamera;
  readonly position: Vector3;
  readonly state: CameraControllerState;

  needsImmediateMove: boolean;
}
