// @flow

import type {
  JsonRpcErrorResponse,
  JsonRpcSuccessResponse
} from "jsonrpc-lite";

import type { CancelToken } from "../interfaces/CancelToken";
import type { WorkerContextMethods } from "../types/WorkerContextMethods";

export interface WorkerClientController<T: WorkerContextMethods> {
  request<Params, Return>(
    CancelToken,
    methodName: $Keys<T>,
    params: Params
  ): Promise<Return>;
}
