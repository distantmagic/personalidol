import { updatePerspectiveCameraAspect } from "./updatePerspectiveCameraAspect";

import type { Camera, PerspectiveCamera } from "three";

export function updateCameraAspect(camera: Camera, dimensionsState: Uint16Array): void {
  if ("PerspectiveCamera" === camera.type) {
    return void updatePerspectiveCameraAspect(camera as PerspectiveCamera, dimensionsState);
  }

  throw new Error(`Unsupported camera type: "${camera.type}"`);
}
