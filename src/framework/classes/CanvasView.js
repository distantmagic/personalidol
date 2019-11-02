// @flow

import type { CanvasView as CanvasViewInterface } from "../interfaces/CanvasView";

export default class CanvasView implements CanvasViewInterface {
  begin(): void {}

  end(fps: number, isPanicked: boolean): void {}

  update(delta: number): void {}
}
