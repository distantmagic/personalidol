// @flow

import JSONRPCResponse from "../JSONRPCResponse";
import { default as JSONRPCException } from "../Exception/JSONRPC";

import type { JSONRPCGeneratorChunkResponse as JSONRPCGeneratorChunkResponseInterface } from "../../interfaces/JSONRPCGeneratorChunkResponse";
import type { JSONRPCMessageType } from "../../types/JSONRPCMessageType";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { UnserializerCallback } from "../../types/UnserializerCallback";

export default class JSONRPCGeneratorChunkResponse<T> extends JSONRPCResponse<T> implements JSONRPCGeneratorChunkResponseInterface<T> {
  +chunk: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +head: string;
  next: ?string;

  static unserialize: UnserializerCallback<JSONRPCGeneratorChunkResponseInterface<T>> = function(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    serialized: string
  ): JSONRPCGeneratorChunkResponseInterface<T> {
    const { id, head, chunk, next, method, type, result } = JSON.parse(serialized);

    return new JSONRPCGeneratorChunkResponse<T>(loggerBreadcrumbs, id, head, chunk, next, method, type, result);
  };

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, id: string, head: string, chunk: string, next: ?string, method: string, type: JSONRPCMessageType, result: T) {
    super(id, method, result);

    if ("generator" !== type) {
      throw new JSONRPCException(loggerBreadcrumbs, "Expected 'generator' type. Got something else");
    }

    this.chunk = chunk;
    this.head = head;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.next = next;
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

  getType(): "generator" {
    return "generator";
  }

  hasNext(): boolean {
    return "string" === typeof this.next;
  }

  isHead(): boolean {
    return this.getHead() === this.getChunk();
  }

  serialize(): string {
    return JSON.stringify({
      chunk: this.getChunk(),
      head: this.getHead(),
      id: this.getId(),
      jsonrpc: "2.0-x-personalidol",
      method: this.getMethod(),
      next: this.hasNext() ? this.getNext() : null,
      result: this.getResult(),
      type: this.getType(),
    });
  }

  setNext(next: string): void {
    this.next = next;
  }
}
