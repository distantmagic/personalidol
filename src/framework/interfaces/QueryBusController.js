// @flow

import type { CancelToken } from "./CancelToken";

export interface QueryBusController {
  interval(CancelToken): Promise<void>;
}
