import * as THREE from "three";

import CanvasController from "src/framework/interfaces/CanvasController";

export default interface Pointer extends CanvasController {
  getPointerVector(): THREE.Vector2;
}
