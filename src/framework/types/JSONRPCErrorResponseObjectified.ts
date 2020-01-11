// @flow strict

import type { JSONRPCMessageType } from "./JSONRPCMessageType";
import type { JSONRPCVersion } from "./JSONRPCVersion";

export type JSONRPCErrorResponseObjectified<T> = {|
  +id: string,
  +jsonrpc: JSONRPCVersion,
  +method: string,
  +result: T,
  +type: "error",
|};
