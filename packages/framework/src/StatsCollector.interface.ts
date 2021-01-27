import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { RegistersMessagePort } from "./RegistersMessagePort.interface";
import type { Service } from "./Service.interface";

export interface StatsCollector extends MainLoopUpdatable, RegistersMessagePort, Service {
}
