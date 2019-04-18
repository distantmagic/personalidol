// @flow

import type { Equatable } from "./Equatable";
import type { ElementSizeUnit } from "../types/ElementSizeUnit";

export interface ElementSize<Unit: ElementSizeUnit>
  extends Equatable<ElementSize<Unit>> {
  getAspect(): number;

  getHeight(): number;

  getWidth(): number;
}
