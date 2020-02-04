import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import EquatableWithPrecision from "src/framework/interfaces/EquatableWithPrecision";

export default interface ElementSize<Unit extends ElementPositionUnit> extends EquatableWithPrecision<ElementSize<Unit>> {
  readonly unit: Unit;

  getBaseArea(): number;

  getAspect(): number;

  getDepth(): number;

  getHeight(): number;

  getWidth(): number;
}
