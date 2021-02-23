import { DimensionsIndices } from "@personalidol/framework/src/DimensionsIndices.enum";

import { updateCameraAspect } from "./updateCameraAspect";

import type { Camera } from "three";

const _cameraLastUpdate: WeakMap<Camera, number> = new WeakMap();

export function updateStoreCameraAspect(camera: Camera, dimensionsState: Uint32Array): void {
  const cameraLastUpdate = _cameraLastUpdate.get(camera);
  const dimensionsLastUpdate = dimensionsState[DimensionsIndices.LAST_UPDATE];

  if (!cameraLastUpdate || dimensionsLastUpdate > cameraLastUpdate) {
    updateCameraAspect(camera, dimensionsState);
    _cameraLastUpdate.set(camera, dimensionsLastUpdate);
  }
}
