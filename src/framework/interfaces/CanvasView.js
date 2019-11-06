// @flow

import type { Animatable } from "./Animatable";
import type { CanvasPointerHandler } from "./CanvasPointerHandler";
import type { Disposable } from "./Disposable";

export interface CanvasView extends Animatable, CanvasPointerHandler, Disposable {
  begin(): void;

  end(fps: number, isPanicked: boolean): void;

  useBegin(): boolean;

  useEnd(): boolean;

  useUpdate(): boolean;
}
