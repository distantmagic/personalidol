import { JSONRPCMessage } from "src/framework/interfaces/JSONRPCMessage";
import { JSONRPCResponseData } from "src/framework/interfaces/JSONRPCResponseData";

export interface JSONRPCResponse<T, U extends Object> extends JSONRPCMessage<U> {
  getData(): JSONRPCResponseData<T>;

  isRequest(): false;

  isResponse(): true;
}
