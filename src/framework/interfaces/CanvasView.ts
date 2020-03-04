import * as THREE from "three";

import AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import CameraFrustumResponder from "src/framework/interfaces/CameraFrustumResponder";
import CanvasPointerEventHandler from "src/framework/interfaces/CanvasPointerEventHandler";
import Disposable from "src/framework/interfaces/Disposable";

export default interface CanvasView extends AnimatableUpdatable, CameraFrustumResponder, CanvasPointerEventHandler, Disposable {
  attachCamera(camera: THREE.Camera): void;

  computeBoundingBox(): void;

  detachCamera(camera: THREE.Camera): void;

  getBoundingBox(): THREE.Box3;

  getChildren(): THREE.Group;

  getPosition(): THREE.Vector3;

  getName(): string;

  useCameraFrustum(): boolean;
}
