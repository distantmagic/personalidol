// @flow

import type { JSONRPCMessageType } from "./JSONRPCMessageType";
import type { JSONRPCParams } from "./JSONRPCParams";
import type { JSONRPCVersion } from "./JSONRPCVersion";

export type JSONRPCRequestObjectified = {|
  +id: string,
  +method: string,
  +jsonrpc: JSONRPCVersion,
  +params: JSONRPCParams,
  +type: JSONRPCMessageType,
|};
