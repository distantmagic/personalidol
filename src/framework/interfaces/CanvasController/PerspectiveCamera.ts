import * as THREE from "three";

import CanvasController from "src/framework/interfaces/CanvasController";
import EventListenerSet from "src/framework/interfaces/EventListenerSet";

export default interface PerspectiveCamera extends CanvasController {
  readonly camera: THREE.PerspectiveCamera;
  readonly onFrustumChange: EventListenerSet<[THREE.Frustum]>;
  readonly onZoomChange: EventListenerSet<[number]>;

  decreaseZoom(step: number, min: number): void;

  getCamera(): THREE.PerspectiveCamera;

  getZoom(): number;

  increaseZoom(step: number, max: number): void;

  lookAtFromDistance(position: THREE.Vector3, distance: number): void;

  setZoom(zoom: number): void;
}
