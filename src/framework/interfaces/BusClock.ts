import { BusClockCallback } from "src/framework/types/BusClockCallback";
import { CancelToken } from "src/framework/interfaces/CancelToken";

export interface BusClock {
  interval(cancelToken: CancelToken, busClockCallback: BusClockCallback): Promise<void>;
}
