// @flow strict

import type { CancelToken } from "./CancelToken";

export interface ClockReactiveController {
  interval(CancelToken): Promise<void>;
}
