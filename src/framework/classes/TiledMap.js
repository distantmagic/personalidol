// @flow

import Cancelled from "./Exception/Cancelled";
import TiledMapException from "./Exception/Tiled/Map";
import TiledMapSkinnedLayer from "./TiledMapSkinnedLayer";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperty } from "../interfaces/TiledCustomProperty";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledMapEllipseObject } from "../interfaces/TiledMapEllipseObject";
import type { TiledMapLayer } from "../interfaces/TiledMapLayer";
import type { TiledMapPolygonObject } from "../interfaces/TiledMapPolygonObject";
import type { TiledMapRectangleObject } from "../interfaces/TiledMapRectangleObject";
import type { TiledMapSkinnedLayer as TiledMapSkinnedLayerInterface } from "../interfaces/TiledMapSkinnedLayer";
import type { TiledTileset } from "../interfaces/TiledTileset";
import type { TiledTilesetOffsetCollection } from "../interfaces/TiledTilesetOffsetCollection";

export default class TiledMap implements TiledMapInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapSize: ElementSize<"tile">;
  +tiledMapEllipseObjects: Array<TiledMapEllipseObject>;
  +tiledMapLayers: Array<TiledMapLayer>;
  +tiledMapPolygonObjects: Array<TiledMapPolygonObject>;
  +tiledMapRectangleObjects: Array<TiledMapRectangleObject>;
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
    this.tiledMapEllipseObjects = [];
    this.tiledMapPolygonObjects = [];
    this.tiledMapRectangleObjects = [];
    this.tiledTilesetOffsetCollection = tiledTilesetOffsetCollection;
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

  async *generateSkinnedLayers(cancelToken: CancelToken): AsyncGenerator<TiledMapSkinnedLayerInterface, void, void> {
    for (let layer of this.getLayers()) {
      if (cancelToken.isCancelled()) {
        throw new Cancelled(
          this.loggerBreadcrumbs.add("generateSkinnedLayers").add(layer.getName()),
          "Cancel token was cancelled while generating skinned layers."
        );
      }

      yield new TiledMapSkinnedLayer(this.loggerBreadcrumbs, layer, this.tileSize, this.tiledTilesetOffsetCollection);
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

  getTiledTilesetOffsetCollection(): TiledTilesetOffsetCollection {
    return this.tiledTilesetOffsetCollection;
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

    const ellipseObjects = this.getEllipseObjects();
    const otherEllipseObjects = other.getEllipseObjects();

    if (ellipseObjects.length !== otherEllipseObjects.length) {
      return false;
    }

    for (let i = 0; i < ellipseObjects.length; i += 1) {
      if (!ellipseObjects[i].isEqual(otherEllipseObjects[i])) {
        return false;
      }
    }

    const polygonObjects = this.getPolygonObjects();
    const otherPolygonObjects = other.getPolygonObjects();

    if (polygonObjects.length !== otherPolygonObjects.length) {
      return false;
    }

    for (let i = 0; i < polygonObjects.length; i += 1) {
      if (!polygonObjects[i].isEqual(otherPolygonObjects[i])) {
        return false;
      }
    }

    const rectangleObjects = this.getRectangleObjects();
    const otherRectangleObjects = other.getRectangleObjects();

    if (rectangleObjects.length !== otherRectangleObjects.length) {
      return false;
    }

    for (let i = 0; i < rectangleObjects.length; i += 1) {
      if (!rectangleObjects[i].isEqual(otherRectangleObjects[i])) {
        return false;
      }
    }

    return true;
  }
}
