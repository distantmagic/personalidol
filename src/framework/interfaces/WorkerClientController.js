// @flow

import type { WorkerContextMethods } from "../types/WorkerContextMethods";

export interface WorkerClientController<T: WorkerContextMethods> {
  request<Method: $Keys<T>, Params, Return>(
    methodName: Method,
    params: Params
  ): Promise<Return>;
}
