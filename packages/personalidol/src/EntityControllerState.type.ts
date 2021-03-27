import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { PauseableState } from "@personalidol/framework/src/PauseableState.type";

export type EntityControllerState = MainLoopUpdatableState & MountState & PauseableState;
