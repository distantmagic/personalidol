// @flow

import type { CancelToken } from "../interfaces/CancelToken";

export type WorkerContextMethods = {
  [string]: (CancelToken, any) => Promise<any>
};
