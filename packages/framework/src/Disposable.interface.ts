import type { DisposableGeneric } from "./DisposableGeneric.interface";
import type { DisposableState } from "./DisposableState.type";
import type { Nameable } from "./Nameable.interface";

export interface Disposable extends DisposableGeneric, Nameable {
  readonly isDisposable: true;
  readonly state: DisposableState;
}
