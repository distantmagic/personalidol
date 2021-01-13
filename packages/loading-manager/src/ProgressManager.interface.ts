import type { MainLoopUpdatable } from "@personalidol/framework/src//MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src//Service.interface";

import type { ProgressManagerItem } from "./ProgressManagerItem.type";
import type { ProgressManagerState } from "./ProgressManagerState.type";

export interface ProgressManager extends MainLoopUpdatable, Service {
  state: ProgressManagerState;

  done(item: ProgressManagerItem): void;

  expectAtLeast(expectAtLeast: number): void;

  reset(): void;

  update(): void;

  waitFor(item: ProgressManagerItem): void;
}
