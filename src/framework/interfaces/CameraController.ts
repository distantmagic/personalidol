import * as THREE from "three";

import { CanvasController } from "src/framework/interfaces/CanvasController";

export interface CameraController extends CanvasController {
  getCameraFrustum(): THREE.Frustum;

  setZoom(zoom: number): void;
}
