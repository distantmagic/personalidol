// @flow

import type { CanvasPointerHandler } from "./CanvasPointerHandler";

export interface CanvasPointerHandlerReference {
  getCanvasPointerHandler(): CanvasPointerHandler;
}
