import { Equatable } from "./Equatable";

export interface EquatableWithPrecision<T> extends Equatable<T> {
  isEqualWithPrecision(other: T, precision: number): boolean;
}
