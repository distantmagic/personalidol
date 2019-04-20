// @flow

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { Equatable } from "./Equatable";

export interface ElementPosition<Unit: ElementPositionUnit>
  extends Equatable<ElementPosition<Unit>> {
  getX(): number;

  getY(): number;

  getZ(): number;
}
