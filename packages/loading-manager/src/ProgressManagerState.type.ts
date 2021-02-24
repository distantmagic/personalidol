import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";

import type { ProgressManagerComment } from "./ProgressManagerComment.type";

export type ProgressManagerState = MainLoopUpdatableState & {
  comment: Array<ProgressManagerComment>;
  expectsAtLeast: number;
  progress: number;
  version: number;
};
