// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { JSONRPCErrorResponse } from "../interfaces/JSONRPCErrorResponse";
import type { JSONRPCGeneratorChunkResponse } from "../interfaces/JSONRPCGeneratorChunkResponse";
import type { JSONRPCMessageHandler } from "../interfaces/JSONRPCMessageHandler";
import type { JSONRPCParams } from "../types/JSONRPCParams";
import type { JSONRPCRequest } from "./JSONRPCRequest";
import type { JSONRPCPromiseResponse } from "../interfaces/JSONRPCPromiseResponse";
import type { JSONRPCErrorResponseObjectified } from "../types/JSONRPCErrorResponseObjectified";
import type { JSONRPCGeneratorChunkResponseObjectified } from "../types/JSONRPCGeneratorChunkResponseObjectified";
import type { JSONRPCPromiseResponseObjectified } from "../types/JSONRPCPromiseResponseObjectified";

export interface JSONRPCClient extends JSONRPCMessageHandler {
  handleErrorResponse<T>(JSONRPCErrorResponse<T>): Promise<void>;

  handleGeneratorChunkResponse<T>(JSONRPCGeneratorChunkResponse<T>): Promise<void>;

  handlePromiseResponse<T>(JSONRPCPromiseResponse<T>): Promise<void>;

  handleSerializedResponse({ +[string]: any }): Promise<void>;

  requestGenerator<T>(CancelToken, method: string, JSONRPCParams): AsyncGenerator<T, void, void>;

  requestPromise<T>(CancelToken, method: string, JSONRPCParams): Promise<T>;

  sendRequest(JSONRPCRequest): Promise<void>;
}
