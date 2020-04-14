import type * as THREE from "three";

import type AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import type CameraFrustumResponder from "src/framework/interfaces/CameraFrustumResponder";
import type CanvasPointerEventHandler from "src/framework/interfaces/CanvasPointerEventHandler";
import type Disposable from "src/framework/interfaces/Disposable";
import type HasPosition from "src/framework/interfaces/HasPosition";
import type PhysicsController from "src/framework/interfaces/PhysicsController";

export default interface CanvasView extends AnimatableUpdatable, CameraFrustumResponder, CanvasPointerEventHandler, Disposable, HasPosition, PhysicsController {
  computeBoundingBox(): void;

  computeBoundingSphere(): void;

  getChildren(): THREE.Group;

  getName(): string;

  hasBoundingBox(): boolean;

  hasBoundingSphere(): boolean;

  useCameraFrustum(): boolean;

  usePhysics(): boolean;
}
