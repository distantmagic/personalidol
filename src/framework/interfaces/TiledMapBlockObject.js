// @flow

import type { ElementRotation } from "./ElementRotation";
import type { ElementSize } from "./ElementSize";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapBlockObjectSerializedObject } from "../types/TiledMapBlockObjectSerializedObject";
import type { TiledMapPositionedObject } from "./TiledMapPositionedObject";

export interface TiledMapBlockObject extends JsonSerializable<TiledMapBlockObjectSerializedObject>, TiledMapPositionedObject {
  getElementRotation(): ElementRotation<"radians">;

  getElementSize(): ElementSize<"tile">;

  getSource(): string;

  hasSource(): boolean;
}
