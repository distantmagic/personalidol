import JSONRPCMessageType from "src/framework/types/JSONRPCMessageType";
import JSONRPCVersion from "src/framework/types/JSONRPCVersion";

type JSONRPCRequestObjectified<T> = {
  readonly id: string;
  readonly method: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly params: T;
  readonly type: JSONRPCMessageType;
};

export default JSONRPCRequestObjectified;
