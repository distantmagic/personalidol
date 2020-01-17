import EquatableWithPrecision from "src/framework/interfaces/EquatableWithPrecision";

import ElementRotationUnit from "src/framework/types/ElementRotationUnit";

export default interface ElementRotation<Unit extends ElementRotationUnit> extends EquatableWithPrecision<ElementRotation<Unit>> {
  getRotationX(): number;

  getRotationY(): number;

  getRotationZ(): number;
}
