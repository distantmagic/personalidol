import type { Material } from "three/src/materials/Material";

export function isMaterial(item: any): item is Material {
  return true === (item as Material).isMaterial;
}
