import type { MessageProgressChange } from "./MessageProgressChange.type";
import type { MessageProgressError } from "./MessageProgressError.type";

export type ProgressManagerState = {
  errors: ReadonlyArray<MessageProgressError>;
  expect: number;
  messages: ReadonlyArray<MessageProgressChange>;
  version: number;
};
