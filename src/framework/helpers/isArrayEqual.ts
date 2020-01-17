import canCompare from "src/framework/helpers/canCompare";

import Exception from "src/framework/classes/Exception";

import Equatable from "src/framework/interfaces/Equatable";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

function hasEqual<T>(loggerBreadcrumbs: LoggerBreadcrumbs, a: ReadonlyArray<Equatable<T>>, item: Equatable<T>): boolean {
  return a.some((aItem: Equatable<T>) => {
    if (!canCompare(aItem, item)) {
      throw new Exception(loggerBreadcrumbs, "Array is not homogeneous and can't be compared.");
    }

    return aItem.isEqual(item);
  });
}

export default function isArrayEqual<T>(loggerBreadcrumbs: LoggerBreadcrumbs, a: ReadonlyArray<Equatable<T>>, b: ReadonlyArray<Equatable<T>>): boolean {
  if (a.length !== b.length) {
    return false;
  }

  if (!a.every(aItem => hasEqual<T>(loggerBreadcrumbs, b, aItem))) {
    return false;
  }

  return b.every(bItem => hasEqual<T>(loggerBreadcrumbs, a, bItem));
}
