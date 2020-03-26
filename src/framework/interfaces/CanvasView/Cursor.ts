import type * as THREE from "three";

import type CanvasView from "src/framework/interfaces/CanvasView";

export default interface Cursor extends CanvasView {
  setPosition(position: THREE.Vector3): void;

  setVisible(isVisible: boolean): void;
}
