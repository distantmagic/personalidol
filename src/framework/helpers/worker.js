// @flow

import BusClock from "../classes/BusClock";
import CancelToken from "../classes/CancelToken";
import LoggerBreadcrumbs from "../classes/LoggerBreadcrumbs";
import QueryBus from "../classes/QueryBus";
import QueryBusController from "../classes/QueryBusController";
import WorkerContextController from "../classes/WorkerContextController";
import WorkerMock from "../mocks/Worker";

import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";
import type { WorkerContextMethods } from "../types/WorkerContextMethods";

declare var self: DedicatedWorkerGlobalScope;

const WorkerClass = "undefined" === typeof Worker ? WorkerMock : Worker;
class WorkerHack extends WorkerClass {
  constructor() {
    super("https://example.com");
  }
}

export default function worker<T: WorkerContextMethods>(
  builder: (LoggerBreadcrumbsInterface, QueryBusInterface) => T
): Class<WorkerHack> {
  const loggerBreadcrumbs = new LoggerBreadcrumbs(["worker"]);
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const queryBus = new QueryBus(loggerBreadcrumbs.add("QueryBus"));
  const queryBusController = new QueryBusController(new BusClock(), queryBus);
  const workerContextController = new WorkerContextController<T>(loggerBreadcrumbs, self);
  const methods: T = builder(loggerBreadcrumbs, queryBus);

  workerContextController.setMethods(methods);
  workerContextController.attach();

  queryBusController.interval(cancelToken);

  // this one will actually never be used as Babel worker-loader overrides
  // worker file exports
  return WorkerHack;
}
