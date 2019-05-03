// @flow

import type { ElementPosition } from "./ElementPosition";
import type { ElementRotation } from "./ElementRotation";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapPositionedObjectSerializedObject } from "../types/TiledMapPositionedObjectSerializedObject";

export interface TiledMapPositionedObject
  extends JsonSerializable<TiledMapPositionedObjectSerializedObject> {
  getElementPosition(): ElementPosition<"tile">;

  getElementRotation(): ElementRotation<"radians">;

  getName(): string;
}
