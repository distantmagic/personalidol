import type { Camera } from "three/src/cameras/Camera";
import type { Scene } from "three/src/scenes/Scene";

import type { ResizeableRenderer } from "@personalidol/three-modules/src/ResizeableRenderer.interface";

export interface CSS2DRenderer extends ResizeableRenderer {
  render(scene: Scene, camera: Camera, updateMatrices: boolean): void;
}
