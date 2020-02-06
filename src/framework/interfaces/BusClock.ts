import AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import CancelToken from "src/framework/interfaces/CancelToken";

import BusClockCallback from "src/framework/types/BusClockCallback";

export default interface BusClock extends AnimatableUpdatable {
  interval(cancelToken: CancelToken, busClockCallback: BusClockCallback): Promise<void>;
}
