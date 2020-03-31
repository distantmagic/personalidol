import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type QuakeBrush from "src/framework/interfaces/QuakeBrush";
import type { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";

import type QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";
import type QuakeWorkerFuncGroup from "src/framework/types/QuakeWorkerFuncGroup";
import type QuakeWorkerWorldspawn from "src/framework/types/QuakeWorkerWorldspawn";

export default interface QuakeMapLoader extends HasLoggerBreadcrumbs {
  readonly onEntity: IEventListenerSet<[QuakeWorkerAny]>;
  readonly onStaticBrush: IEventListenerSet<[QuakeBrush]>;
  readonly onStaticGeometry: IEventListenerSet<[QuakeWorkerFuncGroup | QuakeWorkerWorldspawn, Transferable[]]>;

  processMapContent(quakeMapContent: string): Promise<void>;
}
