import * as THREE from "three";
import { Vector3 } from "three";

export default function quake2three(v: Vector3): Vector3 {
  return new THREE.Vector3(v.y, v.z, v.x);
}
