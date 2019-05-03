// @flow

import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMap } from "./TiledMap";
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";

export interface TiledMapSerializer extends JsonSerializable<TiledMapSerializedObject> {
}
