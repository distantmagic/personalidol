// @flow

import type { Equatable } from "./Equatable";
import type { ElementSpatialUnit } from "../types/ElementSpatialUnit";

export interface ElementPosition<Unit: ElementSpatialUnit>
  extends Equatable<ElementPosition<Unit>> {
  getX(): number;

  getY(): number;

  getZ(): number;
}
