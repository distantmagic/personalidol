import type { DisposableCallback } from "./DisposableCallback.type";

export interface DisposableGeneric {
  dispose: DisposableCallback;
}
