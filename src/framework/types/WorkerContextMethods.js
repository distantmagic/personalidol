// @flow

export type WorkerContextMethods = {
  [string]: (any) => Promise<any>
};
