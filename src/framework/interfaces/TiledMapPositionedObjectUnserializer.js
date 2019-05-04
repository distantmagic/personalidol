// @flow

import type { TiledMapPositionedObject } from "./TiledMapPositionedObject";
import type { TiledMapPositionedObjectSerializedObject } from "../types/TiledMapPositionedObjectSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledMapPositionedObjectUnserializer
  extends JsonUnserializable<
    TiledMapPositionedObject,
    TiledMapPositionedObjectSerializedObject
  > {}
