import JSONRPCMessage from "src/framework/interfaces/JSONRPCMessage";
import JSONRPCResponseData from "src/framework/interfaces/JSONRPCResponseData";

import JSONRPCRequestObjectified from "src/framework/types/JSONRPCRequestObjectified";

export default interface JSONRPCRequest<T> extends JSONRPCMessage<JSONRPCRequestObjectified<T>> {
  getParams(): JSONRPCResponseData<T>;

  isRequest(): true;

  isResponse(): false;
}
