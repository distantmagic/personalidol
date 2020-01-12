import { Equatable } from "src/framework/interfaces/Equatable";

export interface EquatableWithPrecision<T> extends Equatable<T> {
  isEqualWithPrecision(other: T, precision: number): boolean;
}
