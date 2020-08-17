import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";
import type { TickTimerState } from "./TickTimerState.type";

export interface MainLoop extends Service {
  tickTimerState: TickTimerState;
  updatables: Set<MainLoopUpdatable>;

  tick(): void;
}
