import * as THREE from "three";

import CanvasView from "src/framework/interfaces/CanvasView";

export default interface Cursor extends CanvasView {
  setPosition(position: THREE.Vector3): void;
}
