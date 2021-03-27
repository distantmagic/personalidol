import type { DisposableCallback } from "./DisposableCallback.type";

export interface DisposableGeneric {
  readonly dispose: DisposableCallback;
}
