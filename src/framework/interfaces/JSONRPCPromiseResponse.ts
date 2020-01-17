import JSONRPCResponse from "src/framework/interfaces/JSONRPCResponse";

import JSONRPCPromiseResponseObjectified from "src/framework/types/JSONRPCPromiseResponseObjectified";

export default interface JSONRPCPromiseResponse<T> extends JSONRPCResponse<T, JSONRPCPromiseResponseObjectified<T>> {
  getType(): "promise";
}
