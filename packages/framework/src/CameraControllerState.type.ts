import type { MountState } from "./MountState.type";
import type { PauseableState } from "./PauseableState.type";

export type CameraControllerState = MountState &
  PauseableState & {
    lastCameraTypeChange: number;
  };
