// @flow

import type { ElementPositionSerializedObject } from "../types/ElementPositionSerializedObject";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";

export interface ElementPosition<Unit: ElementPositionUnit>
  extends Equatable<ElementPosition<Unit>>,
    JsonSerializable<ElementPositionSerializedObject<Unit>> {
  distanceTo(ElementPosition<Unit>): number;

  getX(): number;

  getY(): number;

  getZ(): number;

  isOnLineBetween(ElementPosition<Unit>, ElementPosition<Unit>): boolean;
}
