// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasController as CanvasControllerInterface } from "../interfaces/CanvasController";
import type { CanvasViewBag } from "../interfaces/CanvasViewBag";
import type { ElementSize } from "../interfaces/ElementSize";

export default class CanvasController implements CanvasControllerInterface {
  +canvasViewBag: CanvasViewBag;

  constructor(canvasViewBag: CanvasViewBag) {
    this.canvasViewBag = canvasViewBag;
  }

  async attach(cancelToken: CancelToken): Promise<void> {}

  async dispose(cancelToken: CancelToken): Promise<void> {
    return this.canvasViewBag.dispose(cancelToken);
  }

  draw(interpolationPercentage: number): void {}

  end(fps: number, isPanicked: boolean): void {}

  resize(elementSize: ElementSize<"px">): void {}
}
