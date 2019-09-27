// @flow

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { EquatableWithPrecision } from "./EquatableWithPrecision";

export interface ElementPosition<Unit: ElementPositionUnit> extends EquatableWithPrecision<ElementPosition<Unit>> {
  distanceTo(ElementPosition<Unit>): number;

  getX(): number;

  getY(): number;

  getZ(): number;

  isOnLineBetween(ElementPosition<Unit>, ElementPosition<Unit>): boolean;
}
