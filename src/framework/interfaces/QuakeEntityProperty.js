// @flow

import type { Equatable } from "./Equatable";

export interface QuakeEntityProperty extends Equatable<QuakeEntityProperty> {
  getKey(): string;

  getValue(): string;
}
