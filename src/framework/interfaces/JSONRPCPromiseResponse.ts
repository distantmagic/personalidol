import { JSONRPCPromiseResponseObjectified } from "../types/JSONRPCPromiseResponseObjectified";
import { JSONRPCResponse } from "./JSONRPCResponse";

export interface JSONRPCPromiseResponse<T> extends JSONRPCResponse<T, JSONRPCPromiseResponseObjectified<T>> {
  getType(): "promise";
}
