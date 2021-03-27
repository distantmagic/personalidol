import type { DisposableState } from "./DisposableState.type";
import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { MountableState } from "./MountableState.type";
import type { PauseableState } from "./PauseableState.type";
import type { PreloadableState } from "./PreloadableState.type";

export type SceneState = DisposableState & MainLoopUpdatableState & MountableState & PauseableState & PreloadableState;
