// @flow

import type { JSONRPCMessage } from "./JSONRPCMessage";
import type { JSONRPCParams } from "../types/JSONRPCParams";

export interface JSONRPCRequest extends JSONRPCMessage {
  getParams(): JSONRPCParams;

  isRequest(): true;

  isResponse(): false;
}
