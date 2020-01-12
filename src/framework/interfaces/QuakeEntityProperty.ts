import { Equatable } from "src/framework/interfaces/Equatable";

export interface QuakeEntityProperty extends Equatable<QuakeEntityProperty> {
  asNumber(): number;

  getKey(): string;

  getValue(): string;
}
