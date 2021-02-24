import type { ProgressManagerComment } from "./ProgressManagerComment.type";

export type ProgressManagerState = {
  comment: Array<ProgressManagerComment>;
  expectsAtLeast: number;
  progress: number;
  version: number;
};
