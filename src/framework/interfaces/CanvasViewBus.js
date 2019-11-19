// @flow

import type { CancelToken } from "./CancelToken";
import type { CanvasView } from "./CanvasView";

export interface CanvasViewBus {
  add(CancelToken, CanvasView): Promise<void>;

  delete(CancelToken, CanvasView): Promise<void>;
}
