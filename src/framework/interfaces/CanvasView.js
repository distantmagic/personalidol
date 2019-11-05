// @flow

import type { Animatable } from "./Animatable";
import type { Disposable } from "./Disposable";

export interface CanvasView extends Animatable, Disposable {
  begin(): void;

  end(fps: number, isPanicked: boolean): void;

  useBegin(): boolean;

  useEnd(): boolean;

  useUpdate(): boolean;
}
