// @flow

import type { JSONRPCParams } from "./JSONRPCParams";
import type { JSONRPCVersion } from "./JSONRPCVersion";

export type JSONRPCPromiseResponseObjectified<T> = {|
  +id: string,
  +jsonrpc: JSONRPCVersion,
  +method: string,
  +result: T,
  +type: "promise",
|};
