import { CancelToken } from "./CancelToken";

export interface ClockReactiveController {
  interval(cancelToken: CancelToken): Promise<void>;
}
