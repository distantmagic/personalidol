// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledPositionedTile } from "./TiledPositionedTile";

export interface TiledMapGrid {
  constructor(
    grid: Array<Array<number>>,
    elementSize: ElementSize<"tile">
  ): void;

  generatePositionedTiles(): AsyncGenerator<TiledPositionedTile, void, void>;
}
