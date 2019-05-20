// @flow

import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledCustomProperty } from "./TiledCustomProperty";
import type { TiledCustomPropertiesSerializedObject } from "../types/TiledCustomPropertiesSerializedObject";

export interface TiledCustomProperties
  extends Equatable<TiledCustomProperties>,
    JsonSerializable<TiledCustomPropertiesSerializedObject> {
  addProperty(TiledCustomProperty): void;

  getPropertyByName(name: string): TiledCustomProperty;

  hasPropertyByName(name: string): boolean;

  keys(): $ReadOnlyArray<string>;
}
