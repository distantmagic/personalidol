import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import EquatableWithPrecision from "src/framework/interfaces/EquatableWithPrecision";

export default interface ElementPosition<Unit extends ElementPositionUnit> extends EquatableWithPrecision<ElementPosition<Unit>> {
  readonly unit: Unit;

  distanceTo(elementPosition: ElementPosition<Unit>): number;

  getX(): number;

  getY(): number;

  getZ(): number;

  offset(elementPosition: ElementPosition<Unit>): ElementPosition<Unit>;
}
