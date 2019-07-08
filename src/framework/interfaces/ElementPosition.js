// @flow

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { Equatable } from "./Equatable";

export interface ElementPosition<Unit: ElementPositionUnit> extends Equatable<ElementPosition<Unit>> {
  distanceTo(ElementPosition<Unit>): number;

  getX(): number;

  getY(): number;

  getZ(): number;

  isOnLineBetween(ElementPosition<Unit>, ElementPosition<Unit>): boolean;
}
