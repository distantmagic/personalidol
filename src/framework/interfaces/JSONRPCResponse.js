// @flow

import type { JSONRPCMessage } from "./JSONRPCMessage";

export interface JSONRPCResponse<T> extends JSONRPCMessage {
  getResult(): T;

  isRequest(): false;

  isResponse(): true;
}
