import * as THREE from "three";

import EventListenerGenerator from "src/framework/classes/EventListenerGenerator";
import EventListenerSet from "src/framework/classes/EventListenerSet";
import JSONRPCClientGeneratorBuffer from "src/framework/classes/JSONRPCClientGeneratorBuffer";
import JSONRPCRequest from "src/framework/classes/JSONRPCRequest";
import { default as CancelTokenException } from "src/framework/classes/Exception/CancelToken";
import { default as JSONRPCException } from "src/framework/classes/Exception/JSONRPC";
import { unobjectify as unobjectifyJSONRPCErrorResponse } from "src/framework/classes/JSONRPCResponse/Error";
import { unobjectify as unobjectifyJSONRPCGeneratorChunkResponse } from "src/framework/classes/JSONRPCResponse/GeneratorChunk";
import { unobjectify as unobjectifyJSONRPCPromiseResponse } from "src/framework/classes/JSONRPCResponse/Promise";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";
import { default as IJSONRPCClient } from "src/framework/interfaces/JSONRPCClient";
import { default as IJSONRPCErrorResponse } from "src/framework/interfaces/JSONRPCErrorResponse";
import { default as IJSONRPCGeneratorChunkResponse } from "src/framework/interfaces/JSONRPCGeneratorChunkResponse";
import { default as IJSONRPCPromiseResponse } from "src/framework/interfaces/JSONRPCPromiseResponse";
import { default as IJSONRPCRequest } from "src/framework/interfaces/JSONRPCRequest";
import { default as IJSONRPCResponseData } from "src/framework/interfaces/JSONRPCResponseData";

import JSONRPCVersion from "src/framework/types/JSONRPCVersion";

export default class JSONRPCClient implements HasLoggerBreadcrumbs, IJSONRPCClient {
  readonly awaitingGeneratorRequests: Map<string, IEventListenerSet<[IJSONRPCGeneratorChunkResponse<any>]>>;
  readonly awaitingPromiseRequests: Map<string, (arg: any) => void>;
  readonly uuid: () => string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly postMessage: Worker["postMessage"];

  static attachTo(loggerBreadcrumbs: LoggerBreadcrumbs, cancelToken: CancelToken, worker: Worker): IJSONRPCClient {
    const jsonRpcClient = new JSONRPCClient(loggerBreadcrumbs, worker.postMessage.bind(worker));

    worker.onmessage = jsonRpcClient.useMessageHandler(cancelToken);

    return jsonRpcClient;
  }

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, postMessage: Worker["postMessage"], uuid: () => string = THREE.MathUtils.generateUUID) {
    this.awaitingGeneratorRequests = new Map();
    this.awaitingPromiseRequests = new Map();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.postMessage = postMessage;
    this.uuid = uuid;
  }

  async handleErrorResponse<T>(response: IJSONRPCErrorResponse<T>): Promise<void> {
    const message = JSON.stringify(response.getData().getResult()) || "";

    throw new JSONRPCException(this.loggerBreadcrumbs.add("handleErrorResponse"), `RPCServer error response: ${message}`);
  }

  async handleGeneratorChunkResponse<T>(response: IJSONRPCGeneratorChunkResponse<T>): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("handleGeneratorChunkResponse");
    const responseId = response.getId();
    const generatorHandler = this.awaitingGeneratorRequests.get(responseId);

    if (!generatorHandler) {
      throw new JSONRPCException(breadcrumbs, `Nothing awaited this generator response: "${responseId}"`);
    }
    return generatorHandler.notify([response]);
  }

  async handlePromiseResponse<T>(response: IJSONRPCPromiseResponse<T>): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("handlePromiseResponse");
    const responseId = response.getId();
    const promiseHandler = this.awaitingPromiseRequests.get(responseId);

    if (!promiseHandler) {
      throw new JSONRPCException(breadcrumbs, `Nothing awaited this promise response: "${responseId}"`);
    }

    return promiseHandler(response.getData().getResult());
  }

  handleSerializedResponse(response: { [key: string]: any }): Promise<void> {
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

    const validated: {
      readonly id: string;
      readonly jsonrpc: JSONRPCVersion;
      readonly method: string;
      readonly result: any;
    } = {
      id: id,
      jsonrpc: jsonrpc,
      method: method,
      result: result,
    };

    switch (type) {
      case "error":
        return this.handleErrorResponse(
          unobjectifyJSONRPCErrorResponse(breadcrumbs, {
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
          unobjectifyJSONRPCGeneratorChunkResponse(breadcrumbs, {
            ...validated,
            chunk: chunk,
            head: head,
            next: next,
            type: "generator",
          })
        );
      case "promise":
        return this.handlePromiseResponse(
          unobjectifyJSONRPCPromiseResponse(breadcrumbs, {
            ...validated,
            type: "promise",
          })
        );
      default:
        throw new JSONRPCException(breadcrumbs, `Unknown response type: "${type}"`);
    }
  }

  @cancelable()
  async *requestGenerator<T, U>(cancelToken: CancelToken, method: string, params: IJSONRPCResponseData<T>): AsyncGenerator<U> {
    const requestId = this.uuid();
    const request = new JSONRPCRequest(requestId, method, "generator", params);
    const eventListenerSet = new EventListenerSet(this.loggerBreadcrumbs.add("EventListenerSet"));
    const eventListenerGenerator = new EventListenerGenerator(eventListenerSet);
    const responseGenerator = eventListenerGenerator.generate(cancelToken);

    // send message to the server
    this.awaitingGeneratorRequests.set(requestId, eventListenerSet);

    await this.sendRequest(cancelToken, request);

    if (cancelToken.isCanceled()) {
      return;
    }

    // await response
    const buffer = new JSONRPCClientGeneratorBuffer<U>(this.loggerBreadcrumbs.add("JSONRPCClientGeneratorBuffer"));

    for await (let [response] of responseGenerator) {
      if (cancelToken.isCanceled()) {
        return;
      }

      buffer.add(response);

      for (let buffered of buffer.flush()) {
        yield buffered.getData().getResult();
      }

      if (!buffer.isExpectingMore()) {
        return;
      }
    }
  }

  @cancelable(true)
  requestPromise<T, U>(cancelToken: CancelToken, method: string, params: IJSONRPCResponseData<T>): Promise<U> {
    const requestId = this.uuid();
    const request = new JSONRPCRequest(requestId, method, "promise", params);

    // await response
    return new Promise((resolve, reject) => {
      cancelToken.onCanceled(reject);

      this.awaitingPromiseRequests.set(requestId, (result: U) => {
        if (cancelToken.isCanceled()) {
          reject(new CancelTokenException(this.loggerBreadcrumbs.add("requestPromise"), "Cancel token was canceled before processing RPC response."));
        } else {
          resolve(result);
        }

        this.awaitingPromiseRequests.delete(requestId);
      });

      // send message to the server
      this.sendRequest(cancelToken, request);
    });
  }

  @cancelable()
  async sendRequest<T>(cancelToken: CancelToken, request: IJSONRPCRequest<T>): Promise<void> {
    this.postMessage(request.asObject(), request.getParams().getTransferables());
  }

  useMessageHandler(cancelToken: CancelToken): Worker["onmessage"] {
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
