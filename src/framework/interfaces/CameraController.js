// @flow

import type { CameraZoomEnum } from "../types/CameraZoomEnum";
import type { Disposable } from "./Disposable";
import type { Drawable } from "./Drawable";
import type { ElementSize } from "./ElementSize";

export interface CameraController extends Disposable, Drawable {
  setViewportSize(ElementSize<"px">): void;

  setZoomStep(CameraZoomEnum): void;

  updateProjection(): void;
}
