// @flow

import type { Equatable } from "./Equatable";
import type { TiledCustomProperty } from "./TiledCustomProperty";

export interface TiledCustomProperties extends Equatable<TiledCustomProperties> {
  addProperty(TiledCustomProperty): void;

  getPropertyByName(name: string): TiledCustomProperty;

  hasProperty(TiledCustomProperty): boolean;

  hasPropertyByName(name: string): boolean;

  keys(): $ReadOnlyArray<string>;
}
