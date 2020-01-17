import JSONRPCResponse from "src/framework/classes/JSONRPCResponse";
import JSONRPCResponseData from "src/framework/classes/JSONRPCResponseData";
import { default as JSONRPCException } from "src/framework/classes/Exception/JSONRPC";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IJSONRPCErrorResponse } from "src/framework/interfaces/JSONRPCErrorResponse";
import { default as IJSONRPCResponseData } from "src/framework/interfaces/JSONRPCResponseData";

import JSONRPCErrorResponseObjectified from "src/framework/types/JSONRPCErrorResponseObjectified";
import JSONRPCMessageType from "src/framework/types/JSONRPCMessageType";

export function unobjectify<T>(loggerBreadcrumbs: LoggerBreadcrumbs, objectified: JSONRPCErrorResponseObjectified<T>): IJSONRPCErrorResponse<T> {
  return new JSONRPCErrorResponse<T>(loggerBreadcrumbs, objectified.id, objectified.method, objectified.type, new JSONRPCResponseData(objectified.result));
}

export default class JSONRPCErrorResponse<T> extends JSONRPCResponse<T, JSONRPCErrorResponseObjectified<T>> implements IJSONRPCErrorResponse<T> {
  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, id: string, method: string, type: JSONRPCMessageType, data: IJSONRPCResponseData<T>) {
    super(id, method, data);

    if ("error" !== type) {
      throw new JSONRPCException(loggerBreadcrumbs, "Expected 'error' type. Got something else");
    }
  }

  asObject(): JSONRPCErrorResponseObjectified<T> {
    return {
      id: this.getId(),
      jsonrpc: "2.0-x-personalidol",
      method: this.getMethod(),
      result: this.getData().getResult(),
      type: this.getType(),
    };
  }

  getType(): "error" {
    return "error";
  }
}
