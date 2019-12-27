// @flow

import JSONRPCResponse from "../JSONRPCResponse";
import JSONRPCResponseData from "../JSONRPCResponseData";
import { default as JSONRPCException } from "../Exception/JSONRPC";

import type { JSONRPCGeneratorChunkResponse as JSONRPCGeneratorChunkResponseInterface } from "../../interfaces/JSONRPCGeneratorChunkResponse";
import type { JSONRPCGeneratorChunkResponseObjectified } from "../../types/JSONRPCGeneratorChunkResponseObjectified";
import type { JSONRPCMessageType } from "../../types/JSONRPCMessageType";
import type { JSONRPCResponseData as JSONRPCResponseDataInterface } from "../../interfaces/JSONRPCResponseData";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { UnobjectifyCallback } from "../../types/UnobjectifyCallback";

export default class JSONRPCGeneratorChunkResponse<T> extends JSONRPCResponse<T, JSONRPCGeneratorChunkResponseObjectified<T>> implements JSONRPCGeneratorChunkResponseInterface<T> {
  +chunk: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +head: string;
  next: ?string;

  static unobjectify: UnobjectifyCallback<JSONRPCGeneratorChunkResponseObjectified<T>, JSONRPCGeneratorChunkResponseInterface<T>> = function(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    objectified: JSONRPCGeneratorChunkResponseObjectified<T>
  ): JSONRPCGeneratorChunkResponseInterface<T> {
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
  };

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    id: string,
    head: string,
    chunk: string,
    next: ?string,
    method: string,
    type: JSONRPCMessageType,
    data: JSONRPCResponseDataInterface<T>
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

  getType(): "generator" {
    return "generator";
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
