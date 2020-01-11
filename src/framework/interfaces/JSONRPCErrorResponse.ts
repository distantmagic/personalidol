import { JSONRPCErrorResponseObjectified } from "../types/JSONRPCErrorResponseObjectified";
import { JSONRPCResponse } from "./JSONRPCResponse";

export interface JSONRPCErrorResponse<T> extends JSONRPCResponse<T, JSONRPCErrorResponseObjectified<T>> {
  getType(): "error";
}
