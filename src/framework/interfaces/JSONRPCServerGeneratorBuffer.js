// @flow

import type { JSONRPCRequest } from "./JSONRPCRequest";

export interface JSONRPCServerGeneratorBuffer<T> {
  add(JSONRPCRequest, T): void;

  flushRemaining(JSONRPCRequest): void;
}
