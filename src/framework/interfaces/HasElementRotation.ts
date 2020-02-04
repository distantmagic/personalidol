import ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

import ElementRotation from "src/framework/interfaces/ElementRotation";

export default interface HasElementRotation<T extends ElementRotationUnit> {
  getElementRotation(): ElementRotation<T>;
}
