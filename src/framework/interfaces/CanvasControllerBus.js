// @flow

import type { CanvasController } from "./CanvasController";

export interface CanvasControllerBus {
  add(CanvasController): Promise<void>;

  delete(CanvasController): Promise<void>;
}
