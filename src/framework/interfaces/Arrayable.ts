// @flow strict

export interface Arrayable<T> {
  asArray(): $ReadOnlyArray<T>;
}
