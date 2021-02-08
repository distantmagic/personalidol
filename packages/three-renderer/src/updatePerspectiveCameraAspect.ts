import { DimensionsIndices } from "@personalidol/framework/src/DimensionsIndices.enum";

import type { PerspectiveCamera } from "three";

export function updatePerspectiveCameraAspect(camera: PerspectiveCamera, dimensionsState: Uint32Array): void {
  const aspect = dimensionsState[DimensionsIndices.D_WIDTH] / dimensionsState[DimensionsIndices.D_HEIGHT];

  if (camera.aspect === aspect) {
    return;
  }

  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
