// @flow

import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledCustomPropertySerializedObject } from "../types/TiledCustomPropertySerializedObject";
import type { TiledCustomPropertyType } from "../types/TiledCustomPropertyType";

export interface TiledCustomProperty
  extends Equatable<TiledCustomProperty>,
    JsonSerializable<TiledCustomPropertySerializedObject> {
  getName(): string;

  getType(): TiledCustomPropertyType;

  getValue(): string;

  isTruthy(): boolean;
}
