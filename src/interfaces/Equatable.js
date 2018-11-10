// @flow

export interface Equatable<T> {
  isEqual(other: T): boolean;
}
