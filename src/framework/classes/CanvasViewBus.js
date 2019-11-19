// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasView } from "../interfaces/CanvasView";
import type { CanvasViewBus as CanvasViewBusInterface } from "../interfaces/CanvasViewBus";
import type { Scheduler } from "../interfaces/Scheduler";

export default class CanvasViewBus implements CanvasViewBusInterface {
  +scheduler: Scheduler;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
  }

  async add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    await canvasView.attach(cancelToken);

    if (canvasView.useBegin()) {
      this.scheduler.onBegin(canvasView.begin);
    }
    if (canvasView.useEnd()) {
      this.scheduler.onEnd(canvasView.end);
    }
    if (canvasView.useUpdate()) {
      this.scheduler.onUpdate(canvasView.update);
    }
  }

  async delete(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    if (canvasView.useBegin()) {
      this.scheduler.offBegin(canvasView.begin);
    }
    if (canvasView.useEnd()) {
      this.scheduler.offEnd(canvasView.end);
    }
    if (canvasView.useUpdate()) {
      this.scheduler.offUpdate(canvasView.update);
    }

    return canvasView.dispose(cancelToken);
  }
}
