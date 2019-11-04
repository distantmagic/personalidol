// @flow

import type { Renderable } from "./Renderable";
import type { Animatable } from "./Animatable";

export interface CanvasView extends Animatable, Renderable {
  begin(): void;

  end(fps: number, isPanicked: boolean): void;
}
