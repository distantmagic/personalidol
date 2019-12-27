// @flow

import type { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import type { JSONRPCResponse as JSONRPCResponseInterface } from "../interfaces/JSONRPCResponse";
import type { JSONRPCResponseData } from "../interfaces/JSONRPCResponseData";

export default class JSONRPCResponse<T, U: {}> implements JSONRPCResponseInterface<T, U> {
  +data: JSONRPCResponseData<T>;
  +id: string;
  +method: string;

  constructor(id: string, method: string, data: JSONRPCResponseData<T>) {
    this.data = data;
    this.id = id;
    this.method = method;
  }

  asObject(): U {
    throw new Error("Not yet implemented.");
  }

  getData(): JSONRPCResponseData<T> {
    return this.data;
  }

  getId(): string {
    return this.id;
  }

  getMethod(): string {
    return this.method;
  }

  getType(): JSONRPCMessageType {
    throw new Error("Not yet implemented.");
  }

  isRequest(): false {
    return false;
  }

  isResponse(): true {
    return true;
  }
}
