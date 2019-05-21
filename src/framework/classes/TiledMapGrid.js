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
      gridSize: this.gridSize.asObject(),
    };
  }

  async *generatePositionedTiles(): AsyncGenerator<TiledPositionedTileInterface, void, void> {
    const gridWidth = this.gridSize.getWidth();
    const gridHeight = this.gridSize.getHeight();

    for (let y = 0; y < gridHeight; y += 1) {
      for (let x = 0; x < gridWidth; x += 1) {
        yield new TiledPositionedTile(this.grid[y][x], new ElementPosition(x, y));
      }
    }
  }

  getCoveredGrid(): TiledMapGridArray {
    return this.getGrid().map(function(gridRow) {
      return gridRow.map(function(gridCell) {
        return gridCell <= 0 ? 0 : 1;
      });
    });
  }

  getGrid(): TiledMapGridArray {
    return this.grid;
  }

  getGridSize(): ElementSize<"tile"> {
    return this.gridSize;
  }

  isEqual(other: TiledMapGridInterface): boolean {
    if (!this.getGridSize().isEqual(other.getGridSize())) {
      return false;
    }

    const grid = this.getGrid();
    const gridSize = this.getGridSize();
    const gridWidth = gridSize.getWidth();
    const gridHeight = gridSize.getHeight();

    const otherGrid = other.getGrid();

    for (let y = 0; y < gridHeight; y += 1) {
      for (let x = 0; x < gridWidth; x += 1) {
        if (grid[x][y] !== otherGrid[x][y]) {
          return false;
        }
      }
    }

    return true;
  }
}
