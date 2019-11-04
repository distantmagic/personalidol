// @flow

import type { Renderable } from "./Renderable";
import type { Resizeable } from "./Resizeable";

export interface CanvasController extends Renderable, Resizeable<"px"> {
  draw(interpolationPercentage: number): void;
}
