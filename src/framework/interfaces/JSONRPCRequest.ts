import { JSONRPCMessage } from "./JSONRPCMessage";
import { JSONRPCParams } from "../types/JSONRPCParams";
import { JSONRPCRequestObjectified } from "../types/JSONRPCRequestObjectified";

export interface JSONRPCRequest extends JSONRPCMessage<JSONRPCRequestObjectified> {
  getParams(): JSONRPCParams;

  isRequest(): true;

  isResponse(): false;
}
