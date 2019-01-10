// @flow

import type { Equatable } from "./Equatable";

export interface ResourceReference<T, U>
  extends Equatable<ResourceReference<T, U>> {
  getReference(): T;
}
