import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface TouchObserver extends MainLoopUpdatable, Service {}
