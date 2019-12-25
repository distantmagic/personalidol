// @flow

import JSONRPCRequest from "./JSONRPCRequest";
import JSONRPCServerGeneratorBuffer from "./JSONRPCServerGeneratorBuffer";
import { default as CanceledException } from "./Exception/CancelToken/Canceled";
import { default as JSONRPCErrorResponse } from "./JSONRPCResponse/Error";
import { default as JSONRPCPromiseResponse } from "./JSONRPCResponse/Promise";

import type { CancelToken } from "../interfaces/CancelToken";
import type { JSONRPCGeneratorChunkResponse as JSONRPCGeneratorChunkResponseInterface } from "../interfaces/JSONRPCGeneratorChunkResponse";
import type { JSONRPCRequest as JSONRPCRequestInterface } from "../interfaces/JSONRPCRequest";
import type { JSONRPCResponse } from "../interfaces/JSONRPCResponse";
import type { JSONRPCServer as JSONRPCServerInterface } from "../interfaces/JSONRPCServer";
import type { JSONRPCServerGeneratorCallback } from "../types/JSONRPCServerGeneratorCallback";
import type { JSONRPCServerPromiseCallback } from "../types/JSONRPCServerPromiseCallback";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class JSONRPCServer implements JSONRPCServerInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +postMessage: $PropertyType<DedicatedWorkerGlobalScope, "postMessage">;
  +requestHandlers: Map<string, (JSONRPCRequestInterface) => Promise<void>>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, postMessage: $PropertyType<DedicatedWorkerGlobalScope, "postMessage">) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.postMessage = postMessage;
    this.requestHandlers = new Map();
  }

  handleRequest(jsonRpcRequest: JSONRPCRequestInterface): Promise<void> {
    const method = jsonRpcRequest.getMethod();
    const requestHandler = this.requestHandlers.get(method);

    if (requestHandler) {
      return requestHandler.call(this, jsonRpcRequest);
    }

    // prettier-ignore
    const response = new JSONRPCErrorResponse(
      this.loggerBreadcrumbs.add("handleRequest"),
      jsonRpcRequest.getId(),
      method,
      "error",
      "Method not found"
    );

    this.postMessage(response.serialize());

    return Promise.resolve();
  }

  async returnGenerator<T>(cancelToken: CancelToken, method: string, handle: JSONRPCServerGeneratorCallback<T>): Promise<void> {
    this.requestHandlers.set(method, async (request: JSONRPCRequestInterface) => {
      if (cancelToken.isCanceled()) {
        return;
      }

      const onMessageReady = (message: JSONRPCGeneratorChunkResponseInterface<T>) => {
        this.postMessage(message.serialize());
      };

      const jsonRpcGeneratorResponseBuffer = new JSONRPCServerGeneratorBuffer(this.loggerBreadcrumbs.add("JSONRPCServerGeneratorBuffer"), onMessageReady);

      for await (let responseDataChunk: T of handle(cancelToken, request)) {
        jsonRpcGeneratorResponseBuffer.add(request, responseDataChunk);
      }

      jsonRpcGeneratorResponseBuffer.flushRemaining(request);
    });

    await cancelToken.whenCanceled();
    this.requestHandlers.delete(method);
  }

  async returnPromise<T>(cancelToken: CancelToken, method: string, handle: JSONRPCServerPromiseCallback<T>): Promise<void> {
    this.requestHandlers.set(method, async (request: JSONRPCRequestInterface) => {
      if (cancelToken.isCanceled()) {
        return;
      }

      const result = await handle(cancelToken, request);

      if (cancelToken.isCanceled()) {
        return;
      }

      // prettier-ignore
      const response = new JSONRPCPromiseResponse<T>(
        this.loggerBreadcrumbs.add("returnPromise"),
        request.getId(),
        request.getMethod(),
        request.getType(),
        result
      );

      this.postMessage(response.serialize());
    });

    await cancelToken.whenCanceled();
    this.requestHandlers.delete(method);
  }

  useMessageHandler(cancelToken: CancelToken): $PropertyType<DedicatedWorkerGlobalScope, "onmessage"> {
    const breadcrumbs = this.loggerBreadcrumbs.add("useMessageHandler");

    return (evt: MessageEvent) => {
      if (cancelToken.isCanceled()) {
        return;
      }

      const data = evt.data;

      if ("string" === typeof data) {
        this.handleRequest(JSONRPCRequest.unserialize(breadcrumbs, data));
      } else {
        const response = new JSONRPCErrorResponse(breadcrumbs, "", "", "error", "Invalid request");

        this.postMessage(response.serialize());
      }
    };
  }
}
