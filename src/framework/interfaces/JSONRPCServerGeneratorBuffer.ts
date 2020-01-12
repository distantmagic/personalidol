import { JSONRPCRequest } from "src/framework/interfaces/JSONRPCRequest";
import { JSONRPCResponseData } from "src/framework/interfaces/JSONRPCResponseData";

export interface JSONRPCServerGeneratorBuffer<T> {
  add(request: JSONRPCRequest, responseData: JSONRPCResponseData<T>): void;

  flushRemaining(request: JSONRPCRequest): void;
}
