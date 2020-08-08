import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface SceneLoader extends MainLoopUpdatable, Service {}
