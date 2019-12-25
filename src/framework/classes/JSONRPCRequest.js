// @flow

import isJsonRpcMessageType from "../helpers/isJsonRpcMessageType";
import { default as JSONRPCException } from "./Exception/JSONRPC";

import type { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import type { JSONRPCParams } from "../types/JSONRPCParams";
import type { JSONRPCRequest as JSONRPCRequestInterface } from "../interfaces/JSONRPCRequest";
import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";
import type { UnserializerCallback } from "../types/UnserializerCallback";

export default class JSONRPCRequest implements JSONRPCRequestInterface {
  +id: string;
  +method: string;
  +params: JSONRPCParams;
  +type: JSONRPCMessageType;

  static unserialize: UnserializerCallback<JSONRPCRequestInterface> = function(loggerBreadcrumbs: LoggerBreadcrumbsInterface, serialized: string): JSONRPCRequestInterface {
    const { id, method, type, params } = JSON.parse(serialized);

    if ("string" !== typeof id) {
      throw new JSONRPCException(loggerBreadcrumbs, `"id": expected 'string', got something else: "${id}"`);
    }

    if ("string" !== typeof method) {
      throw new JSONRPCException(loggerBreadcrumbs, `"method": expected 'string', got something else: "${id}"`);
    }

    if (!isJsonRpcMessageType(type)) {
      throw new JSONRPCException(loggerBreadcrumbs, `"type": expected JSONRPCMessageType, got something else: "${id}"`);
    }

    if (!Array.isArray(params)) {
      throw new JSONRPCException(loggerBreadcrumbs, `"params": expected 'array', got something else: "${id}"`);
    }

    return new JSONRPCRequest(id, method, type, params);
  };

  constructor(id: string, method: string, type: JSONRPCMessageType, params: JSONRPCParams) {
    this.id = id;
    this.method = method;
    this.params = params;
    this.type = type;
  }

  getId(): string {
    return this.id;
  }

  getMethod(): string {
    return this.method;
  }

  getParams(): JSONRPCParams {
    return this.params;
  }

  getType(): JSONRPCMessageType {
    return this.type;
  }

  isRequest(): true {
    return true;
  }

  isResponse(): false {
    return false;
  }

  serialize(): string {
    return JSON.stringify({
      id: this.getId(),
      jsonrpc: "2.0-x-personalidol",
      method: this.getMethod(),
      params: this.getParams(),
      type: this.getType(),
    });
  }
}
