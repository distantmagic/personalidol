import JSONRPCMessageType from "src/framework/types/JSONRPCMessageType";
import JSONRPCParams from "src/framework/types/JSONRPCParams";
import JSONRPCVersion from "src/framework/types/JSONRPCVersion";

type JSONRPCRequestObjectified = {
  readonly id: string;
  readonly method: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly params: JSONRPCParams;
  readonly type: JSONRPCMessageType;
};

export default JSONRPCRequestObjectified;
