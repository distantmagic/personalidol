import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";

export interface Preloader extends MainLoopUpdatable {
  readonly isPreloader: true;

  wait(): Promise<void>;
}
