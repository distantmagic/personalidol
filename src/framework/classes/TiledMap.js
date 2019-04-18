// @flow

import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledMapLayer } from "../interfaces/TiledMapLayer";

export default class TiledMap implements TiledMapInterface {
  +tiledMapLayers: Map<number, TiledMapLayer>;

  constructor() {
    this.tiledMapLayers = new Map<number, TiledMapLayer>();
  }

  addLayer(tiledMapLayer: TiledMapLayer): void {
    this.tiledMapLayers.set(tiledMapLayer.getId(), tiledMapLayer);
  }
}
