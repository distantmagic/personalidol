// @flow

import type { CancelTokenCallback } from "../types/CancelTokenCallback";

export interface CancelToken {
  cancel(): void;

  isCancelled(): boolean;

  onCancelled(CancelTokenCallback): void;
}
