import { Camera, Raycaster, Scene, WebGLRenderer } from "three";

import { Animatable } from "./Animatable";
import { Observer } from "./Observer";
import { Resizeable } from "./Resizeable";

export interface THREEPointerInteraction extends Animatable, Observer, Resizeable<"px"> {
  getCameraRaycaster(): Raycaster;
}
