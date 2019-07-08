// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledCustomProperties } from "../interfaces/TiledCustomProperties";
import type { TiledMapGrid } from "../interfaces/TiledMapGrid";
import type { TiledMapLayer as TiledMapLayerInterface } from "../interfaces/TiledMapLayer";

export default class TiledMapLayer implements TiledMapLayerInterface {
  +layerSize: ElementSize<"tile">;
  +name: string;
  +tiledCustomProperties: TiledCustomProperties;
  +tiledMapGrid: TiledMapGrid;

  constructor(
    name: string,
    tiledMapGrid: TiledMapGrid,
    layerSize: ElementSize<"tile">,
    tiledCustomProperties: TiledCustomProperties
  ): void {
    this.layerSize = layerSize;
    this.name = name;
    this.tiledCustomProperties = tiledCustomProperties;
    this.tiledMapGrid = tiledMapGrid;
  }

  getLayerSize(): ElementSize<"tile"> {
    return this.layerSize;
  }

  getName(): string {
    return this.name;
  }

  getTiledCustomProperties(): TiledCustomProperties {
    return this.tiledCustomProperties;
  }

  getTiledMapGrid(): TiledMapGrid {
    return this.tiledMapGrid;
  }

  isEqual(other: TiledMapLayerInterface): boolean {
    return (
      this.getLayerSize().isEqual(other.getLayerSize()) &&
      this.getName() === other.getName() &&
      this.getTiledCustomProperties().isEqual(other.getTiledCustomProperties()) &&
      this.getTiledMapGrid().isEqual(other.getTiledMapGrid())
    );
  }
}
