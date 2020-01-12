import { JSONRPCMessageType } from "src/framework/types/JSONRPCMessageType";
import { JSONRPCVersion } from "src/framework/types/JSONRPCVersion";

export type JSONRPCErrorResponseObjectified<T> = {
  readonly id: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly method: string;
  readonly result: T;
  readonly type: "error";
};
