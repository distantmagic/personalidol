import * as THREE from "three";

import CanvasController from "src/framework/interfaces/CanvasController";
import EventListenerSet from "src/framework/interfaces/EventListenerSet";

export default interface Camera extends CanvasController {
  readonly onFrustumChange: EventListenerSet<[THREE.Frustum]>;
  readonly onZoomChange: EventListenerSet<[number]>;

  getCamera(): THREE.Camera;

  getCameraFrustum(): THREE.Frustum;

  getZoom(): number;

  decreaseZoom(): void;

  increaseZoom(): void;

  lookAt(position: THREE.Vector3): void;

  setZoom(zoom: number): void;
}
