// @flow

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementPosition } from "./ElementPosition";
import type { ElementPositionSerializedObject } from "../types/ElementPositionSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface ElementPositionUnserializer<T: ElementPositionUnit>
  extends JsonUnserializable<
    ElementPosition<T>,
    ElementPositionSerializedObject<T>
  > {}
