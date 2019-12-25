// @flow

import JSONRPCResponse from "../JSONRPCResponse";
import { default as JSONRPCException } from "../Exception/JSONRPC";

import type { JSONRPCMessageType } from "../../types/JSONRPCMessageType";
import type { JSONRPCErrorResponse as JSONRPCErrorResponseInterface } from "../../interfaces/JSONRPCErrorResponse";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { UnserializerCallback } from "../../types/UnserializerCallback";

export default class JSONRPCErrorResponse<T> extends JSONRPCResponse<T> implements JSONRPCErrorResponseInterface<T> {
  static unserialize: UnserializerCallback<JSONRPCErrorResponseInterface<T>> = function(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    serialized: string
  ): JSONRPCErrorResponseInterface<T> {
    const { id, method, type, result } = JSON.parse(serialized);

    return new JSONRPCErrorResponse<T>(loggerBreadcrumbs, id, method, type, result);
  };

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, id: string, method: string, type: JSONRPCMessageType, result: T) {
    super(id, method, result);

    if ("error" !== type) {
      throw new JSONRPCException(loggerBreadcrumbs, "Expected 'error' type. Got something else");
    }
  }

  getType(): "error" {
    return "error";
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
