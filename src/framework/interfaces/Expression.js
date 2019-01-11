// @flow

export interface Expression<T> {
  execute(): Promise<T>;
}
