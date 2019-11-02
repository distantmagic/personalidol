// @flow

import type { Animatable } from "./Animatable";

export interface CanvasView extends Animatable {
  begin(): void;

  end(fps: number, isPanicked: boolean): void;
}
