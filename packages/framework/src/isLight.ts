import type { Light } from "three/src/lights/Light";
import type { Object3D } from "three/src/core/Object3D";

export function isLight(item: Object3D): item is Light {
  return true === (item as Light).isLight;
}
