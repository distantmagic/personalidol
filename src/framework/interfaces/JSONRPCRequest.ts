// @flow strict

import type { JSONRPCMessage } from "./JSONRPCMessage";
import type { JSONRPCParams } from "../types/JSONRPCParams";
import type { JSONRPCRequestObjectified } from "../types/JSONRPCRequestObjectified";

export interface JSONRPCRequest extends JSONRPCMessage<JSONRPCRequestObjectified> {
  getParams(): JSONRPCParams;

  isRequest(): true;

  isResponse(): false;
}
