import { default as IJSONRPCRequest } from "src/framework/interfaces/JSONRPCRequest";
import { default as ILoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

import JSONRPCMessageType from "src/framework/types/JSONRPCMessageType";
import JSONRPCParams from "src/framework/types/JSONRPCParams";
import JSONRPCRequestObjectified from "src/framework/types/JSONRPCRequestObjectified";

export function unobjectify(loggerBreadcrumbs: ILoggerBreadcrumbs, objectified: JSONRPCRequestObjectified): IJSONRPCRequest {
  return new JSONRPCRequest(objectified.id, objectified.method, objectified.type, objectified.params);
}

export default class JSONRPCRequest implements IJSONRPCRequest {
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
