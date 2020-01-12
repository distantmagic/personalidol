import { JSONRPCParams } from "src/framework/types/JSONRPCParams";
import { JSONRPCVersion } from "src/framework/types/JSONRPCVersion";

export type JSONRPCPromiseResponseObjectified<T> = {
  readonly id: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly method: string;
  readonly result: T;
  readonly type: "promise";
};
