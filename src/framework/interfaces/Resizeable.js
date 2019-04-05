// @flow

import type { ElementSize } from "./ElementSize";

export interface Resizeable {
  resize(ElementSize): void;
}
