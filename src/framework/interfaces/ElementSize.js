// @flow

import type { Equatable } from "./Equatable";
import type { ElementSizeUnit } from "../types/ElementSizeUnit";

export interface ElementSize<T: ElementSizeUnit>
  extends Equatable<ElementSize<T>> {
  getAspect(): number;

  getHeight(): number;

  getWidth(): number;
}
