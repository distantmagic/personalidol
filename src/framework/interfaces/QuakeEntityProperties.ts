import { Equatable } from "src/framework/interfaces/Equatable";
import { QuakeEntityProperty } from "src/framework/interfaces/QuakeEntityProperty";

export interface QuakeEntityProperties extends Equatable<QuakeEntityProperties> {
  getProperties(): ReadonlyArray<QuakeEntityProperty>;

  getPropertyByKey(key: string): QuakeEntityProperty;

  hasPropertyKey(key: string): boolean;
}
