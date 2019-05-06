// @flow

import jsonrpc from "jsonrpc-lite";

import {
  isJsonRpcErrorResponse,
  isJsonRpcResponse,
  isJsonRpcSuccessResponse
} from "../helpers/jsonrpc";

import type {
  JsonRpcErrorResponse,
  JsonRpcResponse,
  JsonRpcSuccessResponse
} from "jsonrpc-lite";

import type { WorkerClientController as WorkerClientControllerInterface } from "../interfaces/WorkerClientController";
import type { WorkerContextMethods } from "../types/WorkerContextMethods";

let jsonRpcCurrentRequestId = 0;

export default class WorkerClientController<T: WorkerContextMethods>
  implements WorkerClientControllerInterface<T> {
  +worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
  }

  request<Method: $Keys<T>, Params, Return>(
    methodName: Method,
    params: Params
  ): Promise<Return> {
    jsonRpcCurrentRequestId += 1;

    const requestId = String(jsonRpcCurrentRequestId);

    return new Promise((resolve, reject) => {
      const onMessage = (evt: MessageEvent): void => {
        const data: any = evt.data;

        if (!isJsonRpcResponse(data)) {
          // nothig to do here
          return;
        }

        const rpcResponse: JsonRpcResponse = data;

        if (requestId !== rpcResponse.id) {
          // not this one
          return;
        }

        // this listener is no longer needed
        this.worker.removeEventListener("message", onMessage);

        if (isJsonRpcErrorResponse(data)) {
          const rpcErrorResponse: JsonRpcErrorResponse = data;

          reject(rpcErrorResponse.error);
        } else if (isJsonRpcSuccessResponse(data)) {
          const rpcSuccessResponse: JsonRpcSuccessResponse<any> = data;

          resolve(rpcSuccessResponse.result);
        } else {
          throw new Error("Unsupported JSON RPC response format.");
        }
      };

      this.worker.addEventListener("message", onMessage);

      const request = jsonrpc.request<Method, Params>(
        requestId,
        methodName,
        params
      );

      this.worker.postMessage(request);
    });
  }
}
