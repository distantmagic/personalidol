import { JSONRPCMessage } from "./JSONRPCMessage";
import { JSONRPCResponseData } from "./JSONRPCResponseData";

export interface JSONRPCResponse<T, U extends Object> extends JSONRPCMessage<U> {
  getData(): JSONRPCResponseData<T>;

  isRequest(): false;

  isResponse(): true;
}
