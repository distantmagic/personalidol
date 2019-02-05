// @flow

import type { ClockTick } from "../../framework/interfaces/ClockTick";

export interface SceneController<T> {
  init(canvas: T): Promise<void>;

  destroy(canvas: T): Promise<void>;

  resize(width: number, height: number): Promise<void>;

  tick(canvas: T, ClockTick): Promise<void>;
}
