import ElementRotation from "src/framework/interfaces/ElementRotation";

import ElementRotationUnit from "src/framework/types/ElementRotationUnit";

export default interface HasElementRotation<T extends ElementRotationUnit> {
  getElementRotation(): ElementRotation<T>;
}
