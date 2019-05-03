// @flow

import type { ElementSize } from "./ElementSize";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapGridSerializedObject } from "../types/TiledMapGridSerializedObject";
import type { TiledPositionedTile } from "./TiledPositionedTile";

export interface TiledMapGrid
  extends JsonSerializable<TiledMapGridSerializedObject> {
  constructor(
    grid: Array<Array<number>>,
    elementSize: ElementSize<"tile">
  ): void;

  generatePositionedTiles(): AsyncGenerator<TiledPositionedTile, void, void>;
}
