// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapGrid } from "../interfaces/TiledMapGrid";
import type { TiledMapLayer as TiledMapLayerInterface } from "../interfaces/TiledMapLayer";

export default class TiledMapLayer implements TiledMapLayerInterface {
  +elementSize: ElementSize;
  +id: number;
  +name: string;
  +tiledMapGrid: TiledMapGrid;

  constructor(
    id: number,
    name: string,
    tiledMapGrid: TiledMapGrid,
    elementSize: ElementSize
  ): void {
    this.elementSize = elementSize;
    this.id = id;
    this.name = name;
    this.tiledMapGrid = tiledMapGrid;
  }

  getId(): number {
    return this.id;
  }
}
