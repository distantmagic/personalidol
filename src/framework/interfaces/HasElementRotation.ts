// @flow strict

import type { ElementRotation } from "./ElementRotation";
import type { ElementRotationUnit } from "../types/ElementRotationUnit";

export interface HasElementRotation<T: ElementRotationUnit> {
  getElementRotation(): ElementRotation<T>;
}
