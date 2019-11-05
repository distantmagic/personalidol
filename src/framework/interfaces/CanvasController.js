// @flow

import type { Disposable } from "./Disposable";
import type { Resizeable } from "./Resizeable";

export interface CanvasController extends Disposable, Resizeable<"px"> {
  draw(interpolationPercentage: number): void;
}
