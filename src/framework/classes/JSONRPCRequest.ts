import JSONRPCResponseData from "src/framework/classes/JSONRPCResponseData";

import { default as IJSONRPCRequest } from "src/framework/interfaces/JSONRPCRequest";
import { default as IJSONRPCResponseData } from "src/framework/interfaces/JSONRPCResponseData";
import { default as ILoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

import JSONRPCMessageType from "src/framework/types/JSONRPCMessageType";
import JSONRPCRequestObjectified from "src/framework/types/JSONRPCRequestObjectified";

export function unobjectify<T>(loggerBreadcrumbs: ILoggerBreadcrumbs, objectified: JSONRPCRequestObjectified<T>): IJSONRPCRequest<T> {
  return new JSONRPCRequest<T>(objectified.id, objectified.method, objectified.type, new JSONRPCResponseData<T>(objectified.params));
}

export default class JSONRPCRequest<T> implements IJSONRPCRequest<T> {
  readonly id: string;
  readonly method: string;
  readonly params: IJSONRPCResponseData<T>;
  readonly type: JSONRPCMessageType;

  constructor(id: string, method: string, type: JSONRPCMessageType, params: IJSONRPCResponseData<T>) {
    this.id = id;
    this.method = method;
    this.params = params;
    this.type = type;
  }

  asObject(): JSONRPCRequestObjectified<T> {
    return {
      id: this.getId(),
      jsonrpc: "2.0-x-personalidol",
      method: this.getMethod(),
      params: this.getParams().getResult(),
      type: this.getType(),
    };
  }

  getId(): string {
    return this.id;
  }

  getMethod(): string {
    return this.method;
  }

  getParams(): IJSONRPCResponseData<T> {
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
