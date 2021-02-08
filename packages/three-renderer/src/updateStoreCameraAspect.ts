import { DimensionsIndices } from "@personalidol/framework/src/DimensionsIndices.enum";

import { updateCameraAspect } from "./updateCameraAspect";

import type { Camera } from "three";

const _DIMENSIONS_LAST_UPDATE = Symbol("_DIMENSIONS_LAST_UPDATE");

export function updateStoreCameraAspect(camera: Camera, dimensionsState: Uint32Array): void {
  const cameraUserData: any = camera.userData as any;
  const dimensionsLastUpdate = dimensionsState[DimensionsIndices.LAST_UPDATE];

  if (!cameraUserData.hasOwnProperty(_DIMENSIONS_LAST_UPDATE) || dimensionsLastUpdate > cameraUserData[_DIMENSIONS_LAST_UPDATE]) {
    updateCameraAspect(camera, dimensionsState);
    cameraUserData[_DIMENSIONS_LAST_UPDATE] = dimensionsLastUpdate;
  }
}
