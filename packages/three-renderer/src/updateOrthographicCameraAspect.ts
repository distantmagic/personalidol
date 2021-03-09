import { DimensionsIndices } from "@personalidol/framework/src/DimensionsIndices.enum";

import type { OrthographicCamera } from "three/src/cameras/OrthographicCamera";

export function updateOrthographicCameraAspect(dimensionsState: Uint32Array, camera: OrthographicCamera, frustumSize: number): void {
  const aspect = dimensionsState[DimensionsIndices.D_WIDTH] / dimensionsState[DimensionsIndices.D_HEIGHT];

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;

  camera.updateProjectionMatrix();
}
