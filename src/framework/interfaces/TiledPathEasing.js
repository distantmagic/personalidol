// @flow

import type { ElementPosition } from "./ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";

export interface TiledPathEasing<T: ElementPositionUnit> {
  getElementPositionAtTime(unitsPerSecond: number, seconds: number): ElementPosition<T>;
}
