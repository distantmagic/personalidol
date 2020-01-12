import { CancelToken } from "src/framework/interfaces/CancelToken";
import { JSONRPCErrorResponse } from "src/framework/interfaces/JSONRPCErrorResponse";
import { JSONRPCGeneratorChunkResponse } from "src/framework/interfaces/JSONRPCGeneratorChunkResponse";
import { JSONRPCParams } from "src/framework/types/JSONRPCParams";
import { JSONRPCRequest } from "src/framework/interfaces/JSONRPCRequest";
import { JSONRPCPromiseResponse } from "src/framework/interfaces/JSONRPCPromiseResponse";
import { JSONRPCErrorResponseObjectified } from "src/framework/types/JSONRPCErrorResponseObjectified";
import { JSONRPCGeneratorChunkResponseObjectified } from "src/framework/types/JSONRPCGeneratorChunkResponseObjectified";
import { JSONRPCPromiseResponseObjectified } from "src/framework/types/JSONRPCPromiseResponseObjectified";

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
