import { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import { JSONRPCResponse as JSONRPCResponseInterface } from "../interfaces/JSONRPCResponse";
import { JSONRPCResponseData } from "../interfaces/JSONRPCResponseData";

export default abstract class JSONRPCResponse<T, U extends Object> implements JSONRPCResponseInterface<T, U> {
  readonly data: JSONRPCResponseData<T>;
  readonly id: string;
  readonly method: string;

  abstract asObject(): U;

  abstract getType(): JSONRPCMessageType;

  constructor(id: string, method: string, data: JSONRPCResponseData<T>) {
    this.data = data;
    this.id = id;
    this.method = method;
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

  isRequest(): false {
    return false;
  }

  isResponse(): true {
    return true;
  }
}
