import { DimensionsIndices } from "./DimensionsIndices.enum";

import type { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";

export function updatePerspectiveCameraAspect(dimensionsState: Uint32Array, camera: PerspectiveCamera): void {
  const aspect = dimensionsState[DimensionsIndices.D_WIDTH] / dimensionsState[DimensionsIndices.D_HEIGHT];

  if (camera.aspect === aspect) {
    return;
  }

  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
