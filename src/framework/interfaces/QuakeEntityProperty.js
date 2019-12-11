// @flow

import type { Equatable } from "./Equatable";

export interface QuakeEntityProperty extends Equatable<QuakeEntityProperty> {
  asNumber(): number;

  getKey(): string;

  getValue(): string;
}
