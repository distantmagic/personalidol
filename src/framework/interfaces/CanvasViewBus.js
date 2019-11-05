// @flow

import type { CanvasView } from "./CanvasView";

export interface CanvasViewBus {
  add(CanvasView): Promise<void>;

  delete(CanvasView): Promise<void>;
}
