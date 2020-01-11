// @flow strict

export interface Objectable<T: {}> {
  asObject(): T;
}
