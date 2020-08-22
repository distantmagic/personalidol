import type { MainLoopUpdatable } from "@personalidol/framework/src//MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src//Service.interface";

import type { LoadingManagerItem } from "./LoadingManagerItem.type";
import type { LoadingManagerState } from "./LoadingManagerState.type";

export interface LoadingManager extends MainLoopUpdatable, Service {
  state: LoadingManagerState;

  done(item: LoadingManagerItem): void;

  expectAtLeast(expectAtLeast: number): void;

  reset(): void;

  update(): void;

  waitFor(item: LoadingManagerItem): void;
}
