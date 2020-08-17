import type { MainLoopUpdateCallback } from "./MainLoopUpdateCallback.type";
import type { WorkerService as IWorkerService } from "./WorkerService.interface";

function _noop(): void {}

export function WorkerService(worker: Worker, updater: null | MainLoopUpdateCallback = null): IWorkerService {
  const _messageStart = {
    start: null,
  };
  const _messageStop = {
    stop: null,
  };

  function start(): void {
    worker.postMessage(_messageStart);
  }

  function stop(): void {
    worker.postMessage(_messageStop);
  }

  return {
    start: start,
    stop: stop,
    update: updater ? updater : _noop,
  };
}
