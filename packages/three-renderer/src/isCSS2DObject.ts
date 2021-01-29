import type { Object3D } from "three/src/core/Object3D";

import type { CSS2DObject } from "./CSS2DObject.interface";

export function isCSS2DObject(object: Object3D): object is CSS2DObject {
  return "CSS2DObject" === object.type;
}
