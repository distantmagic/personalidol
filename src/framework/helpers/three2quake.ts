import * as THREE from "three";

export default function three2quake(v: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(v.z, v.x, v.y);
}
