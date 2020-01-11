// @flow strict

import type { CancelToken } from "./CancelToken";
import type { CanvasController } from "./CanvasController";

export interface CanvasControllerBus {
  add(CancelToken, CanvasController): Promise<void>;

  delete(CancelToken, CanvasController): Promise<void>;
}
