import type * as THREE from "three";

import type CanvasController from "src/framework/interfaces/CanvasController";
import type EventListenerSet from "src/framework/interfaces/EventListenerSet";
import type HasPosition from "src/framework/interfaces/HasPosition";

export default interface PerspectiveCamera extends CanvasController {
  readonly camera: THREE.PerspectiveCamera;
  readonly onFrustumChange: EventListenerSet<[THREE.Frustum]>;
  readonly onZoomChange: EventListenerSet<[number]>;

  decreaseZoom(step: number, min: number): void;

  follow(hasPosition: HasPosition): void;

  getCamera(): THREE.PerspectiveCamera;

  getZoom(): number;

  increaseZoom(step: number, max: number): void;

  lookAtFromDistance(position: THREE.Vector3, distance: number): void;

  setZoom(zoom: number): void;

  unfollow(hasPosition: HasPosition): void;
}
