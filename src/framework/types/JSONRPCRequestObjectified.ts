import { JSONRPCMessageType } from "./JSONRPCMessageType";
import { JSONRPCParams } from "./JSONRPCParams";
import { JSONRPCVersion } from "./JSONRPCVersion";

export type JSONRPCRequestObjectified = {
  readonly id: string;
  readonly method: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly params: JSONRPCParams;
  readonly type: JSONRPCMessageType;
};
