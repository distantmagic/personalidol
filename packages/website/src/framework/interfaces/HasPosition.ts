import type * as THREE from "three";

export default interface HasPosition {
  getPosition(): THREE.Vector3;
}
