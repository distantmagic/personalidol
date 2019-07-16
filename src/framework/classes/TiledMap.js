// @flow

import Cancelled from "./Exception/Cancelled";
import TiledMapException from "./Exception/Tiled/Map";
import TiledMapSkinnedLayer from "./TiledMapSkinnedLayer";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperty } from "../interfaces/TiledCustomProperty";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledMapLayer } from "../interfaces/TiledMapLayer";
import type { TiledMapSkinnedLayer as TiledMapSkinnedLayerInterface } from "../interfaces/TiledMapSkinnedLayer";
import type { TiledTileset } from "../interfaces/TiledTileset";
import type { TiledTilesetOffset } from "../interfaces/TiledTilesetOffset";
import type { TiledTilesetOffsetCollection } from "../interfaces/TiledTilesetOffsetCollection";

export default class TiledMap implements TiledMapInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapSize: ElementSize<"tile">;
  +tiledMapLayers: Array<TiledMapLayer>;
  +tiledTilesetOffsetCollection: TiledTilesetOffsetCollection;
  +tileSize: ElementSize<"px">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    mapSize: ElementSize<"tile">,
    tileSize: ElementSize<"px">,
    tiledTilesetOffsetCollection: TiledTilesetOffsetCollection
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapSize = mapSize;
    this.tiledMapLayers = [];
    this.tiledTilesetOffsetCollection = tiledTilesetOffsetCollection;
    this.tileSize = tileSize;
  }

  addLayer(tiledMapLayer: TiledMapLayer): void {
    this.tiledMapLayers.push(tiledMapLayer);
  }

  async *generateSkinnedLayers(cancelToken: CancelToken): AsyncGenerator<TiledMapSkinnedLayerInterface, void, void> {
    for (let layer of this.getLayers()) {
      if (cancelToken.isCancelled()) {
        throw new Cancelled(
          this.loggerBreadcrumbs.add("generateSkinnedLayers").add(layer.getName()),
          "Cancel token was cancelled while generating skinned layers."
        );
      }

      yield new TiledMapSkinnedLayer(
        this.loggerBreadcrumbs,
        layer,
        this.tileSize,
        this.getTiledTilesetOffsetCollection()
      );
    }
  }

  getLayers(): Array<TiledMapLayer> {
    return this.tiledMapLayers.slice(0);
  }

  getLayerWithProperty(tiledCustomProperty: TiledCustomProperty): TiledMapLayer {
    for (let layer of this.getLayers()) {
      if (layer.getTiledCustomProperties().hasProperty(tiledCustomProperty)) {
        return layer;
      }
    }

    throw new TiledMapException(
      this.loggerBreadcrumbs,
      `Layer with property not found, but was expected: "${tiledCustomProperty.getName()}"`
    );
  }

  getMapSize(): ElementSize<"tile"> {
    return this.mapSize;
  }

  getTileSize(): ElementSize<"px"> {
    return this.tileSize;
  }

  getTiledTilesetOffsetCollection(): TiledTilesetOffsetCollection {
    return this.tiledTilesetOffsetCollection;
  }

  getTiledTilesets(): $ReadOnlyArray<TiledTileset> {
    const tilesetOffsets = this.getTiledTilesetOffsetCollection().getTiledTilesetOffsets();

    return Array.from(tilesetOffsets.values()).map(function(tiledOffset: TiledTilesetOffset): TiledTileset {
      return tiledOffset.getTiledTileset();
    });
  }

  hasLayerWithProperty(tiledCustomProperty: TiledCustomProperty): boolean {
    for (let layer of this.getLayers()) {
      if (layer.getTiledCustomProperties().hasProperty(tiledCustomProperty)) {
        return true;
      }
    }

    return false;
  }

  isEqual(other: TiledMapInterface): boolean {
    if (!this.getMapSize().isEqual(other.getMapSize())) {
      return false;
    }

    if (!this.getTileSize().isEqual(other.getTileSize())) {
      return false;
    }

    if (!this.getTiledTilesetOffsetCollection().isEqual(other.getTiledTilesetOffsetCollection())) {
      return false;
    }

    const layers = this.getLayers();
    const otherLayers = other.getLayers();

    if (layers.length !== otherLayers.length) {
      return false;
    }

    for (let i = 0; i < layers.length; i += 1) {
      if (!layers[i].isEqual(otherLayers[i])) {
        return false;
      }
    }

    return true;
  }
}
