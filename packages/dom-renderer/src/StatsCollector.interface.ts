import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { RegistersMessagePort } from "@personalidol/framework/src/RegistersMessagePort.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";
import type { StatsCollectorReport } from "@personalidol/framework/src/StatsCollectorReport.type";

export interface StatsCollector extends MainLoopUpdatable, RegistersMessagePort, Service {
  readonly reports: ReadonlyArray<StatsCollectorReport>;
}
