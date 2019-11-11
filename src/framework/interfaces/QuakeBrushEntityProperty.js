// @flow

import type { Equatable } from "./Equatable";

export interface QuakeBrushEntityProperty extends Equatable<QuakeBrushEntityProperty> {
  getKey(): string;

  getValue(): string;
}
