import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { MountableState } from "@personalidol/framework/src/MountableState.type";
import type { PauseableState } from "@personalidol/framework/src/PauseableState.type";

export type EntityControllerState = MainLoopUpdatableState & MountableState & PauseableState;
