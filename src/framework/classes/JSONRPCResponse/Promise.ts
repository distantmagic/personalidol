import JSONRPCResponse from "src/framework/classes/JSONRPCResponse";
import JSONRPCResponseData from "src/framework/classes/JSONRPCResponseData";
import { default as JSONRPCException } from "src/framework/classes/Exception/JSONRPC";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IJSONRPCPromiseResponse } from "src/framework/interfaces/JSONRPCPromiseResponse";
import { default as IJSONRPCResponseData } from "src/framework/interfaces/JSONRPCResponseData";

import JSONRPCMessageType from "src/framework/types/JSONRPCMessageType";
import JSONRPCPromiseResponseObjectified from "src/framework/types/JSONRPCPromiseResponseObjectified";

export function unobjectify<T>(loggerBreadcrumbs: LoggerBreadcrumbs, objectified: JSONRPCPromiseResponseObjectified<T>): IJSONRPCPromiseResponse<T> {
  return new JSONRPCPromiseResponse<T>(loggerBreadcrumbs, objectified.id, objectified.method, objectified.type, new JSONRPCResponseData(objectified.result));
}

export default class JSONRPCPromiseResponse<T> extends JSONRPCResponse<T, JSONRPCPromiseResponseObjectified<T>> implements IJSONRPCPromiseResponse<T> {
  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, id: string, method: string, type: JSONRPCMessageType, data: IJSONRPCResponseData<T>) {
    super(id, method, data);

    if ("promise" !== type) {
      throw new JSONRPCException(loggerBreadcrumbs, "Expected 'promise' type. Got something else");
    }
  }

  asObject(): JSONRPCPromiseResponseObjectified<T> {
    return {
      id: this.getId(),
      jsonrpc: "2.0-x-personalidol",
      method: this.getMethod(),
      result: this.getData().getResult(),
      type: this.getType(),
    };
  }

  getType(): "promise" {
    return "promise";
  }
}
