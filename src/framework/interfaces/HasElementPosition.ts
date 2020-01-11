// @flow strict

import type { ElementPosition } from "./ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";

export interface HasElementPosition<T: ElementPositionUnit> {
  getElementPosition(): ElementPosition<T>;
}
