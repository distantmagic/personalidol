import { JSONRPCPromiseResponseObjectified } from "src/framework/types/JSONRPCPromiseResponseObjectified";
import { JSONRPCResponse } from "src/framework/interfaces/JSONRPCResponse";

export interface JSONRPCPromiseResponse<T> extends JSONRPCResponse<T, JSONRPCPromiseResponseObjectified<T>> {
  getType(): "promise";
}
