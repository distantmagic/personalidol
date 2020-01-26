import * as THREE from "three";

import CanvasController from "src/framework/interfaces/CanvasController";
import ControllableDelegate from "src/framework/interfaces/ControllableDelegate";
import ControlToken from "src/framework/interfaces/ControlToken";

export default interface Camera extends CanvasController, ControllableDelegate {
  getCamera(): THREE.OrthographicCamera;

  getCameraFrustum(): THREE.Frustum;

  decreaseZoom(controlToken: ControlToken): void;

  increaseZoom(controlToken: ControlToken): void;

  lookAt(controlToken: ControlToken, position: THREE.Vector3): void;

  setZoom(controlToken: ControlToken, zoom: number): void;
}
