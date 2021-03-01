import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface ViewBagSceneObserver extends MainLoopUpdatable, Service {}
