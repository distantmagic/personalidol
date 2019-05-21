// @flow

import type { JsonRpcErrorResponse, JsonRpcRequest, JsonRpcResponse, JsonRpcSuccessResponse } from "jsonrpc-lite";

export function isJsonRpcResponse(data: ?JsonRpcResponse): %checks {
  return data && "object" === typeof data && "2.0" === data.jsonrpc && "string" === typeof data.id;
}

export function isJsonRpcErrorResponse(data: ?JsonRpcErrorResponse): %checks {
  return (
    isJsonRpcResponse(data) &&
    "object" === typeof data.error &&
    "number" === typeof data.error.code &&
    "string" === typeof data.error.message
  );
}

export function isJsonRpcRequest<Method: string, Params>(data: ?JsonRpcRequest<Method, Params>): %checks {
  return isJsonRpcResponse(data) && "string" === typeof data.method && "object" === typeof data.params;
}

export function isJsonRpcSuccessResponse<T>(data: ?JsonRpcSuccessResponse<T>): %checks {
  return isJsonRpcResponse(data) && "object" === typeof data.result;
}
