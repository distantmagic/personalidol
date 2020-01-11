// @flow strict

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementSize } from "./ElementSize";

export interface HasElementSize<T: ElementPositionUnit> {
  getElementSize(): ElementSize<T>;
}
