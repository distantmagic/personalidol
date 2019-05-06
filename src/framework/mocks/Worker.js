import EventEmitter3 from "eventemitter3";
import noop from "lodash/noop";
import raf from "raf";

export default class WorkerMock extends EventEmitter3 {
  constructor(stringUrl) {
    super();

    // alias these ones for worker API compatibility
    this.addEventListener = this.addListener;
    this.removeEventListener = this.removeListener;

    this.url = stringUrl;
  }

  postMessage(message, ports) {
    raf(() => {
      this.emit("_message:incoming", {
        data: JSON.parse(JSON.stringify(message)),
        origin: this.url,
        source: null,
        type: "WorkerMessageEventMock"
      });
    });
  }
}
