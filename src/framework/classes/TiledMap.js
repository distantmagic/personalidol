// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledMapLayer } from "../interfaces/TiledMapLayer";
import type { TiledTileset } from "../interfaces/TiledTileset";

export default class TiledMap implements TiledMapInterface {
  +mapSize: ElementSize<"tile">;
  +tiledMapLayers: Map<number, TiledMapLayer>;
  +tiledTileset: TiledTileset;

  constructor(mapSize: ElementSize<"tile">, tiledTileset: TiledTileset) {
    this.mapSize = mapSize;
    this.tiledMapLayers = new Map<number, TiledMapLayer>();
    this.tiledTileset = tiledTileset;
  }

  addLayer(tiledMapLayer: TiledMapLayer): void {
    this.tiledMapLayers.set(tiledMapLayer.getId(), tiledMapLayer);
  }

  getMapSize(): ElementSize<"tile"> {
    return this.mapSize;
  }
}
