import type { TimedUpdatableState } from "@personalidol/framework/src/TimedUpdatableState.type";

import type { LoadingManagerItem } from "./LoadingManagerItem.type";
import type { LoadingManagerProgress } from "./LoadingManagerProgress.type";

export type LoadingManagerState = LoadingManagerProgress &
  TimedUpdatableState & {
    expectsAtLeast: number;
    itemsLoaded: Set<LoadingManagerItem>;
    itemsToLoad: Set<LoadingManagerItem>;
  };
