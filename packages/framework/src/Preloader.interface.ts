import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Preloadable } from "./Preloadable.interface";

export interface Preloader extends MainLoopUpdatable {
  readonly preloadables: Set<Preloadable>;

  wait(): Promise<void>;
}
