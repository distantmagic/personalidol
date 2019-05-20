// @flow

import type { TiledCustomProperty } from "./TiledCustomProperty";
import type { TiledCustomPropertySerializedObject } from "../types/TiledCustomPropertySerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledCustomPropertyUnserializer
  extends JsonUnserializable<
    TiledCustomProperty,
    TiledCustomPropertySerializedObject
  > {}
