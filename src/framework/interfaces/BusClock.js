// @flow

import type { BusClockTick } from "./BusClockTick";
import type { CancelToken } from "../interfaces/CancelToken";

export interface BusClock {
  interval(CancelToken): AsyncGenerator<BusClockTick, void, void>;
}
