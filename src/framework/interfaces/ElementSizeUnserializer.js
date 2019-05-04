// @flow

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementSize } from "./ElementSize";
import type { ElementSizeSerializedObject } from "../types/ElementSizeSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface ElementSizeUnserializer<T: ElementPositionUnit>
  extends JsonUnserializable<ElementSize<T>, ElementSizeSerializedObject<T>> {}
