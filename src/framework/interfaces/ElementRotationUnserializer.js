// @flow

import type { ElementRotationUnit } from "../types/ElementRotationUnit";
import type { ElementRotation } from "./ElementRotation";
import type { ElementRotationSerializedObject } from "../types/ElementRotationSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface ElementRotationUnserializer<T: ElementRotationUnit>
  extends JsonUnserializable<ElementRotation<T>, ElementRotationSerializedObject<T>> {}
