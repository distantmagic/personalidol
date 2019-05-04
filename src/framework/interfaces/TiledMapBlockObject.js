// @flow

import type { ElementRotation } from "./ElementRotation";
import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapBlockObjectSerializedObject } from "../types/TiledMapBlockObjectSerializedObject";
import type { TiledMapPositionedObject } from "./TiledMapPositionedObject";

export interface TiledMapBlockObject
  extends Equatable<TiledMapBlockObject>,
    JsonSerializable<TiledMapBlockObjectSerializedObject> {
  getElementSize(): ElementSize<"tile">;

  getSource(): string;

  getTiledMapPositionedObject(): TiledMapPositionedObject;

  hasSource(): boolean;
}
