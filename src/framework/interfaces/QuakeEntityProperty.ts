import Equatable from "src/framework/interfaces/Equatable";

export default interface QuakeEntityProperty extends Equatable<QuakeEntityProperty> {
  asNumber(): number;

  getKey(): string;

  getValue(): string;
}
