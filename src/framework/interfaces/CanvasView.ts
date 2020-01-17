import * as THREE from "three";

import Animatable from "src/framework/interfaces/Animatable";
import CanvasPointerEventHandler from "src/framework/interfaces/CanvasPointerEventHandler";
import Disposable from "src/framework/interfaces/Disposable";

export default interface CanvasView extends Animatable, CanvasPointerEventHandler, Disposable {
  getChildren(): THREE.Group;

  getName(): string;

  isInFrustum(frustum: THREE.Frustum): boolean;
}
