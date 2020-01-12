import * as THREE from "three";

import { Animatable } from "./Animatable";
import { Observer } from "./Observer";
import { Resizeable } from "./Resizeable";

export interface THREEPointerInteraction extends Animatable, Observer, Resizeable<"px"> {
  getCameraRaycaster(): THREE.Raycaster;
}
