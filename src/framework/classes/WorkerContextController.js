// @flow

import autoBind from "auto-bind";
import jsonrpc from "jsonrpc-lite";

import CancelToken from "./CancelToken";
import { isJsonRpcRequest } from "../helpers/jsonrpc";

import type { JsonRpcRequest } from "jsonrpc-lite";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { WorkerContextController as WorkerContextControllerInterface } from "../interfaces/WorkerContextController";
import type { WorkerContextMethods } from "../types/WorkerContextMethods";

export default class WorkerContextController<T: WorkerContextMethods> implements WorkerContextControllerInterface<T> {
  +cancelTokens: Map<string, CancelTokenInterface>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +workerContext: DedicatedWorkerGlobalScope;
  methods: T;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, workerContext: DedicatedWorkerGlobalScope) {
    autoBind(this);

    this.cancelTokens = new Map<string, CancelTokenInterface>();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.workerContext = workerContext;
  }

  attach(): void {
    this.workerContext.onmessage = this.onMessage;
  }

  async callMethod(cancelToken: CancelTokenInterface, rpcRequest: JsonRpcRequest<any, any>): Promise<void> {
    const method = this.methods[rpcRequest.method];

    if (!method) {
      const errorResponse = jsonrpc.error(
        rpcRequest.id,
        new jsonrpc.JsonRpcError(`Method does not exist: "${rpcRequest.method}"`, 1)
      );

      return void this.workerContext.postMessage(errorResponse);
    }

    return new Promise(async (resolve, reject) => {
      let responseData;

      cancelToken.onCanceled(err => {
        const canceledResponse = jsonrpc.error(rpcRequest.id, new jsonrpc.JsonRpcError(err.message, 1));

        resolve(void this.workerContext.postMessage(canceledResponse));
      });

      try {
        responseData = await method.call(this.methods, cancelToken, rpcRequest.params);
      } catch (err) {
        if (cancelToken.isCanceled()) {
          return resolve();
        }

        const errorResponse = jsonrpc.error(rpcRequest.id, new jsonrpc.JsonRpcError(err.message, err.code));

        return resolve(void this.workerContext.postMessage(errorResponse));
      }

      if (cancelToken.isCanceled()) {
        return resolve();
      }

      const successResponse = jsonrpc.success(rpcRequest.id, responseData);

      resolve(void this.workerContext.postMessage(successResponse));
    });
  }

  async onMessage(evt: MessageEvent): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("onMessage");
    const data: any = evt.data;

    if (!isJsonRpcRequest(data)) {
      // not a message for us
      return;
    }

    // double assignment just for typechecking
    const rpcRequest: JsonRpcRequest<any, any> = data;

    if ("_:cancel" === rpcRequest.method) {
      const canceledRequestId = rpcRequest.params.id;
      const cancelToken = this.cancelTokens.get(canceledRequestId);

      if (cancelToken) {
        this.cancelTokens.delete(canceledRequestId);

        return void cancelToken.cancel(breadcrumbs.add("_:cancel"));
      } else {
        // either cancel token was canceled so fast that request was not fired
        // yet, or non-existent token was used, to be safe we are setting
        // already canceled token, so incoming request will be canceled
        // immediately
        // token will be canceled after method is actually called
        const canceledCancelToken = new CancelToken(breadcrumbs);

        this.cancelTokens.set(canceledRequestId, canceledCancelToken);

        return void canceledCancelToken.cancel(breadcrumbs.add("race"));
      }
    }

    const cancelToken = new CancelToken(breadcrumbs);

    this.cancelTokens.set(rpcRequest.id, cancelToken);

    try {
      await this.callMethod(cancelToken, rpcRequest);
    } catch (err) {}

    this.cancelTokens.delete(rpcRequest.id);
  }

  setMethods(methods: T): void {
    this.methods = methods;
  }
}
