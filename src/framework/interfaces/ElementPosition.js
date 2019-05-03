// @flow

import type { Vector3 } from "three";

import type { ElementPositionSerializedObject } from "../types/ElementPositionSerializedObject";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";

export interface ElementPosition<Unit: ElementPositionUnit>
  extends Equatable<ElementPosition<Unit>>,
    JsonSerializable<ElementPositionSerializedObject<Unit>>,
    Vector3 {
  getX(): number;

  getY(): number;

  getZ(): number;
}
