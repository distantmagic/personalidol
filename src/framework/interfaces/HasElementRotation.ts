import { ElementRotation } from "src/framework/interfaces/ElementRotation";
import { ElementRotationUnit } from "src/framework/types/ElementRotationUnit";

export interface HasElementRotation<T extends ElementRotationUnit> {
  getElementRotation(): ElementRotation<T>;
}
