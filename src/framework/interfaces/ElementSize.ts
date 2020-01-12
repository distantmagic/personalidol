import { ElementPositionUnit } from "src/framework/types/ElementPositionUnit";
import { EquatableWithPrecision } from "src/framework/interfaces/EquatableWithPrecision";

export interface ElementSize<Unit extends ElementPositionUnit> extends EquatableWithPrecision<ElementSize<Unit>> {
  getBaseArea(): number;

  getAspect(): number;

  getDepth(): number;

  getHeight(): number;

  getWidth(): number;
}
