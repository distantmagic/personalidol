import { ElementRotation } from "./ElementRotation";
import { ElementRotationUnit } from "../types/ElementRotationUnit";

export interface HasElementRotation<T extends ElementRotationUnit> {
  getElementRotation(): ElementRotation<T>;
}
