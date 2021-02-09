import type { MountState } from "./MountState.type";
import type { PauseableState } from "./PauseableState.type";

export type ViewState = MountState & PauseableState;
