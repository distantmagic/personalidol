import type { ProgressManagerComment } from "./ProgressManagerComment.type";

export type ProgressManagerProgress = {
  comment: Array<ProgressManagerComment>;
  expectsAtLeast: number;
  progress: number;
};
