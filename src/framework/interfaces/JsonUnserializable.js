// @flow

export interface JsonUnserializable<T, U> {
  fromJson(string): T;

  fromObject(U): T;
}
