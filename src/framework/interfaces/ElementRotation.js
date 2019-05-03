// @flow

import type { ElementRotationSerializedObject } from "../types/ElementRotationSerializedObject";
import type { ElementRotationUnit } from "../types/ElementRotationUnit";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";

export interface ElementRotation<Unit: ElementRotationUnit>
  extends Equatable<ElementRotation<Unit>>,
    JsonSerializable<ElementRotationSerializedObject<Unit>> {
  getRotationX(): number;

  getRotationY(): number;

  getRotationZ(): number;
}
