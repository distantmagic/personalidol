import type { Disposable } from "./Disposable.type";
import type { DisposableGeneric } from "./DisposableGeneric.type";

export function disposableGeneric(generic: DisposableGeneric): Disposable {
  return function () {
    generic.dispose();
  };
}
