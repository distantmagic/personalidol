import { WorkerService as IWorkerService } from "./WorkerService.interface";

export function WorkerService(worker: Worker, dimensionsState: Uint16Array, inputState: Int16Array): IWorkerService {
  const _messageStart = {
    start: null,
  };
  const _messageStop = {
    stop: null,
  };
  const _messageUpdate = {
    dimensions: dimensionsState,
    input: inputState,
  };

  function start(): void {
    worker.postMessage(_messageStart);
  }

  function stop(): void {
    worker.postMessage(_messageStop);
  }

  function update(): void {
    worker.postMessage(_messageUpdate);
  }

  return {
    start: start,
    stop: stop,
    update: update,
  };
}
