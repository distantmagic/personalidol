import { ElementPositionUnit } from "../types/ElementPositionUnit";
import { EquatableWithPrecision } from "./EquatableWithPrecision";

export interface ElementSize<Unit extends ElementPositionUnit> extends EquatableWithPrecision<ElementSize<Unit>> {
  getBaseArea(): number;

  getAspect(): number;

  getDepth(): number;

  getHeight(): number;

  getWidth(): number;
}
