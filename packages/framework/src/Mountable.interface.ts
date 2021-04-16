import type { MountableCallback } from "./MountableCallback.type";
import type { MountableState } from "./MountableState.type";
import type { Nameable } from "./Nameable.interface";
import type { UnmountableCallback } from "./UnmountableCallback.type";

export interface Mountable extends Nameable {
  readonly isMountable: true;
  readonly mount: MountableCallback;
  readonly state: MountableState;
  readonly unmount: UnmountableCallback;
}
