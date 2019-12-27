// @flow

import type { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import type { JSONRPCParams } from "../types/JSONRPCParams";
import type { JSONRPCRequest as JSONRPCRequestInterface } from "../interfaces/JSONRPCRequest";
import type { JSONRPCRequestObjectified } from "../types/JSONRPCRequestObjectified";
import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";
import type { UnobjectifyCallback } from "../types/UnobjectifyCallback";

export default class JSONRPCRequest implements JSONRPCRequestInterface {
  +id: string;
  +method: string;
  +params: JSONRPCParams;
  +type: JSONRPCMessageType;

  static unobjectify: UnobjectifyCallback<JSONRPCRequestObjectified, JSONRPCRequestInterface> = function(
    loggerBreadcrumbs: LoggerBreadcrumbsInterface,
    objectified: JSONRPCRequestObjectified
  ): JSONRPCRequestInterface {
    return new JSONRPCRequest(objectified.id, objectified.method, objectified.type, objectified.params);
  };

  constructor(id: string, method: string, type: JSONRPCMessageType, params: JSONRPCParams) {
    this.id = id;
    this.method = method;
    this.params = params;
    this.type = type;
  }

  asObject(): JSONRPCRequestObjectified {
    return {
      id: this.getId(),
      jsonrpc: "2.0-x-personalidol",
      method: this.getMethod(),
      params: this.getParams(),
      type: this.getType(),
    };
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
}
