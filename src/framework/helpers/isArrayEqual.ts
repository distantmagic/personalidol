// @flow strict

import canCompare from "./canCompare";
import Exception from "../classes/Exception";

import type { Equatable } from "../interfaces/Equatable";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

// see: https://github.com/flow-typed/flow-typed/issues/3644

function hasEqual<T>(loggerBreadcrumbs: LoggerBreadcrumbs, a: $ReadOnlyArray<Equatable<T>>, item: Equatable<T>): boolean {
  return a.some((aItem: Equatable<T>) => {
    if (!canCompare(aItem, item)) {
      throw new Exception(loggerBreadcrumbs, "Array is not homogeneous and can't be compared.");
    }

    return aItem.isEqual(item);
  });
}

export default function isArrayEqual(loggerBreadcrumbs: LoggerBreadcrumbs, a: $ReadOnlyArray<Equatable<any>>, b: $ReadOnlyArray<Equatable<any>>): boolean {
  if (a.length !== b.length) {
    return false;
  }

  if (!a.every(aItem => hasEqual(loggerBreadcrumbs, b, aItem))) {
    return false;
  }

  return b.every(bItem => hasEqual(loggerBreadcrumbs, a, bItem));
}
