import type ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

import type EquatableWithPrecision from "src/framework/interfaces/EquatableWithPrecision";

export default interface ElementRotation<Unit extends ElementRotationUnit> extends EquatableWithPrecision<ElementRotation<Unit>> {
  readonly unit: Unit;

  getRotationX(): number;

  getRotationY(): number;

  getRotationZ(): number;
}
