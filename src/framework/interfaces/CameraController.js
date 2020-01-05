// @flow

import type { CanvasController } from "./CanvasController";

export interface CameraController extends CanvasController {
  setZoom(number): void;
}
