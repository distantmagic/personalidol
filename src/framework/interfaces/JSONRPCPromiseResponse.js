// @flow

import type { JSONRPCPromiseResponseObjectified } from "../types/JSONRPCPromiseResponseObjectified";
import type { JSONRPCResponse } from "./JSONRPCResponse";

export interface JSONRPCPromiseResponse<T> extends JSONRPCResponse<T, JSONRPCPromiseResponseObjectified<T>> {
  getType(): "promise";
}
