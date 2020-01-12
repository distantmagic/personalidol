import { JSONRPCErrorResponseObjectified } from "src/framework/types/JSONRPCErrorResponseObjectified";
import { JSONRPCResponse } from "src/framework/interfaces/JSONRPCResponse";

export interface JSONRPCErrorResponse<T> extends JSONRPCResponse<T, JSONRPCErrorResponseObjectified<T>> {
  getType(): "error";
}
