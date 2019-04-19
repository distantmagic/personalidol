// @flow

import type { ElementSize } from "./ElementSize";
import type { ElementSpatialUnit } from "../types/ElementSpatialUnit";

export interface Resizeable<T: ElementSpatialUnit> {
  resize(ElementSize<T>): void;
}
