import { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import { JSONRPCResponse as JSONRPCResponseInterface } from "../interfaces/JSONRPCResponse";
import { JSONRPCResponseData } from "../interfaces/JSONRPCResponseData";

export default class JSONRPCResponse<T, U extends Object> implements JSONRPCResponseInterface<T, U> {
  readonly data: JSONRPCResponseData<T>;
  readonly id: string;
  readonly method: string;

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
