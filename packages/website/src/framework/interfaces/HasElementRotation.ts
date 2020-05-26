import type ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

import type ElementRotation from "src/framework/interfaces/ElementRotation";

export default interface HasElementRotation<T extends ElementRotationUnit> {
  getElementRotation(): ElementRotation<T>;
}
