import type { DisposableState } from "@personalidol/framework/src/DisposableState.type";
import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { PauseableState } from "@personalidol/framework/src/PauseableState.type";
import type { PreloadableState } from "@personalidol/framework/src/PreloadableState.type";
import type { RaycastableState } from "@personalidol/input/src/RaycastableState.type";

export type ViewState = DisposableState & MainLoopUpdatableState & MountState & PauseableState & PreloadableState & RaycastableState;
