// @flow

import type { Cancellable } from "./Cancellable";
import type { CancelTokenCallback } from "../types/CancelTokenCallback";

export interface CancelToken extends Cancellable {
  cancel(): void;

  onCancelled(CancelTokenCallback): void;
}
