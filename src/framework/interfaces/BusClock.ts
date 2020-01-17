import CancelToken from "src/framework/interfaces/CancelToken";

import BusClockCallback from "src/framework/types/BusClockCallback";

export default interface BusClock {
  interval(cancelToken: CancelToken, busClockCallback: BusClockCallback): Promise<void>;
}
