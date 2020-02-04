import JSONRPCMessageType from "src/framework/enums/JSONRPCMessageType";

import JSONRPCResponse from "src/framework/interfaces/JSONRPCResponse";

import JSONRPCErrorResponseObjectified from "src/framework/types/JSONRPCErrorResponseObjectified";

export default interface JSONRPCErrorResponse<T> extends JSONRPCResponse<T, JSONRPCErrorResponseObjectified<T>> {
  getType(): JSONRPCMessageType.Error;
}
