import ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

import EquatableWithPrecision from "src/framework/interfaces/EquatableWithPrecision";

export default interface ElementRotation<Unit extends ElementRotationUnit> extends EquatableWithPrecision<ElementRotation<Unit>> {
  getRotationX(): number;

  getRotationY(): number;

  getRotationZ(): number;
}
