// @flow

import type {
  JsonRpcErrorResponse,
  JsonRpcSuccessResponse
} from "jsonrpc-lite";

import type { CancelToken } from "../interfaces/CancelToken";
import type { WorkerContextMethods } from "../types/WorkerContextMethods";

export interface WorkerClientController<T: WorkerContextMethods> {
  request<Method: $Keys<T>, Params, Return>(
    CancelToken,
    methodName: Method,
    params: Params
  ): Promise<JsonRpcErrorResponse | JsonRpcSuccessResponse<Return>>;
}
