// @flow

import type { Equatable } from "./Equatable";
import type { ElementSpatialUnit } from "../types/ElementSpatialUnit";

export interface ElementSize<Unit: ElementSpatialUnit>
  extends Equatable<ElementSize<Unit>> {
  getAspect(): number;

  getHeight(): number;

  getWidth(): number;
}
