import JSONRPCParams from "src/framework/types/JSONRPCParams";
import JSONRPCVersion from "src/framework/types/JSONRPCVersion";

type JSONRPCPromiseResponseObjectified<T> = {
  readonly id: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly method: string;
  readonly result: T;
  readonly type: "promise";
};

export default JSONRPCPromiseResponseObjectified;
