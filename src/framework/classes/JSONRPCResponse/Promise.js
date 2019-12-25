// @flow

import JSONRPCResponse from "../JSONRPCResponse";
import { default as JSONRPCException } from "../Exception/JSONRPC";

import type { JSONRPCMessageType } from "../../types/JSONRPCMessageType";
import type { JSONRPCPromiseResponse as JSONRPCPromiseResponseInterface } from "../../interfaces/JSONRPCPromiseResponse";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { UnserializerCallback } from "../../types/UnserializerCallback";

export default class JSONRPCPromiseResponse<T> extends JSONRPCResponse<T> implements JSONRPCPromiseResponseInterface<T> {
  static unserialize: UnserializerCallback<JSONRPCPromiseResponseInterface<T>> = function(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    serialized: string
  ): JSONRPCPromiseResponseInterface<T> {
    const { id, method, type, result } = JSON.parse(serialized);

    return new JSONRPCPromiseResponse<T>(loggerBreadcrumbs, id, method, type, result);
  };

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, id: string, method: string, type: JSONRPCMessageType, result: T) {
    super(id, method, result);

    if ("promise" !== type) {
      throw new JSONRPCException(loggerBreadcrumbs, "Expected 'promise' type. Got something else");
    }
  }

  getType(): "promise" {
    return "promise";
  }

  serialize(): string {
    return JSON.stringify({
      id: this.getId(),
      jsonrpc: "2.0-x-personalidol",
      method: this.getMethod(),
      result: this.getResult(),
      type: this.getType(),
    });
  }
}
