import * as THREE from "three";

import { default as JSONRPCGeneratorChunkResponse } from "src/framework/classes/JSONRPCResponse/GeneratorChunk";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import JSONRPCResponseData from "src/framework/interfaces/JSONRPCResponseData";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IJSONRPCGeneratorChunkResponse } from "src/framework/interfaces/JSONRPCGeneratorChunkResponse";
import { default as IJSONRPCRequest } from "src/framework/interfaces/JSONRPCRequest";
import { default as IJSONRPCServerGeneratorBuffer } from "src/framework/interfaces/JSONRPCServerGeneratorBuffer";

type OnMessageReadyCallback<U> = (response: IJSONRPCGeneratorChunkResponse<U>) => any;

export default class JSONRPCServerGeneratorBuffer<T, U> implements HasLoggerBreadcrumbs, IJSONRPCServerGeneratorBuffer<T, U> {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly onMessageReady: OnMessageReadyCallback<U>;
  private headChunkId: null | string = null;
  // buffer one response to produce chain of messages
  // order of message is not guaranteed sometimes
  private previous: null | IJSONRPCGeneratorChunkResponse<U> = null;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, onMessageReady: OnMessageReadyCallback<U>) {
    this.headChunkId = null;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.onMessageReady = onMessageReady;
  }

  add(request: IJSONRPCRequest<T>, responseDataChunk: JSONRPCResponseData<U>): void {
    const currentChunkId = THREE.MathUtils.generateUUID();
    const headChunkId = this.headChunkId || currentChunkId;
    const previous = this.previous;

    if (!this.headChunkId) {
      this.headChunkId = headChunkId;
    }

    // prettier-ignore
    const currentChunk = new JSONRPCGeneratorChunkResponse<U>(
      this.loggerBreadcrumbs.add("add"),
      request.getId(),
      headChunkId,
      currentChunkId,
      null,
      request.getMethod(),
      request.getType(),
      responseDataChunk
    );

    if (previous) {
      previous.setNext(currentChunkId);
      this.onMessageReady(previous);
    }

    this.previous = currentChunk;
  }

  flushRemaining<U>(request: IJSONRPCRequest<U>): void {
    const previous = this.previous;

    if (previous) {
      // send the last one and turn off the light :)
      this.onMessageReady(previous);
    }
  }
}
