import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface MainLoop extends Service {
  updatables: Set<MainLoopUpdatable>;

  tick(): void;
}
