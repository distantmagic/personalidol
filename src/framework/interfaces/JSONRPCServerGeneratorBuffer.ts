import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";
import JSONRPCResponseData from "src/framework/interfaces/JSONRPCResponseData";

export default interface JSONRPCServerGeneratorBuffer<T, U> {
  add(request: JSONRPCRequest<T>, responseData: JSONRPCResponseData<U>): void;

  flushRemaining(request: JSONRPCRequest<T>): void;
}
