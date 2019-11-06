// @flow

import type { Animatable } from "./Animatable";
import type { CanvasPointerEventHandler } from "./CanvasPointerEventHandler";
import type { Disposable } from "./Disposable";

export interface CanvasView extends Animatable, CanvasPointerEventHandler, Disposable {
  begin(): void;

  end(fps: number, isPanicked: boolean): void;

  useBegin(): boolean;

  useEnd(): boolean;

  useUpdate(): boolean;
}
