import type Equatable from "src/framework/interfaces/Equatable";

export default interface EquatableWithPrecision<T> extends Equatable<T> {
  isEqualWithPrecision(other: T, precision: number): boolean;
}
