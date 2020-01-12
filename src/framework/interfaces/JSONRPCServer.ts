/// <reference lib="webworker" />

import { CancelToken } from "../interfaces/CancelToken";
import { JSONRPCRequest } from "../interfaces/JSONRPCRequest";
import { JSONRPCResponse } from "../interfaces/JSONRPCResponse";
import { JSONRPCServerGeneratorCallback } from "../types/JSONRPCServerGeneratorCallback";
import { JSONRPCServerPromiseCallback } from "../types/JSONRPCServerPromiseCallback";

export interface JSONRPCServer {
  handleRequest(request: JSONRPCRequest): Promise<void>;

  returnGenerator<T>(cancelToken: CancelToken, method: string, handle: JSONRPCServerGeneratorCallback<T>): Promise<void>;

  returnPromise<T>(cancelToken: CancelToken, method: string, handle: JSONRPCServerPromiseCallback<T>): Promise<void>;

  sendResponse<T, U extends Object>(response: JSONRPCResponse<T, U>): Promise<void>;

  useMessageHandler(cancelToken: CancelToken): DedicatedWorkerGlobalScope["onmessage"];
}
