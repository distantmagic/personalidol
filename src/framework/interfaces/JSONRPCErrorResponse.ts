// @flow strict

import type { JSONRPCErrorResponseObjectified } from "../types/JSONRPCErrorResponseObjectified";
import type { JSONRPCResponse } from "./JSONRPCResponse";

export interface JSONRPCErrorResponse<T> extends JSONRPCResponse<T, JSONRPCErrorResponseObjectified<T>> {
  getType(): "error";
}
