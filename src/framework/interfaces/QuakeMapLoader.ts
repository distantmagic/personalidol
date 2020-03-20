import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QuakeBrush from "src/framework/interfaces/QuakeBrush";
import { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";

import QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";
import QuakeWorkerFuncGroup from "src/framework/types/QuakeWorkerFuncGroup";
import QuakeWorkerWorldspawn from "src/framework/types/QuakeWorkerWorldspawn";

export default interface QuakeMapLoader {
  readonly onEntity: IEventListenerSet<[QuakeWorkerAny]>;
  readonly onStaticBrush: IEventListenerSet<[QuakeBrush]>;
  readonly onStaticGeometry: IEventListenerSet<[QuakeWorkerFuncGroup | QuakeWorkerWorldspawn, Transferable[]]>;

  processMapContent(loggerBreadcrumbs: LoggerBreadcrumbs, quakeMapContent: string): Promise<void>;
}
