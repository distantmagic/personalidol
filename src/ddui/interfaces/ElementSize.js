// @flow

import type { Equatable } from "../../framework/interfaces/Equatable";

export interface ElementSize extends Equatable<ElementSize> {
  getAspect(): number;

  getHeight(): number;

  getWidth(): number;
}
