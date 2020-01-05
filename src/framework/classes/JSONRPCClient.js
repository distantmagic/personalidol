// @flow

import * as THREE from "three";

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
import type { JSONRPCRequest as JSONRPCRequestInterface } from "../interfaces/JSONRPCRequest";
import type { JSONRPCVersion } from "../types/JSONRPCVersion";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class JSONRPCClient implements JSONRPCClientInterface {
  +awaitingGeneratorRequests: Map<string, EventListenerSetInterface<[JSONRPCGeneratorChunkResponseInterface<any>]>>;
  +awaitingPromiseRequests: Map<string, (any) => void>;
  +uuid: () => string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +postMessage: $PropertyType<DedicatedWorkerGlobalScope, "postMessage">;

  static attachTo(loggerBreadcrumbs: LoggerBreadcrumbs, cancelToken: CancelToken, worker: Worker): JSONRPCClientInterface {
    const jsonRpcClient = new JSONRPCClient(loggerBreadcrumbs, worker.postMessage.bind(worker));

    worker.onmessage = jsonRpcClient.useMessageHandler(cancelToken);

    return jsonRpcClient;
  }

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, postMessage: $PropertyType<DedicatedWorkerGlobalScope, "postMessage">, uuid: () => string = THREE.Math.generateUUID) {
    this.awaitingGeneratorRequests = new Map();
    this.awaitingPromiseRequests = new Map();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.postMessage = postMessage;
    this.uuid = uuid;
  }

  async handleErrorResponse<T>(response: JSONRPCErrorResponseInterface<T>): Promise<void> {
    const message = JSON.stringify(response.getData().getResult()) || "";

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

    return promiseHandler(response.getData().getResult());
  }

  handleSerializedResponse(response: { +[string]: any }): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("handleSerializedResponse");

    const { id, jsonrpc, method, result, type } = response;

    // prettier-ignore
    if ( "string" !== typeof id
      || "2.0-x-personalidol" !== jsonrpc
      || "string" !== typeof method
      || "string" !== typeof type
    ) {
      throw new JSONRPCException(breadcrumbs, "Invalid response.");
    }

    const validated: {|
      +id: string,
      +jsonrpc: JSONRPCVersion,
      +method: string,
      +result: any,
    |} = {
      id: id,
      jsonrpc: jsonrpc,
      method: method,
      result: result,
    };

    switch (type) {
      case "error":
        return this.handleErrorResponse(
          JSONRPCErrorResponse.unobjectify(breadcrumbs, {
            ...validated,
            type: "error",
          })
        );
      case "generator":
        const { chunk, head, next } = response;

        // prettier-ignore
        if ( "string" !== typeof chunk
          || "string" !== typeof head
          || (next && "string" !== typeof next)
        ) {
          throw new JSONRPCException(breadcrumbs, "Invalid generator response.");
        }

        return this.handleGeneratorChunkResponse(
          JSONRPCGeneratorChunkResponse.unobjectify(breadcrumbs, {
            ...validated,
            chunk: chunk,
            head: head,
            next: next,
            type: "generator",
          })
        );
      case "promise":
        return this.handlePromiseResponse(
          JSONRPCPromiseResponse.unobjectify(breadcrumbs, {
            ...validated,
            type: "promise",
          })
        );
      default:
        throw new JSONRPCException(breadcrumbs, `Unknown response type: "${type}"`);
    }
  }

  async *requestGenerator<T>(cancelToken: CancelToken, method: string, params: JSONRPCParams = []): AsyncGenerator<T, void, void> {
    const requestId = this.uuid();
    const request = new JSONRPCRequest(requestId, method, "generator", params);
    const eventListenerSet = new EventListenerSet();
    const eventListenerGenerator = new EventListenerGenerator(eventListenerSet);
    const responseGenerator = eventListenerGenerator.generate(cancelToken);

    // send message to the server
    this.awaitingGeneratorRequests.set(requestId, eventListenerSet);

    await this.sendRequest(request);

    // await response
    const buffer = new JSONRPCClientGeneratorBuffer(this.loggerBreadcrumbs.add("JSONRPCClientGeneratorBuffer"));

    for await (let [response] of responseGenerator) {
      buffer.add(response);

      for (let buffered of buffer.flush()) {
        yield buffered.getData().getResult();
      }

      if (!buffer.isExpectingMore()) {
        return;
      }
    }
  }

  requestPromise<T>(cancelToken: CancelToken, method: string, params: JSONRPCParams = []): Promise<T> {
    const requestId = this.uuid();
    const request = new JSONRPCRequest(requestId, method, "promise", params);

    // await response
    return new Promise(resolve => {
      this.awaitingPromiseRequests.set(requestId, (result: T) => {
        resolve(result);
        this.awaitingPromiseRequests.delete(requestId);
      });

      // send message to the server
      this.sendRequest(request);
    });
  }

  async sendRequest(request: JSONRPCRequestInterface): Promise<void> {
    this.postMessage(request.asObject());
  }

  useMessageHandler(cancelToken: CancelToken): $PropertyType<DedicatedWorkerGlobalScope, "onmessage"> {
    const breadcrumbs = this.loggerBreadcrumbs.add("useMessageHandler");

    return (evt: MessageEvent) => {
      if (cancelToken.isCanceled()) {
        return;
      }

      const data = evt.data;

      if (!data || "object" !== typeof data) {
        throw new JSONRPCException(breadcrumbs, "Invalid response.");
      }

      this.handleSerializedResponse(data);
    };
  }
}
