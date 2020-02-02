import * as THREE from "three";

import { default as JSONRPCGeneratorChunkResponse } from "src/framework/classes/JSONRPCResponse/GeneratorChunk";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import JSONRPCResponseData from "src/framework/interfaces/JSONRPCResponseData";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IJSONRPCGeneratorChunkResponse } from "src/framework/interfaces/JSONRPCGeneratorChunkResponse";
import { default as IJSONRPCRequest } from "src/framework/interfaces/JSONRPCRequest";
import { default as IJSONRPCServerGeneratorBuffer } from "src/framework/interfaces/JSONRPCServerGeneratorBuffer";

type OnMessageReadyCallback<T> = (response: IJSONRPCGeneratorChunkResponse<T>) => any;

export default class JSONRPCServerGeneratorBuffer<T> implements HasLoggerBreadcrumbs, IJSONRPCServerGeneratorBuffer<T> {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly onMessageReady: OnMessageReadyCallback<T>;
  private headChunkId: null | string = null;
  // buffer one response to produce chain of messages
  // order of message is not guaranteed sometimes
  private previous: null | IJSONRPCGeneratorChunkResponse<T> = null;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, onMessageReady: OnMessageReadyCallback<T>) {
    this.headChunkId = null;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.onMessageReady = onMessageReady;
  }

  add(request: IJSONRPCRequest, responseDataChunk: JSONRPCResponseData<T>): void {
    const currentChunkId = THREE.MathUtils.generateUUID();
    const headChunkId = this.headChunkId || currentChunkId;
    const previous = this.previous;

    if (!this.headChunkId) {
      this.headChunkId = headChunkId;
    }

    // prettier-ignore
    const currentChunk = new JSONRPCGeneratorChunkResponse<T>(
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

  flushRemaining(request: IJSONRPCRequest): void {
    const previous = this.previous;

    if (previous) {
      // send the last one and turn off the light :)
      this.onMessageReady(previous);
    }
  }
}
