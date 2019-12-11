// @flow

import * as THREE from "three";

import type { Vector3 } from "three";

export default function three2quake(v: Vector3): Vector3 {
  return new THREE.Vector3(v.z, v.x, v.y);
}
