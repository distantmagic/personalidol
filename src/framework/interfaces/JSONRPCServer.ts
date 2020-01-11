// @flow strict

import type { CancelToken } from "../interfaces/CancelToken";
import type { JSONRPCMessageHandler } from "../interfaces/JSONRPCMessageHandler";
import type { JSONRPCRequest } from "../interfaces/JSONRPCRequest";
import type { JSONRPCResponse } from "../interfaces/JSONRPCResponse";
import type { JSONRPCServerGeneratorCallback } from "../types/JSONRPCServerGeneratorCallback";
import type { JSONRPCServerPromiseCallback } from "../types/JSONRPCServerPromiseCallback";

export interface JSONRPCServer extends JSONRPCMessageHandler {
  handleRequest(JSONRPCRequest): Promise<void>;

  returnGenerator<T>(CancelToken, method: string, handle: JSONRPCServerGeneratorCallback<T>): Promise<void>;

  returnPromise<T>(CancelToken, method: string, handle: JSONRPCServerPromiseCallback<T>): Promise<void>;

  sendResponse<T, U: {}>(JSONRPCResponse<T, U>): Promise<void>;
}
