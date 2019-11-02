// @flow

import type { CanvasController } from "./CanvasController";

export interface CanvasControllerBus {
  add(CanvasController): void;

  delete(CanvasController): void;
}
