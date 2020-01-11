import { JSONRPCParams } from "./JSONRPCParams";
import { JSONRPCVersion } from "./JSONRPCVersion";

export type JSONRPCPromiseResponseObjectified<T> = {
  readonly id: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly method: string;
  readonly result: T;
  readonly type: "promise";
};
