// @flow

import type { CanvasView } from "./CanvasView";

export interface SchedulerBridge {
  forward(CanvasView): void;

  withdraw(CanvasView): void;
}
