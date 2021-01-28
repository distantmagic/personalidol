import type { Object3D } from "three/src/core/Object3D";

import type { CSS2DObject } from "./CSS2DObject.interface";

export function isCSS2DObject(object: Object3D): object is CSS2DObject {
  return true === (object as CSS2DObject).isCSS2DObject;
}
