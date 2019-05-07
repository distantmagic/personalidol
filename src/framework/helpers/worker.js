// @flow

import WorkerContextController from "../classes/WorkerContextController";
import WorkerMock from "../mocks/Worker";

import type { WorkerContextController as WorkerContextControllerInterface } from "../interfaces/WorkerContextController";
import type { WorkerContextMethods } from "../types/WorkerContextMethods";

declare var self: DedicatedWorkerGlobalScope;

const WorkerClass = "undefined" === typeof Worker ? WorkerMock : Worker;
class WorkerHack extends WorkerClass {
  constructor() {
    super("https://example.com");
  }
}

export default function worker<T: WorkerContextMethods>(
  methods: T
): Class<WorkerHack> {
  const workerContextController = new WorkerContextController<T>(self);

  workerContextController.setMethods(methods);
  workerContextController.attach();

  // this one will actually never be used as Babel worker-loader overrides
  // worker file exports
  return WorkerHack;
}
