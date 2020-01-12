import * as THREE from "three";

import { Animatable } from "src/framework/interfaces/Animatable";
import { Observer } from "src/framework/interfaces/Observer";
import { Resizeable } from "src/framework/interfaces/Resizeable";

export interface THREEPointerInteraction extends Animatable, Observer, Resizeable<"px"> {
  getCameraRaycaster(): THREE.Raycaster;
}
