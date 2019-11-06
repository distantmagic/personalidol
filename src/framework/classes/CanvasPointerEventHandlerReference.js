// @flow

import type { CanvasPointerEventHandler } from "../interfaces/CanvasPointerEventHandler";
import type { CanvasPointerEventHandlerReference as CanvasPointerEventHandlerReferenceInterface } from "../interfaces/CanvasPointerEventHandlerReference";

export default class CanvasPointerEventHandlerReference implements CanvasPointerEventHandlerReferenceInterface {
  +canvasPointerHandler: CanvasPointerEventHandler;

  constructor(canvasPointerHandler: CanvasPointerEventHandler) {
    this.canvasPointerHandler = canvasPointerHandler;
  }

  getCanvasPointerEventHandler(): CanvasPointerEventHandler {
    return this.canvasPointerHandler;
  }
}
