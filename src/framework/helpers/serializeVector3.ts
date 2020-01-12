import * as THREE from "three";

export default function serializeVector3(vector: THREE.Vector3): string {
  return JSON.stringify(vector.toArray());
}
