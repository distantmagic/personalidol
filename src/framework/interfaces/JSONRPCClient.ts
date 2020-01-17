import CancelToken from "src/framework/interfaces/CancelToken";
import JSONRPCErrorResponse from "src/framework/interfaces/JSONRPCErrorResponse";
import JSONRPCGeneratorChunkResponse from "src/framework/interfaces/JSONRPCGeneratorChunkResponse";
import JSONRPCPromiseResponse from "src/framework/interfaces/JSONRPCPromiseResponse";
import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";

import JSONRPCErrorResponseObjectified from "src/framework/types/JSONRPCErrorResponseObjectified";
import JSONRPCGeneratorChunkResponseObjectified from "src/framework/types/JSONRPCGeneratorChunkResponseObjectified";
import JSONRPCParams from "src/framework/types/JSONRPCParams";
import JSONRPCPromiseResponseObjectified from "src/framework/types/JSONRPCPromiseResponseObjectified";

export default interface JSONRPCClient {
  handleErrorResponse<T>(response: JSONRPCErrorResponse<T>): Promise<void>;

  handleGeneratorChunkResponse<T>(response: JSONRPCGeneratorChunkResponse<T>): Promise<void>;

  handlePromiseResponse<T>(response: JSONRPCPromiseResponse<T>): Promise<void>;

  handleSerializedResponse(response: { readonly [key: string]: any }): Promise<void>;

  requestGenerator<T>(cancelToken: CancelToken, method: string, params: JSONRPCParams): AsyncGenerator<T>;

  requestPromise<T>(cancelToken: CancelToken, method: string, params: JSONRPCParams): Promise<T>;

  sendRequest(request: JSONRPCRequest): Promise<void>;

  useMessageHandler(cancelToken: CancelToken): Worker["onmessage"];
}
