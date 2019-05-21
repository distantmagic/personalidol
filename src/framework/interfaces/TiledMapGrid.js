// @flow

import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapGridArray } from "../types/TiledMapGridArray";
import type { TiledMapGridSerializedObject } from "../types/TiledMapGridSerializedObject";
import type { TiledPositionedTile } from "./TiledPositionedTile";

export interface TiledMapGrid extends Equatable<TiledMapGrid>, JsonSerializable<TiledMapGridSerializedObject> {
  generatePositionedTiles(): AsyncGenerator<TiledPositionedTile, void, void>;

  getCoveredGrid(): TiledMapGridArray;

  getGrid(): TiledMapGridArray;

  getGridSize(): ElementSize<"tile">;
}
