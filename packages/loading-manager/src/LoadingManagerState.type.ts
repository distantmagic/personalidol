import type { LoadingManagerItem } from "./LoadingManagerItem.type";
import type { LoadingManagerProgress } from "./LoadingManagerProgress.type";

export type LoadingManagerState = LoadingManagerProgress & {
  expectsAtLeast: number;
  lastUpdate: number;
  itemsLoaded: Set<LoadingManagerItem>;
  itemsToLoad: Set<LoadingManagerItem>;
};
