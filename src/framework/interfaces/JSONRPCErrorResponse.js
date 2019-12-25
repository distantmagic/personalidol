// @flow

import type { JSONRPCResponse } from "./JSONRPCResponse";

export interface JSONRPCErrorResponse<T> extends JSONRPCResponse<T> {
  getType(): "error";
}
