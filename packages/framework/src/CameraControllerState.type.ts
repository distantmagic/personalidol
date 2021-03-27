import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { MountableState } from "./MountableState.type";
import type { PauseableState } from "./PauseableState.type";

export type CameraControllerState = MainLoopUpdatableState &
  MountableState &
  PauseableState & {
    lastCameraTypeChange: number;
  };
