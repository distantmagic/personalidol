// @flow

import type { Cancelled } from "./Exception/Cancelled";

export type OnCancelCallback = (cancelled: Cancelled) => void;

export interface CancelToken {
  cancel(): void;

  onCancel(callback: OnCancelCallback): void;
}
