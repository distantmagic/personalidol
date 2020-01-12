import { CancelToken } from "src/framework/interfaces/CancelToken";

export interface ClockReactiveController {
  interval(cancelToken: CancelToken): Promise<void>;
}
