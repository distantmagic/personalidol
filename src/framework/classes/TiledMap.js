// @flow

import Cancelled from "./Exception/Cancelled";
import TiledMapSkinnedLayer from "./TiledMapSkinnedLayer";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledMapEllipseObject } from "../interfaces/TiledMapEllipseObject";
import type { TiledMapLayer } from "../interfaces/TiledMapLayer";
import type { TiledMapPolygonObject } from "../interfaces/TiledMapPolygonObject";
import type { TiledMapRectangleObject } from "../interfaces/TiledMapRectangleObject";
import type { TiledMapSkinnedLayer as TiledMapSkinnedLayerInterface } from "../interfaces/TiledMapSkinnedLayer";
import type { TiledTileset } from "../interfaces/TiledTileset";

export default class TiledMap implements TiledMapInterface {
  +mapSize: ElementSize<"tile">;
  +tiledMapEllipseObjects: Array<TiledMapEllipseObject>;
  +tiledMapLayers: Array<TiledMapLayer>;
  +tiledMapPolygonObjects: Array<TiledMapPolygonObject>;
  +tiledMapRectangleObjects: Array<TiledMapRectangleObject>;
  +tiledTileset: TiledTileset;
  +tileSize: ElementSize<"px">;

  constructor(
    mapSize: ElementSize<"tile">,
    tileSize: ElementSize<"px">,
    tiledTileset: TiledTileset
  ) {
    this.mapSize = mapSize;
    this.tiledMapLayers = [];
    this.tiledMapEllipseObjects = [];
    this.tiledMapPolygonObjects = [];
    this.tiledMapRectangleObjects = [];
    this.tiledTileset = tiledTileset;
    this.tileSize = tileSize;
  }

  addLayer(tiledMapLayer: TiledMapLayer): void {
    this.tiledMapLayers.push(tiledMapLayer);
  }

  addEllipseObject(tiledMapEllipseObject: TiledMapEllipseObject): void {
    this.tiledMapEllipseObjects.push(tiledMapEllipseObject);
  }

  addPolygonObject(tiledMapPolygonObject: TiledMapPolygonObject): void {
    this.tiledMapPolygonObjects.push(tiledMapPolygonObject);
  }

  addRectangleObject(tiledMapRectangleObject: TiledMapRectangleObject): void {
    this.tiledMapRectangleObjects.push(tiledMapRectangleObject);
  }

  async *generateSkinnedLayers(
    cancelToken: CancelToken
  ): AsyncGenerator<TiledMapSkinnedLayerInterface, void, void> {
    for (let layer of this.getLayers()) {
      if (cancelToken.isCancelled()) {
        throw new Cancelled(
          "Cancel token was cancelled while generating skinned layers."
        );
      }

      yield new TiledMapSkinnedLayer(layer, this.tileSize, this.tiledTileset);
    }
  }

  getLayers(): Array<TiledMapLayer> {
    return this.tiledMapLayers.slice(0);
  }

  getMapSize(): ElementSize<"tile"> {
    return this.mapSize;
  }

  getEllipseObjects(): Array<TiledMapEllipseObject> {
    return this.tiledMapEllipseObjects.slice(0);
  }

  getPolygonObjects(): Array<TiledMapPolygonObject> {
    return this.tiledMapPolygonObjects.slice(0);
  }

  getRectangleObjects(): Array<TiledMapRectangleObject> {
    return this.tiledMapRectangleObjects.slice(0);
  }

  getTileSize(): ElementSize<"px"> {
    return this.tileSize;
  }

  getTiledTileset(): TiledTileset {
    return this.tiledTileset;
  }
}
