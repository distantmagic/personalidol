import { JSONRPCMessage } from "src/framework/interfaces/JSONRPCMessage";
import { JSONRPCParams } from "src/framework/types/JSONRPCParams";
import { JSONRPCRequestObjectified } from "src/framework/types/JSONRPCRequestObjectified";

export interface JSONRPCRequest extends JSONRPCMessage<JSONRPCRequestObjectified> {
  getParams(): JSONRPCParams;

  isRequest(): true;

  isResponse(): false;
}
