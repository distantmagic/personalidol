import JSONRPCResponse from "src/framework/classes/JSONRPCResponse";
import JSONRPCResponseData from "src/framework/classes/JSONRPCResponseData";
import { default as JSONRPCException } from "src/framework/classes/Exception/JSONRPC";

import { JSONRPCMessageType } from "src/framework/types/JSONRPCMessageType";
import { JSONRPCPromiseResponse as JSONRPCPromiseResponseInterface } from "src/framework/interfaces/JSONRPCPromiseResponse";
import { JSONRPCPromiseResponseObjectified } from "src/framework/types/JSONRPCPromiseResponseObjectified";
import { JSONRPCResponseData as JSONRPCResponseDataInterface } from "src/framework/interfaces/JSONRPCResponseData";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

export function unobjectify<T>(loggerBreadcrumbs: LoggerBreadcrumbs, objectified: JSONRPCPromiseResponseObjectified<T>): JSONRPCPromiseResponseInterface<T> {
  return new JSONRPCPromiseResponse<T>(loggerBreadcrumbs, objectified.id, objectified.method, objectified.type, new JSONRPCResponseData(objectified.result));
}

export default class JSONRPCPromiseResponse<T> extends JSONRPCResponse<T, JSONRPCPromiseResponseObjectified<T>> implements JSONRPCPromiseResponseInterface<T> {
  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, id: string, method: string, type: JSONRPCMessageType, data: JSONRPCResponseDataInterface<T>) {
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
