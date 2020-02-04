import CancelToken from "src/framework/interfaces/CancelToken";
import JSONRPCErrorResponse from "src/framework/interfaces/JSONRPCErrorResponse";
import JSONRPCGeneratorChunkResponse from "src/framework/interfaces/JSONRPCGeneratorChunkResponse";
import JSONRPCPromiseResponse from "src/framework/interfaces/JSONRPCPromiseResponse";
import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";
import JSONRPCResponseData from "src/framework/interfaces/JSONRPCResponseData";

import JSONRPCErrorResponseObjectified from "src/framework/types/JSONRPCErrorResponseObjectified";
import JSONRPCGeneratorChunkResponseObjectified from "src/framework/types/JSONRPCGeneratorChunkResponseObjectified";
import JSONRPCPromiseResponseObjectified from "src/framework/types/JSONRPCPromiseResponseObjectified";

export default interface JSONRPCClient {
  handleErrorResponse<T>(response: JSONRPCErrorResponse<T>): Promise<void>;

  handleGeneratorChunkResponse<T>(response: JSONRPCGeneratorChunkResponse<T>): Promise<void>;

  handlePromiseResponse<T>(response: JSONRPCPromiseResponse<T>): Promise<void>;

  handleSerializedResponse(response: { readonly [key: string]: any }): Promise<void>;

  requestGenerator<T, U>(cancelToken: CancelToken, method: string, params: JSONRPCResponseData<T>): AsyncGenerator<U>;

  requestPromise<T, U>(cancelToken: CancelToken, method: string, params: JSONRPCResponseData<T>): Promise<U>;

  sendRequest<T>(cancelToken: CancelToken, request: JSONRPCRequest<T>): Promise<void>;

  useMessageHandler(cancelToken: CancelToken): Worker["onmessage"];
}
