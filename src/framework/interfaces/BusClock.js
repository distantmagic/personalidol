// @flow

import type { BusClockCallback } from "../types/BusClockCallback";
import type { CancelToken } from "../interfaces/CancelToken";

export interface BusClock {
  interval(CancelToken, BusClockCallback): Promise<void>;
}
