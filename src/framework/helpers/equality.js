// @flow

import type { Equatable } from "../interfaces/Equatable";

// see: https://github.com/flow-typed/flow-typed/issues/3644

function hasEqual(a: $ReadOnlyArray<Equatable<any>>, item: Equatable<any>): boolean {
  return a.some(aItem => aItem.isEqual(item));
}

export function isArrayEqual(a: $ReadOnlyArray<Equatable<any>>, b: $ReadOnlyArray<Equatable<any>>): boolean {
  if (a.length !== b.length) {
    return false;
  }

  if (!a.every(aItem => hasEqual(b, aItem))) {
    return false;
  }

  return b.every(bItem => hasEqual(a, bItem));
}
