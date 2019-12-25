// @flow

import type { CancelToken } from "../interfaces/CancelToken";

export interface JSONRPCMessageHandler {
  useMessageHandler(CancelToken): $PropertyType<DedicatedWorkerGlobalScope, "onmessage">;
}
