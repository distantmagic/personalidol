// @flow

import uuidv4 from "uuid/v4";

import EventListenerGenerator from "./EventListenerGenerator";
import EventListenerSet from "./EventListenerSet";
import JSONRPCClientGeneratorBuffer from "./JSONRPCClientGeneratorBuffer";
import JSONRPCRequest from "./JSONRPCRequest";
import { default as JSONRPCErrorResponse } from "./JSONRPCResponse/Error";
import { default as JSONRPCException } from "./Exception/JSONRPC";
import { default as JSONRPCGeneratorChunkResponse } from "./JSONRPCResponse/GeneratorChunk";
import { default as JSONRPCPromiseResponse } from "./JSONRPCResponse/Promise";

import type { CancelToken } from "../interfaces/CancelToken";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { JSONRPCClient as JSONRPCClientInterface } from "../interfaces/JSONRPCClient";
import type { JSONRPCErrorResponse as JSONRPCErrorResponseInterface } from "../interfaces/JSONRPCErrorResponse";
import type { JSONRPCGeneratorChunkResponse as JSONRPCGeneratorChunkResponseInterface } from "../interfaces/JSONRPCGeneratorChunkResponse";
import type { JSONRPCParams } from "../types/JSONRPCParams";
import type { JSONRPCPromiseResponse as JSONRPCPromiseResponseInterface } from "../interfaces/JSONRPCPromiseResponse";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class JSONRPCClient implements JSONRPCClientInterface {
  +awaitingGeneratorRequests: Map<string, EventListenerSetInterface<[JSONRPCGeneratorChunkResponseInterface<any>]>>;
  +awaitingPromiseRequests: Map<string, (any) => void>;
  +uuid: () => string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +postMessage: $PropertyType<DedicatedWorkerGlobalScope, "postMessage">;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, postMessage: $PropertyType<DedicatedWorkerGlobalScope, "postMessage">, uuid: () => string = uuidv4) {
    this.awaitingGeneratorRequests = new Map();
    this.awaitingPromiseRequests = new Map();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.postMessage = postMessage;
    this.uuid = uuid;
  }

  async handleErrorResponse<T>(response: JSONRPCErrorResponseInterface<T>): Promise<void> {
    const message = JSON.stringify(response.getResult()) || "";

    throw new JSONRPCException(this.loggerBreadcrumbs.add("handleErrorResponse"), `RPCServer error response: ${message}`);
  }

  async handleGeneratorChunkResponse<T>(response: JSONRPCGeneratorChunkResponseInterface<T>): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("handleGeneratorChunkResponse");
    const responseId = response.getId();
    const generatorHandler = this.awaitingGeneratorRequests.get(responseId);

    if (!generatorHandler) {
      throw new JSONRPCException(breadcrumbs, `Nothing awaited this generator response: "${responseId}"`);
    }
    return generatorHandler.notify([response]);
  }

  async handlePromiseResponse<T>(response: JSONRPCPromiseResponseInterface<T>): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("handlePromiseResponse");
    const responseId = response.getId();
    const promiseHandler = this.awaitingPromiseRequests.get(responseId);

    if (!promiseHandler) {
      throw new JSONRPCException(breadcrumbs, `Nothing awaited this promise response: "${responseId}"`);
    }

    return promiseHandler(response.getResult());
  }

  handleSerializedResponse(response: string): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("handleSerializedResponse");
    const pojo = JSON.parse(response);

    switch (pojo.type) {
      case "error":
        return this.handleErrorResponse(JSONRPCErrorResponse.unserialize(breadcrumbs, response));
      case "generator":
        return this.handleGeneratorChunkResponse(JSONRPCGeneratorChunkResponse.unserialize(breadcrumbs, response));
      case "promise":
        return this.handlePromiseResponse(JSONRPCPromiseResponse.unserialize(breadcrumbs, response));
      default:
        throw new JSONRPCException(breadcrumbs, `Unknown response type: "${pojo.type}"`);
    }
  }

  async *requestGenerator<T>(cancelToken: CancelToken, method: string, params: JSONRPCParams): AsyncGenerator<T, void, void> {
    const requestId = this.uuid();
    const request = new JSONRPCRequest(requestId, method, "generator", params);
    const eventListenerSet = new EventListenerSet();
    const eventListenerGenerator = new EventListenerGenerator(eventListenerSet);
    const responseGenerator = eventListenerGenerator.generate(cancelToken);

    // send message to the server
    this.awaitingGeneratorRequests.set(requestId, eventListenerSet);
    this.postMessage(request.serialize());

    // await response
    const buffer = new JSONRPCClientGeneratorBuffer(this.loggerBreadcrumbs.add("JSONRPCClientGeneratorBuffer"));

    for await (let [response] of responseGenerator) {
      buffer.add(response);

      for (let buffered of buffer.flush()) {
        yield buffered.getResult();
      }

      if (!buffer.isExpectingMore()) {
        return;
      }
    }
  }

  requestPromise<T>(cancelToken: CancelToken, method: string, params: JSONRPCParams): Promise<T> {
    const requestId = this.uuid();
    const request = new JSONRPCRequest(requestId, method, "promise", params);

    // await response
    return new Promise(resolve => {
      this.awaitingPromiseRequests.set(requestId, (result: T) => {
        resolve(result);
        this.awaitingPromiseRequests.delete(requestId);
      });

      // send message to the server
      this.postMessage(request.serialize());
    });
  }

  useMessageHandler(cancelToken: CancelToken): $PropertyType<DedicatedWorkerGlobalScope, "onmessage"> {
    const breadcrumbs = this.loggerBreadcrumbs.add("useMessageHandler");

    return (evt: MessageEvent) => {
      if (cancelToken.isCanceled()) {
        return;
      }

      const data = evt.data;

      if ("string" === typeof data) {
        this.handleSerializedResponse(data);
      } else {
        throw new JSONRPCException(breadcrumbs, "Invalid response.");
      }
    };
  }
}
