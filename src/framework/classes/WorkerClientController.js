// @flow

import jsonrpc from "jsonrpc-lite";

import { isJsonRpcErrorResponse, isJsonRpcResponse, isJsonRpcSuccessResponse } from "../helpers/jsonrpc";

import type { JsonRpcErrorResponse, JsonRpcResponse, JsonRpcSuccessResponse } from "jsonrpc-lite";

import type { CancelToken } from "../interfaces/CancelToken";
import type { WorkerClientController as WorkerClientControllerInterface } from "../interfaces/WorkerClientController";
import type { WorkerContextMethods } from "../types/WorkerContextMethods";

let jsonRpcCurrentRequestId = 0;

export default class WorkerClientController<T: WorkerContextMethods> implements WorkerClientControllerInterface<T> {
  +worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
  }

  async cancel(cancelledRequestId: string): Promise<void> {
    const requestId = this.getNextRequestId();
    const request = jsonrpc.request<
      "_:cancel",
      {
        id: string,
      }
    >(requestId, "_:cancel", {
      id: cancelledRequestId,
    });
    this.worker.postMessage(request);
  }

  getNextRequestId(): string {
    jsonRpcCurrentRequestId += 1;

    return String(jsonRpcCurrentRequestId);
  }

  request<Params, Return>(cancelToken: CancelToken, methodName: $Keys<T>, params: Params): Promise<Return> {
    const requestId = this.getNextRequestId();

    return new Promise((resolve, reject) => {
      if (cancelToken.isCancelled()) {
        return void reject({
          code: 1,
          message: "Token has been cancelled before sending request.",
        });
      }

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

      const request = jsonrpc.request<$Keys<T>, Params>(requestId, methodName, params);
      this.worker.postMessage(request);

      cancelToken.onCancelled(() => {
        this.cancel(requestId);
      });
    });
  }
}
