import * as THREE from "three";

import CanvasView from "src/framework/interfaces/CanvasView";

export default interface MD2Character extends CanvasView {
  setAnimationIdle(): void;

  setAnimationRunning(): void;

  setVelocity(direction: THREE.Vector3): void;

  setRotationY(rotationRadians: number): void;
}
