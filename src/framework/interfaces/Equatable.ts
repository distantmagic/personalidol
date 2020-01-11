export interface Equatable<T> {
  isEqual(other: Equatable<T>): boolean;
}
