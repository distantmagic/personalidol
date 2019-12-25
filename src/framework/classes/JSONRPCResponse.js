// @flow

import type { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import type { JSONRPCResponse as JSONRPCResponseInterface } from "../interfaces/JSONRPCResponse";

export default class JSONRPCResponse<T> implements JSONRPCResponseInterface<T> {
  +id: string;
  +method: string;
  +result: T;

  constructor(id: string, method: string, result: T) {
    this.id = id;
    this.method = method;
    this.result = result;
  }

  getId(): string {
    return this.id;
  }

  getMethod(): string {
    return this.method;
  }

  getResult(): T {
    return this.result;
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

  serialize(): string {
    throw new Error("Not yet implemented.");
  }
}
