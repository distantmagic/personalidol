import type { DisposableGeneric } from "./DisposableGeneric.interface";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { MountableCallback } from "./MountableCallback.type";
import type { MountState } from "./MountState.type";
import type { Nameable } from "./Nameable.interface";
import type { UnmountableCallback } from "./UnmountableCallback.type";

export interface Mountable extends DisposableGeneric, MainLoopUpdatable, Nameable {
  readonly isMountable: true;
  readonly mount: MountableCallback;
  readonly state: MountState;
  readonly unmount: UnmountableCallback;
}
