// @flow strict

import type { JSONRPCMessage } from "./JSONRPCMessage";
import type { JSONRPCResponseData } from "./JSONRPCResponseData";

export interface JSONRPCResponse<T, U: {}> extends JSONRPCMessage<U> {
  getData(): JSONRPCResponseData<T>;

  isRequest(): false;

  isResponse(): true;
}
