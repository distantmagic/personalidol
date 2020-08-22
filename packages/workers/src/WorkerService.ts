import type { MainLoopUpdateCallback } from "@personalidol/framework/src/MainLoopUpdateCallback.type";

import type { WorkerService as IWorkerService } from "./WorkerService.interface";

function _noop(): void {}

export function WorkerService(worker: Worker, workerName: string, updater: null | MainLoopUpdateCallback = null): IWorkerService {
  const _messageStart = {
    start: null,
  };
  const _messageStop = {
    stop: null,
  };

  function ready(): Promise<void> {
    return new Promise(function (resolve, reject) {
      function onMessage(evt: MessageEvent) {
        if (evt.data.ready) {
          resolve();
          worker.removeEventListener("message", onMessage);
        }
      }

      worker.addEventListener("message", onMessage);
      worker.postMessage({
        ready: null,
      });
    });
  }

  function start(): void {
    worker.postMessage(_messageStart);
  }

  function stop(): void {
    worker.postMessage(_messageStop);
  }

  return {
    name: `WorkerService(${workerName})`,

    ready: ready,
    start: start,
    stop: stop,
    update: updater ? updater : _noop,
  };
}
