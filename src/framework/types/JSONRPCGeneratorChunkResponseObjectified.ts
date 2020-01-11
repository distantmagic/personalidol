// @flow strict

import type { JSONRPCVersion } from "./JSONRPCVersion";

export type JSONRPCGeneratorChunkResponseObjectified<T> = {|
  +chunk: string,
  +head: string,
  +id: string,
  +jsonrpc: JSONRPCVersion,
  +method: string,
  +next: ?string,
  +result: T,
  +type: "generator",
|};
