// @flow

import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { TiledMapGridArray } from "../types/TiledMapGridArray";
import type { TiledPositionedTile } from "./TiledPositionedTile";

export interface TiledMapGrid extends Equatable<TiledMapGrid> {
  generatePositionedTiles(): AsyncGenerator<TiledPositionedTile, void, void>;

  getCoveredGrid(): TiledMapGridArray;

  getGrid(): TiledMapGridArray;

  getGridSize(): ElementSize<"tile">;
}
