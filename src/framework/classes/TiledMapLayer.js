// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapGrid } from "../interfaces/TiledMapGrid";
import type { TiledMapLayer as TiledMapLayerInterface } from "../interfaces/TiledMapLayer";

export default class TiledMapLayer implements TiledMapLayerInterface {
  +elementSize: ElementSize<"tile">;
  +name: string;
  +tiledMapGrid: TiledMapGrid;

  constructor(
    name: string,
    tiledMapGrid: TiledMapGrid,
    elementSize: ElementSize<"tile">
  ): void {
    this.elementSize = elementSize;
    this.name = name;
    this.tiledMapGrid = tiledMapGrid;
  }

  getName(): string {
    return this.name;
  }

  getTiledMapGrid(): TiledMapGrid {
    return this.tiledMapGrid;
  }
}
