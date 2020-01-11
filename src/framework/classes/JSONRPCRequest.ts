import { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import { JSONRPCParams } from "../types/JSONRPCParams";
import { JSONRPCRequest as JSONRPCRequestInterface } from "../interfaces/JSONRPCRequest";
import { JSONRPCRequestObjectified } from "../types/JSONRPCRequestObjectified";
import { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";

export function unobjectify(loggerBreadcrumbs: LoggerBreadcrumbsInterface, objectified: JSONRPCRequestObjectified): JSONRPCRequestInterface {
  return new JSONRPCRequest(objectified.id, objectified.method, objectified.type, objectified.params);
}

export default class JSONRPCRequest implements JSONRPCRequestInterface {
  readonly id: string;
  readonly method: string;
  readonly params: JSONRPCParams;
  readonly type: JSONRPCMessageType;

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
