import type { MainLoopTicker } from "./MainLoopTicker.interface";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface MainLoop extends Service {
  isMainLoop: true;
  ticker: MainLoopTicker;
  updatables: Set<MainLoopUpdatable>;

  tick(now: number): void;
}
