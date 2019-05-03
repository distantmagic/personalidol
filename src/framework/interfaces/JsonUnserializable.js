// @flow

export interface JsonUnserializable<T> {
  fromJson(): T;
}
