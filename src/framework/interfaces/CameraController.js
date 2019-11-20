// @flow

import type { CameraZoomEnum } from "../types/CameraZoomEnum";
import type { CanvasController } from "./CanvasController";
import type { Disposable } from "./Disposable";
import type { Drawable } from "./Drawable";
import type { ElementSize } from "./ElementSize";

export interface CameraController extends CanvasController {
  setZoomStep(CameraZoomEnum): void;

  updateProjection(): void;
}
