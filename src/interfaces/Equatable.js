// @flow

export interface Equatable {
  isEqual(other: Equatable): boolean;
}
