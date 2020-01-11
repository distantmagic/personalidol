import { JSONRPCMessageType } from "./JSONRPCMessageType";
import { JSONRPCVersion } from "./JSONRPCVersion";

export type JSONRPCErrorResponseObjectified<T> = {
  readonly id: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly method: string;
  readonly result: T;
  readonly type: "error";
};
