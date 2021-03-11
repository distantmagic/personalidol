import type { MessageProgressChange } from "./MessageProgressChange.type";
import type { MessageProgressDone } from "./MessageProgressDone.type";
import type { MessageProgressError } from "./MessageProgressError.type";
import type { MessageProgressStart } from "./MessageProgressStart.type";
import type { ProgressManagerState } from "./ProgressManagerState.type";

export interface ProgressManager {
  state: ProgressManagerState;

  done(message: MessageProgressDone): void;

  error(message: MessageProgressError): void;

  expect(expect: number): void;

  progress(message: MessageProgressChange): void;

  reset(): void;

  start(message: MessageProgressStart): void;
}
