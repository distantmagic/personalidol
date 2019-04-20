// @flow

import type { Equatable } from "./Equatable";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";

export interface ElementSize<Unit: ElementPositionUnit>
  extends Equatable<ElementSize<Unit>> {
  getAspect(): number;

  getDepth(): number;

  getHeight(): number;

  getWidth(): number;
}
