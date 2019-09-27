// @flow

import type { ElementRotationUnit } from "../types/ElementRotationUnit";
import type { EquatableWithPrecision } from "./EquatableWithPrecision";

export interface ElementRotation<Unit: ElementRotationUnit> extends EquatableWithPrecision<ElementRotation<Unit>> {
  getRotationX(): number;

  getRotationY(): number;

  getRotationZ(): number;
}
