// @flow strict

import type { JSONRPCRequest } from "./JSONRPCRequest";
import type { JSONRPCResponseData } from "./JSONRPCResponseData";

export interface JSONRPCServerGeneratorBuffer<T> {
  add(JSONRPCRequest, JSONRPCResponseData<T>): void;

  flushRemaining(JSONRPCRequest): void;
}
