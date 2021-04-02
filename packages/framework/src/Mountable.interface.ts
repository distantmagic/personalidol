import type { GenericCallback } from "./GenericCallback.type";
import type { MountableState } from "./MountableState.type";
import type { Nameable } from "./Nameable.interface";

export interface Mountable extends Nameable {
  readonly isMountable: true;
  readonly mount: GenericCallback;
  readonly state: MountableState;
  readonly unmount: GenericCallback;
}
