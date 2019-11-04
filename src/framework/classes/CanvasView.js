// @flow

import type { CanvasView as CanvasViewInterface } from "../interfaces/CanvasView";
import type { CanvasViewBag } from "../interfaces/CanvasViewBag";

export default class CanvasView implements CanvasViewInterface {
  +canvasViewBag: CanvasViewBag;

  constructor(canvasViewBag: CanvasViewBag): void {
    this.canvasViewBag = canvasViewBag;
  }

  attach(): void {}

  begin(): void {}

  dispose(): void {
    this.canvasViewBag.dispose();
  }

  end(fps: number, isPanicked: boolean): void {}

  update(delta: number): void {}
}
