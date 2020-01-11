// @flow strict

import JSONRPCResponse from "../JSONRPCResponse";
import JSONRPCResponseData from "../JSONRPCResponseData";
import { default as JSONRPCException } from "../Exception/JSONRPC";

import type { JSONRPCMessageType } from "../../types/JSONRPCMessageType";
import type { JSONRPCPromiseResponse as JSONRPCPromiseResponseInterface } from "../../interfaces/JSONRPCPromiseResponse";
import type { JSONRPCPromiseResponseObjectified } from "../../types/JSONRPCPromiseResponseObjectified";
import type { JSONRPCResponseData as JSONRPCResponseDataInterface } from "../../interfaces/JSONRPCResponseData";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { UnobjectifyCallback } from "../../types/UnobjectifyCallback";

export default class JSONRPCPromiseResponse<T> extends JSONRPCResponse<T, JSONRPCPromiseResponseObjectified<T>> implements JSONRPCPromiseResponseInterface<T> {
  static unobjectify: UnobjectifyCallback<JSONRPCPromiseResponseObjectified<T>, JSONRPCPromiseResponseInterface<T>> = function(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    objectified: JSONRPCPromiseResponseObjectified<T>
  ): JSONRPCPromiseResponseInterface<T> {
    return new JSONRPCPromiseResponse<T>(loggerBreadcrumbs, objectified.id, objectified.method, objectified.type, new JSONRPCResponseData(objectified.result));
  };

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
