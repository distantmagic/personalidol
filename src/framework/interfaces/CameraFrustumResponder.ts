import type * as THREE from "three";

import type Disposable from "src/framework/interfaces/Disposable";

export default interface CameraFrustumResponder extends Disposable {
  isInCameraFrustum(): boolean;

  isInFrustum(frustum: THREE.Frustum): boolean;

  setIsInCameraFrustum(isInCameraFrustum: boolean): void;
}
