import type { LoadinManagerItem } from "./LoadinManagerItem.type";

export type LoadingManagerState = {
  comment: string;
  expectsAtLeast: number;
  itemsLoaded: Set<LoadinManagerItem>;
  itemsToLoad: Set<LoadinManagerItem>;
  progress: number;
};
