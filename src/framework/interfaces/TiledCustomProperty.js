// @flow

import type { Equatable } from "./Equatable";
import type { TiledCustomPropertyType } from "../types/TiledCustomPropertyType";

export interface TiledCustomProperty extends Equatable<TiledCustomProperty> {
  getName(): string;

  getType(): TiledCustomPropertyType;

  getValue(): string;

  isTruthy(): boolean;
}
