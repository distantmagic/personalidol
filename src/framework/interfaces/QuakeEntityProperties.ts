import { Equatable } from "./Equatable";
import { QuakeEntityProperty } from "./QuakeEntityProperty";

export interface QuakeEntityProperties extends Equatable<QuakeEntityProperties> {
  getProperties(): ReadonlyArray<QuakeEntityProperty>;

  getPropertyByKey(key: string): QuakeEntityProperty;

  hasPropertyKey(key: string): boolean;
}
