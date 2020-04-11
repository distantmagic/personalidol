import type * as THREE from "three";

import type CanvasView from "src/framework/interfaces/CanvasView";

export default interface MD2Character extends CanvasView {
  setAnimationIdle(): void;

  setAnimationRunning(): void;

  setVelocity(direction: THREE.Vector3): void;
}
