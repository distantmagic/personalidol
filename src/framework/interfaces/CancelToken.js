// @flow

export interface CancelToken {
  cancel(): void;

  isCancelled(): boolean;

  onCancelled(): Promise<void>;
}
