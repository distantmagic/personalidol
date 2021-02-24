import { MathUtils } from "three/src/math/MathUtils";

import type { MainLoopUpdateCallback } from "./MainLoopUpdateCallback.type";
import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

import type { WorkerService as IWorkerService } from "./WorkerService.interface";

const _messageReady = Object.freeze({
  ready: null,
});

const _messageStart = Object.freeze({
  start: null,
});

const _messageStop = Object.freeze({
  stop: null,
});

function _noop(): void {}

export function WorkerService(worker: Worker, workerName: string, updater: null | MainLoopUpdateCallback = null): IWorkerService {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  function ready(): Promise<void> {
    return new Promise(function (resolve, reject) {
      function onMessage(evt: MessageEvent) {
        if (evt.data.ready) {
          resolve();
          worker.removeEventListener("message", onMessage);
        }
      }

      worker.addEventListener("message", onMessage);
      worker.postMessage(_messageReady);
    });
  }

  function start(): void {
    worker.postMessage(_messageStart);
  }

  function stop(): void {
    worker.postMessage(_messageStop);
  }

  return {
    id: MathUtils.generateUUID(),
    isWorkerService: true,
    name: `WorkerService(${workerName})`,
    state: state,

    ready: ready,
    start: start,
    stop: stop,
    update: updater ? updater : _noop,
  };
}
