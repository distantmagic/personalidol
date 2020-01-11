// @flow strict

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { EquatableWithPrecision } from "./EquatableWithPrecision";

export interface ElementSize<Unit: ElementPositionUnit> extends EquatableWithPrecision<ElementSize<Unit>> {
  getBaseArea(): number;

  getAspect(): number;

  getDepth(): number;

  getHeight(): number;

  getWidth(): number;
}
