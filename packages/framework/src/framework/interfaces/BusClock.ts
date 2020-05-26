import type AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import type CancelToken from "src/framework/interfaces/CancelToken";

import type BusClockCallback from "src/framework/types/BusClockCallback";

export default interface BusClock extends AnimatableUpdatable {
  interval(cancelToken: CancelToken, busClockCallback: BusClockCallback): Promise<void>;
}
