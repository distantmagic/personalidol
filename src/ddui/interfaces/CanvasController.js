// @flow

import type { ClockTick } from "../../framework/interfaces/ClockTick";

export interface CanvasController<T> {
  init(canvas: T): Promise<void>;

  destroy(canvas: T): Promise<void>;

  isInitialized(): boolean;

  resize(width: number, height: number): Promise<void>;

  tick(canvas: T, ClockTick): Promise<void>;
}
