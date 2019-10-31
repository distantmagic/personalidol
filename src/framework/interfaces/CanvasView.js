// @flow

import type { Animatable } from "./Animatable";

export interface CanvasView extends Animatable {
  draw(interpolationPercentage: number): void;

  end(fps: number, isPanicked: boolean): void;
}
