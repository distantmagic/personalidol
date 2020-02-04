import JSONRPCResponse from "src/framework/classes/JSONRPCResponse";
import JSONRPCResponseData from "src/framework/classes/JSONRPCResponseData";
import { default as JSONRPCException } from "src/framework/classes/Exception/JSONRPC";

import JSONRPCMessageType from "src/framework/enums/JSONRPCMessageType";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IJSONRPCGeneratorChunkResponse } from "src/framework/interfaces/JSONRPCGeneratorChunkResponse";
import { default as IJSONRPCResponseData } from "src/framework/interfaces/JSONRPCResponseData";

import JSONRPCGeneratorChunkResponseObjectified from "src/framework/types/JSONRPCGeneratorChunkResponseObjectified";

export function unobjectify<T>(loggerBreadcrumbs: LoggerBreadcrumbs, objectified: JSONRPCGeneratorChunkResponseObjectified<T>): IJSONRPCGeneratorChunkResponse<T> {
  return new JSONRPCGeneratorChunkResponse<T>(
    loggerBreadcrumbs,
    objectified.id,
    objectified.head,
    objectified.chunk,
    objectified.next,
    objectified.method,
    objectified.type,
    new JSONRPCResponseData<T>(objectified.result)
  );
}

export default class JSONRPCGeneratorChunkResponse<T> extends JSONRPCResponse<T, JSONRPCGeneratorChunkResponseObjectified<T>>
  implements HasLoggerBreadcrumbs, IJSONRPCGeneratorChunkResponse<T> {
  readonly chunk: string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly head: string;
  private next: null | string;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    id: string,
    head: string,
    chunk: string,
    next: null | string,
    method: string,
    type: JSONRPCMessageType,
    data: IJSONRPCResponseData<T>
  ) {
    super(id, method, data);

    if ("generator" !== type) {
      throw new JSONRPCException(loggerBreadcrumbs, "Expected 'generator' type. Got something else");
    }

    this.chunk = chunk;
    this.head = head;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.next = next;
  }

  asObject(): JSONRPCGeneratorChunkResponseObjectified<T> {
    return {
      chunk: this.getChunk(),
      head: this.getHead(),
      id: this.getId(),
      jsonrpc: "2.0-x-personalidol",
      method: this.getMethod(),
      next: this.hasNext() ? this.getNext() : null,
      result: this.getData().getResult(),
      type: this.getType(),
    };
  }

  getHead(): string {
    return this.head;
  }

  getChunk(): string {
    return this.chunk;
  }

  getNext(): string {
    const next = this.next;

    if ("string" !== typeof next) {
      throw new JSONRPCException(this.loggerBreadcrumbs.add("getNext"), "Next is not defined but it was expected.");
    }

    return next;
  }

  getType(): JSONRPCMessageType.Generator {
    return JSONRPCMessageType.Generator;
  }

  hasNext(): boolean {
    return "string" === typeof this.next;
  }

  isHead(): boolean {
    return this.getHead() === this.getChunk();
  }

  setNext(next: string): void {
    this.next = next;
  }
}
