import JSONRPCMessageType from "src/framework/enums/JSONRPCMessageType";

import JSONRPCVersion from "src/framework/types/JSONRPCVersion";

type JSONRPCPromiseResponseObjectified<T> = {
  readonly id: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly method: string;
  readonly result: T;
  readonly type: JSONRPCMessageType.Promise;
};

export default JSONRPCPromiseResponseObjectified;
