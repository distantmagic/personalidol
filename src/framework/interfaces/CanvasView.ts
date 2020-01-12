import * as THREE from "three";

import { Animatable } from "src/framework/interfaces/Animatable";
import { CanvasPointerEventHandler } from "src/framework/interfaces/CanvasPointerEventHandler";
import { Disposable } from "src/framework/interfaces/Disposable";

export interface CanvasView extends Animatable, CanvasPointerEventHandler, Disposable {
  getChildren(): THREE.Group;

  isInFrustum(frustum: THREE.Frustum): boolean;

  useSettings(): boolean;
}
