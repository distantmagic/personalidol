import type { MountState } from "./MountState.type";
import type { PauseableState } from "./PauseableState.type";
import type { PreloadableState } from "./PreloadableState.type";

export type SceneState = MountState & PauseableState & PreloadableState;
