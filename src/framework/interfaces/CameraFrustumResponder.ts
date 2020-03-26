import type * as THREE from "three";

export default interface CameraFrustumResponder {
  isInCameraFrustum(): boolean;

  isInFrustum(frustum: THREE.Frustum): boolean;

  setIsInCameraFrustum(isInCameraFrustum: boolean): void;
}
