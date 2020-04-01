import type * as THREE from "three";

import type AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import type CameraFrustumResponder from "src/framework/interfaces/CameraFrustumResponder";
import type CanvasPointerEventHandler from "src/framework/interfaces/CanvasPointerEventHandler";
import type Disposable from "src/framework/interfaces/Disposable";

export default interface CanvasView extends AnimatableUpdatable, CameraFrustumResponder, CanvasPointerEventHandler, Disposable {
  attachCamera(camera: THREE.Camera): void;

  computeBoundingBox(): void;

  detachCamera(camera: THREE.Camera): void;

  getBoundingBox(): THREE.Box3;

  getChildren(): THREE.Group;

  getInstanceId(): string;

  getPosition(): THREE.Vector3;

  getName(): string;

  useCameraFrustum(): boolean;

  usePhysics(): boolean;
}
