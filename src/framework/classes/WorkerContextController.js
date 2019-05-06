// @flow

import autoBind from "auto-bind";
import jsonrpc from "jsonrpc-lite";

import { isJsonRpcRequest } from "../helpers/jsonrpc";

import type { JsonRpcRequest } from "jsonrpc-lite";

import type { WorkerContextController as WorkerContextControllerInterface } from "../interfaces/WorkerContextController";
import type { WorkerContextMethods } from "../types/WorkerContextMethods";

export default class WorkerContextController<T: WorkerContextMethods>
  implements WorkerContextControllerInterface<T> {
  +workerContext: DedicatedWorkerGlobalScope;
  methods: T;

  constructor(workerContext: DedicatedWorkerGlobalScope) {
    autoBind(this);

    this.workerContext = workerContext;
  }

  attach(): void {
    this.workerContext.onmessage = this.onMessage;
  }

  async onMessage(evt: MessageEvent): Promise<void> {
    const data: any = evt.data;

    if (!isJsonRpcRequest(data)) {
      // not a message for us
      return;
    }

    // double assignment just for typechecking
    const rpcRequest: JsonRpcRequest<any, any> = data;
    const methodName = rpcRequest.method;
    const method = this.methods[methodName];

    if (!method) {
      const errorResponse = jsonrpc.error(
        rpcRequest.id,
        new jsonrpc.JsonRpcError(`Method does not exist: "${methodName}"`, 1)
      );

      return void this.workerContext.postMessage(errorResponse);
    }

    let responseData;

    try {
      responseData = await method(rpcRequest.params);
    } catch (err) {
      const errorResponse = jsonrpc.error(
        rpcRequest.id,
        new jsonrpc.JsonRpcError(err.message, err.code)
      );

      return void this.workerContext.postMessage(errorResponse);
    }

    const successResponse = jsonrpc.success(rpcRequest.id, responseData);

    return void this.workerContext.postMessage(successResponse);
  }

  setMethods(methods: T): void {
    this.methods = methods;
  }
}
