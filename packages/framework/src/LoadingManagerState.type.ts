import type { LoadingManagerItem } from "./LoadingManagerItem.type";

export type LoadingManagerState = {
  comment: string;
  expectsAtLeast: number;
  itemsLoaded: Set<LoadingManagerItem>;
  itemsToLoad: Set<LoadingManagerItem>;
  progress: number;
};
