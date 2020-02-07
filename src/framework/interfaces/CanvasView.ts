import * as THREE from "three";

import Animatable from "src/framework/interfaces/Animatable";
import CameraFrustumResponder from "src/framework/interfaces/CameraFrustumResponder";
import CanvasPointerEventHandler from "src/framework/interfaces/CanvasPointerEventHandler";
import Disposable from "src/framework/interfaces/Disposable";

export default interface CanvasView extends Animatable, CameraFrustumResponder, CanvasPointerEventHandler, Disposable {
  getChildren(): THREE.Group;

  getName(): string;

  useCameraFrustum(): boolean;
}
