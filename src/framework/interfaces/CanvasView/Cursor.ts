import * as THREE from "three";

import CanvasView from "src/framework/interfaces/CanvasView";

export default interface Cursor extends CanvasView {
  setPointerDown(): void;

  setPointerUp(): void;

  setPosition(position: THREE.Vector3): void;
}
