// @flow

export interface JsonSerializable<T> {
  asObject(): T;

  asJson(): string;
}
