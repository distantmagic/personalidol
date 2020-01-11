import { BusClockCallback } from "../types/BusClockCallback";
import { CancelToken } from "../interfaces/CancelToken";

export interface BusClock {
  interval(cancelToken: CancelToken, busClockCallback: BusClockCallback): Promise<void>;
}
