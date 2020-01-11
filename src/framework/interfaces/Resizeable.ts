// @flow strict

import type { ElementSize } from "./ElementSize";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";

export interface Resizeable<Unit: ElementPositionUnit> {
  resize(ElementSize<Unit>): void;
}
