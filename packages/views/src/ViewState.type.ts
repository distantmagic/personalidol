import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { PauseableState } from "@personalidol/framework/src/PauseableState.type";
import type { RaycastableState } from "@personalidol/input/src/RaycastableState.type";

export type ViewState = MainLoopUpdatableState & MountState & PauseableState & RaycastableState;
