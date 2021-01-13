import type { DisposableCallback } from "./DisposableCallback.type";
import type { DisposableGeneric } from "./DisposableGeneric.interface";

export function disposableGeneric(generic: DisposableGeneric): DisposableCallback {
  return function () {
    generic.dispose();
  };
}
