import autoBind from "auto-bind";

export default class DedicatedWorkerGlobalScopeMock {
  constructor(worker) {
    autoBind(this);

    this.worker = worker;

    worker.addEventListener("_message:incoming", evt => {
      const onmessage = this.onmessage;

      if (!onmessage) {
        return;
      }

      onmessage(evt);
    });
  }

  postMessage(data) {
    const message = {
      data: JSON.parse(JSON.stringify(data)),
      origin: null,
      source: null,
      type: "DedicatedWorkerGlobalScopeWorkerMessageMock",
    };

    this.worker.emit("message", message);

    const onmessage = this.worker.onmessage;

    if (!onmessage) {
      return;
    }

    onmessage(message);
  }
}
