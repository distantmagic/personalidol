import type { MainLoopTicker } from "./MainLoopTicker.interface";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Scheduler } from "./Scheduler.interface";
import type { Service } from "./Service.interface";

export interface MainLoop<TickType> extends Service {
  isMainLoop: true;
  scheduler: Scheduler<TickType>;
  ticker: MainLoopTicker;
  updatables: Set<MainLoopUpdatable>;

  tick(now: number): void;
}
