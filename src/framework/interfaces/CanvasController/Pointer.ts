import type * as THREE from "three";

import type CanvasController from "src/framework/interfaces/CanvasController";

export default interface Pointer extends CanvasController {
  getPointerVector(): THREE.Vector2;
}
