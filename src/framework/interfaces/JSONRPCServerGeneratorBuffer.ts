import { JSONRPCRequest } from "./JSONRPCRequest";
import { JSONRPCResponseData } from "./JSONRPCResponseData";

export interface JSONRPCServerGeneratorBuffer<T> {
  add(request: JSONRPCRequest, responseData: JSONRPCResponseData<T>): void;

  flushRemaining(request: JSONRPCRequest): void;
}
