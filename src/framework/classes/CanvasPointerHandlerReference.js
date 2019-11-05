// @flow

import type { CanvasPointerHandler } from "../interfaces/CanvasPointerHandler";
import type { CanvasPointerHandlerReference as CanvasPointerHandlerReferenceInterface } from "../interfaces/CanvasPointerHandlerReference";

export default class CanvasPointerHandlerReference implements CanvasPointerHandlerReferenceInterface {
  +canvasPointerHandler: CanvasPointerHandler;

  constructor(canvasPointerHandler: CanvasPointerHandler) {
    this.canvasPointerHandler = canvasPointerHandler;
  }

  getCanvasPointerHandler(): CanvasPointerHandler {
    return this.canvasPointerHandler;
  }
}
