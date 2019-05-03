// @flow

import type { Equatable } from "./Equatable";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementSizeSerializedObject } from "../types/ElementSizeSerializedObject";
import type { JsonSerializable } from "./JsonSerializable";

export interface ElementSize<Unit: ElementPositionUnit>
  extends Equatable<ElementSize<Unit>>,
    JsonSerializable<ElementSizeSerializedObject<Unit>> {
  getAspect(): number;

  getDepth(): number;

  getHeight(): number;

  getWidth(): number;
}
