import * as THREE from "three";

import { default as JSONRPCGeneratorChunkResponse } from "./JSONRPCResponse/GeneratorChunk";

import { JSONRPCGeneratorChunkResponse as JSONRPCGeneratorChunkResponseInterface } from "../interfaces/JSONRPCGeneratorChunkResponse";
import { JSONRPCRequest as JSONRPCRequestInterface } from "../interfaces/JSONRPCRequest";
import { JSONRPCResponseData } from "../interfaces/JSONRPCResponseData";
import { JSONRPCServerGeneratorBuffer as JSONRPCServerGeneratorBufferInterface } from "../interfaces/JSONRPCServerGeneratorBuffer";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

type OnMessageReadyCallback<T> = (response: JSONRPCGeneratorChunkResponseInterface<T>) => any;

export default class JSONRPCServerGeneratorBuffer<T> implements JSONRPCServerGeneratorBufferInterface<T> {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly onMessageReady: OnMessageReadyCallback<T>;
  private headChunkId: null | string = null;
  // buffer one response to produce chain of messages
  // order of message is not guaranteed sometimes
  private previous: null | JSONRPCGeneratorChunkResponseInterface<T> = null;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, onMessageReady: OnMessageReadyCallback<T>) {
    this.headChunkId = null;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.onMessageReady = onMessageReady;
  }

  add(request: JSONRPCRequestInterface, responseDataChunk: JSONRPCResponseData<T>): void {
    const currentChunkId = THREE.Math.generateUUID();
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

  flushRemaining(request: JSONRPCRequestInterface): void {
    const previous = this.previous;

    if (previous) {
      // send the last one and turn off the light :)
      this.onMessageReady(previous);
    }
  }
}
