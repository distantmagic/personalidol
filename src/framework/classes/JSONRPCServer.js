// @flow

import JSONRPCRequest from "./JSONRPCRequest";
import JSONRPCResponseData from "./JSONRPCResponseData";
import JSONRPCServerGeneratorBuffer from "./JSONRPCServerGeneratorBuffer";
import { default as CanceledException } from "./Exception/CancelToken/Canceled";
import { default as JSONRPCErrorResponse } from "./JSONRPCResponse/Error";
import { default as JSONRPCPromiseResponse } from "./JSONRPCResponse/Promise";

import type { CancelToken } from "../interfaces/CancelToken";
import type { JSONRPCGeneratorChunkResponse as JSONRPCGeneratorChunkResponseInterface } from "../interfaces/JSONRPCGeneratorChunkResponse";
import type { JSONRPCRequest as JSONRPCRequestInterface } from "../interfaces/JSONRPCRequest";
import type { JSONRPCResponse } from "../interfaces/JSONRPCResponse";
import type { JSONRPCResponseData as JSONRPCResponseDataInterface } from "../interfaces/JSONRPCResponseData";
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

    const data = new JSONRPCResponseData("Method not found");
    const response = new JSONRPCErrorResponse(this.loggerBreadcrumbs.add("handleRequest"), jsonRpcRequest.getId(), method, "error", data);

    this.postMessage(response.asObject(), response.getData().getTransferables());

    return Promise.resolve();
  }

  async returnGenerator<T>(cancelToken: CancelToken, method: string, handle: JSONRPCServerGeneratorCallback<T>): Promise<void> {
    this.requestHandlers.set(method, async (request: JSONRPCRequestInterface) => {
      if (cancelToken.isCanceled()) {
        return;
      }

      const onMessageReady = (message: JSONRPCGeneratorChunkResponseInterface<T>) => {
        this.postMessage(message.asObject());
      };

      const jsonRpcGeneratorResponseBuffer = new JSONRPCServerGeneratorBuffer(this.loggerBreadcrumbs.add("JSONRPCServerGeneratorBuffer"), onMessageReady);

      for await (let responseDataChunk: JSONRPCResponseDataInterface<T> of handle(cancelToken, request)) {
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

      this.postMessage(response.asObject(), response.getData().getTransferables());
    });

    await cancelToken.whenCanceled();
    this.requestHandlers.delete(method);
  }

  useMessageHandler(cancelToken: CancelToken): $PropertyType<DedicatedWorkerGlobalScope, "onmessage"> {
    const breadcrumbs = this.loggerBreadcrumbs.add("useMessageHandler");

    function invalidRequest(): void {
      const data = new JSONRPCResponseData("Invalid request");
      const response = new JSONRPCErrorResponse(breadcrumbs, "", "", "error", data);

      this.postMessage(response.asObject(), response.getData().getTransferables());
    }

    return (evt: MessageEvent) => {
      if (cancelToken.isCanceled()) {
        return;
      }

      const data = evt.data;

      if (!data || "object" !== typeof data) {
        return invalidRequest.call(this);
      }

      const { id, jsonrpc, method, params, type } = data;

      // prettier-ignore
      if ( "string" !== typeof id
        || "2.0-x-personalidol" !== jsonrpc
        || "string" !== typeof method
        || !Array.isArray(params)
        || ("error" !== type && "generator" !== type && "promise" !== type)
      ) {
        return invalidRequest.call(this);
      }

      this.handleRequest(
        JSONRPCRequest.unobjectify(breadcrumbs, {
          id: id,
          jsonrpc: jsonrpc,
          method: method,
          params: params,
          type: type,
        })
      );
    };
  }
}
