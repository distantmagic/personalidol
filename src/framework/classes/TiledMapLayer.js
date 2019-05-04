// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapGrid } from "../interfaces/TiledMapGrid";
import type { TiledMapLayer as TiledMapLayerInterface } from "../interfaces/TiledMapLayer";
import type { TiledMapLayerSerializedObject } from "../types/TiledMapLayerSerializedObject";

export default class TiledMapLayer implements TiledMapLayerInterface {
  +layerSize: ElementSize<"tile">;
  +name: string;
  +tiledMapGrid: TiledMapGrid;

  constructor(
    name: string,
    tiledMapGrid: TiledMapGrid,
    layerSize: ElementSize<"tile">
  ): void {
    this.layerSize = layerSize;
    this.name = name;
    this.tiledMapGrid = tiledMapGrid;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledMapLayerSerializedObject {
    return {
      layerSize: this.layerSize.asObject(),
      name: this.name,
      tiledMapGrid: this.tiledMapGrid.asObject()
    };
  }

  getLayerSize(): ElementSize<"tile"> {
    return this.layerSize;
  }

  getName(): string {
    return this.name;
  }

  getTiledMapGrid(): TiledMapGrid {
    return this.tiledMapGrid;
  }

  isEqual(other: TiledMapLayerInterface): boolean {
    return (
      this.name === other.getName() &&
      this.layerSize.isEqual(other.getLayerSize()) &&
      this.tiledMapGrid.isEqual(other.getTiledMapGrid())
    );
  }
}
