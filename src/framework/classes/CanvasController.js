// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasController as CanvasControllerInterface } from "../interfaces/CanvasController";
import type { CanvasViewBag } from "../interfaces/CanvasViewBag";
import type { ElementSize } from "../interfaces/ElementSize";

export default class CanvasController implements CanvasControllerInterface {
  +canvasViewBag: CanvasViewBag;
  #isAttached: boolean;
  #isDisposed: boolean;

  constructor(canvasViewBag: CanvasViewBag) {
    this.canvasViewBag = canvasViewBag;
    this.#isAttached = false;
    this.#isDisposed = false;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    this.#isAttached = true;
    this.#isDisposed = false;
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    this.#isAttached = false;
    await this.canvasViewBag.dispose(cancelToken);
    this.#isDisposed = true;
  }

  draw(interpolationPercentage: number): void {}

  end(fps: number, isPanicked: boolean): void {}

  isAttached(): boolean {
    return this.#isAttached;
  }

  isDisposed(): boolean {
    return this.#isDisposed;
  }

  resize(elementSize: ElementSize<"px">): void {}
}
