import type { Mesh } from "three/src/objects/Mesh";
import type { Object3D } from "three/src/core/Object3D";

export function isMesh(item: Object3D): item is Mesh {
  return true === (item as Mesh).isMesh;
}
