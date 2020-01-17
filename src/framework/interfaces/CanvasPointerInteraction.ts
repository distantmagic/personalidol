import * as THREE from "three";

import AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import Observer from "src/framework/interfaces/Observer";
import Resizeable from "src/framework/interfaces/Resizeable";

export default interface CanvasPointerInteraction extends AnimatableUpdatable, Observer, Resizeable<"px"> {
  getCameraRaycaster(): THREE.Raycaster;
}
