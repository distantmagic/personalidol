// @flow

import type { JSONRPCResponse } from "./JSONRPCResponse";

export interface JSONRPCPromiseResponse<T> extends JSONRPCResponse<T> {
  getType(): "promise";
}
