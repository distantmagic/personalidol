/// <reference lib="webworker" />

import CancelToken from "src/framework/interfaces/CancelToken";
import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";
import JSONRPCResponse from "src/framework/interfaces/JSONRPCResponse";

import JSONRPCServerGeneratorCallback from "src/framework/types/JSONRPCServerGeneratorCallback";
import JSONRPCServerPromiseCallback from "src/framework/types/JSONRPCServerPromiseCallback";

export default interface JSONRPCServer {
  handleRequest(request: JSONRPCRequest): Promise<void>;

  returnGenerator<T>(cancelToken: CancelToken, method: string, handle: JSONRPCServerGeneratorCallback<T>): Promise<void>;

  returnPromise<T>(cancelToken: CancelToken, method: string, handle: JSONRPCServerPromiseCallback<T>): Promise<void>;

  sendResponse<T, U extends Object>(response: JSONRPCResponse<T, U>): Promise<void>;

  useMessageHandler(cancelToken: CancelToken): DedicatedWorkerGlobalScope["onmessage"];
}
