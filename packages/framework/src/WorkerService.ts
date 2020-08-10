import { WorkerService as IWorkerService } from "./WorkerService.interface";

type Updater = () => any;

export function WorkerService(worker: Worker, updateMessage: null | Updater = null): IWorkerService {
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

  function update(): void {
    if (updateMessage) {
      worker.postMessage(updateMessage());
    }
  }

  return {
    start: start,
    stop: stop,
    update: update,
  };
}
