import type { Disposable } from "./Disposable.type";
import type { DisposableGeneric } from "./DisposableGeneric.interface";

export function disposableGeneric(generic: DisposableGeneric): Disposable {
  return function () {
    generic.dispose();
  };
}
