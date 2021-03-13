import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { MountState } from "./MountState.type";
import type { PauseableState } from "./PauseableState.type";
import type { RaycastableState } from "./RaycastableState.type";

export type ViewState = MainLoopUpdatableState & MountState & PauseableState & RaycastableState;
