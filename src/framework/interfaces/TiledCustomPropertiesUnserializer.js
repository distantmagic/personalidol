// @flow

import type { TiledCustomProperties } from "./TiledCustomProperties";
import type { TiledCustomPropertiesSerializedObject } from "../types/TiledCustomPropertiesSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledCustomPropertiesUnserializer
  extends JsonUnserializable<
    TiledCustomProperties,
    TiledCustomPropertiesSerializedObject
  > {}
