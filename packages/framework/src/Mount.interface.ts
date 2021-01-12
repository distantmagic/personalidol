import type { DisposableGeneric } from "./DisposableGeneric.interface";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { MountState } from "./MountState.type";
import type { Mountable } from "./Mountable.type";
import type { Unmountable } from "./Unmountable.type";

export interface Mount extends DisposableGeneric, MainLoopUpdatable {
  readonly mount: Mountable;
  readonly name: string;
  readonly state: MountState;
  readonly unmount: Unmountable;

  preload(): void;
}
