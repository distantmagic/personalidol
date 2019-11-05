// @flow

import type { CanvasController as CanvasControllerInterface } from "../interfaces/CanvasController";
import type { CanvasViewBag } from "../interfaces/CanvasViewBag";
import type { ElementSize } from "../interfaces/ElementSize";

export default class CanvasController implements CanvasControllerInterface {
  +canvasViewBag: CanvasViewBag;

  constructor(canvasViewBag: CanvasViewBag) {
    this.canvasViewBag = canvasViewBag;
  }

  async attach(): Promise<void> {}

  async dispose(): Promise<void> {
    return this.canvasViewBag.dispose();
  }

  draw(interpolationPercentage: number): void {}

  resize(elementSize: ElementSize<"px">): void {}
}
