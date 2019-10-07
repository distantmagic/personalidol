// @flow

import type { ClockTick } from "./ClockTick";

export interface ClockReactive {
  tick(ClockTick): Promise<void>;
}
