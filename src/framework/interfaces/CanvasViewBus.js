// @flow

import type { CanvasView } from "./CanvasView";

export interface CanvasViewBus {
  add(CanvasView): void;

  delete(CanvasView): void;
}
