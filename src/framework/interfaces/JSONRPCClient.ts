import { CancelToken } from "../interfaces/CancelToken";
import { JSONRPCErrorResponse } from "../interfaces/JSONRPCErrorResponse";
import { JSONRPCGeneratorChunkResponse } from "../interfaces/JSONRPCGeneratorChunkResponse";
import { JSONRPCParams } from "../types/JSONRPCParams";
import { JSONRPCRequest } from "./JSONRPCRequest";
import { JSONRPCPromiseResponse } from "../interfaces/JSONRPCPromiseResponse";
import { JSONRPCErrorResponseObjectified } from "../types/JSONRPCErrorResponseObjectified";
import { JSONRPCGeneratorChunkResponseObjectified } from "../types/JSONRPCGeneratorChunkResponseObjectified";
import { JSONRPCPromiseResponseObjectified } from "../types/JSONRPCPromiseResponseObjectified";

export interface JSONRPCClient {
  handleErrorResponse<T>(response: JSONRPCErrorResponse<T>): Promise<void>;

  handleGeneratorChunkResponse<T>(response: JSONRPCGeneratorChunkResponse<T>): Promise<void>;

  handlePromiseResponse<T>(response: JSONRPCPromiseResponse<T>): Promise<void>;

  handleSerializedResponse(response: { readonly [key: string]: any }): Promise<void>;

  requestGenerator<T>(cancelToken: CancelToken, method: string, params: JSONRPCParams): AsyncGenerator<T, void, void>;

  requestPromise<T>(cancelToken: CancelToken, method: string, params: JSONRPCParams): Promise<T>;

  sendRequest(request: JSONRPCRequest): Promise<void>;

  useMessageHandler(cancelToken: CancelToken): Worker["onmessage"];
}
