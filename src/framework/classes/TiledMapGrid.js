// @flow

import ElementPosition from "./ElementPosition";
import TiledPositionedTile from "./TiledPositionedTile";

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapGrid as TiledMapGridInterface } from "../interfaces/TiledMapGrid";
import type { TiledPositionedTile as TiledPositionedTileInterface } from "../interfaces/TiledPositionedTile";

type TiledMapArray = Array<Array<number>>;

export default class TiledMapGrid implements TiledMapGridInterface {
  +grid: TiledMapArray;
  +gridSize: ElementSize<"tile">;

  constructor(grid: TiledMapArray, gridSize: ElementSize<"tile">): void {
    this.grid = grid;
    this.gridSize = gridSize;
  }

  async *generatePositionedTiles(): AsyncGenerator<
    TiledPositionedTileInterface,
    void,
    void
  > {
    const gridWidth = this.gridSize.getWidth();
    const gridHeight = this.gridSize.getHeight();

    for (let y = 0; y < gridHeight; y += 1) {
      for (let x = 0; x < gridWidth; x += 1) {
        yield new TiledPositionedTile(
          this.grid[y][x],
          new ElementPosition(x, y)
        );
      }
    }
  }
}
