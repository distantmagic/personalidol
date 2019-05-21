// @flow

import type { TiledMap } from "./TiledMap";
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledMapUnserializer extends JsonUnserializable<TiledMap, TiledMapSerializedObject> {}
