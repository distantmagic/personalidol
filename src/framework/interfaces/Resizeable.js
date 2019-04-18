// @flow

import type { ElementSize } from "./ElementSize";
import type { ElementSizeUnit } from "../types/ElementSizeUnit";

export interface Resizeable<T> {
  resize(ElementSize<T>): void;
}
