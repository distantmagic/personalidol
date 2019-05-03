// @flow

import ElementPosition from "./ElementPosition";
import TiledPositionedTile from "./TiledPositionedTile";

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapGrid as TiledMapGridInterface } from "../interfaces/TiledMapGrid";
import type { TiledMapGridArray } from "../types/TiledMapGridArray";
import type { TiledMapGridSerializedObject } from "../types/TiledMapGridSerializedObject";
import type { TiledPositionedTile as TiledPositionedTileInterface } from "../interfaces/TiledPositionedTile";

export default class TiledMapGrid implements TiledMapGridInterface {
  +grid: TiledMapGridArray;
  +gridSize: ElementSize<"tile">;

  constructor(grid: TiledMapGridArray, gridSize: ElementSize<"tile">): void {
    this.grid = grid;
    this.gridSize = gridSize;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledMapGridSerializedObject {
    return {
      grid: this.grid,
      gridSize: this.gridSize.asObject()
    };
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
