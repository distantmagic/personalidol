// @flow

import type { CanvasController } from "./CanvasController";
import type { Disposable } from "./Disposable";
import type { Drawable } from "./Drawable";
import type { ElementSize } from "./ElementSize";

export interface CameraController extends CanvasController {
  setZoom(number): void;
}
