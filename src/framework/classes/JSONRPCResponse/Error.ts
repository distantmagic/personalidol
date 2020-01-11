import JSONRPCResponse from "../JSONRPCResponse";
import JSONRPCResponseData from "../JSONRPCResponseData";
import { default as JSONRPCException } from "../Exception/JSONRPC";

import { JSONRPCErrorResponse as JSONRPCErrorResponseInterface } from "../../interfaces/JSONRPCErrorResponse";
import { JSONRPCErrorResponseObjectified } from "../../types/JSONRPCErrorResponseObjectified";
import { JSONRPCMessageType } from "../../types/JSONRPCMessageType";
import { JSONRPCResponseData as JSONRPCResponseDataInterface } from "../../interfaces/JSONRPCResponseData";
import { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export function unobjectify<T>(loggerBreadcrumbs: LoggerBreadcrumbs, objectified: JSONRPCErrorResponseObjectified<T>): JSONRPCErrorResponseInterface<T> {
  return new JSONRPCErrorResponse<T>(loggerBreadcrumbs, objectified.id, objectified.method, objectified.type, new JSONRPCResponseData(objectified.result));
}

export default class JSONRPCErrorResponse<T> extends JSONRPCResponse<T, JSONRPCErrorResponseObjectified<T>> implements JSONRPCErrorResponseInterface<T> {
  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, id: string, method: string, type: JSONRPCMessageType, data: JSONRPCResponseDataInterface<T>) {
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
