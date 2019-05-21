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
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";
import type { TiledMapSkinnedLayer as TiledMapSkinnedLayerInterface } from "../interfaces/TiledMapSkinnedLayer";
import type { TiledTileset } from "../interfaces/TiledTileset";

export default class TiledMap implements TiledMapInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapSize: ElementSize<"tile">;
  +tiledMapEllipseObjects: Array<TiledMapEllipseObject>;
  +tiledMapLayers: Array<TiledMapLayer>;
  +tiledMapPolygonObjects: Array<TiledMapPolygonObject>;
  +tiledMapRectangleObjects: Array<TiledMapRectangleObject>;
  +tiledTileset: TiledTileset;
  +tileSize: ElementSize<"px">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    mapSize: ElementSize<"tile">,
    tileSize: ElementSize<"px">,
    tiledTileset: TiledTileset
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
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

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledMapSerializedObject {
    return {
      ellipseObjects: this.getEllipseObjects().map(ellipseObject => ellipseObject.asObject()),
      layers: this.getLayers().map(layer => layer.asObject()),
      mapSize: this.getMapSize().asObject(),
      polygonObjects: this.getPolygonObjects().map(polygonObject => polygonObject.asObject()),
      rectangleObjects: this.getRectangleObjects().map(rectangleObject => rectangleObject.asObject()),
      tiledTileset: this.getTiledTileset().asObject(),
      tileSize: this.getTileSize().asObject(),
    };
  }

  async *generateSkinnedLayers(cancelToken: CancelToken): AsyncGenerator<TiledMapSkinnedLayerInterface, void, void> {
    for (let layer of this.getLayers()) {
      if (cancelToken.isCancelled()) {
        throw new Cancelled(
          this.loggerBreadcrumbs.add("generateSkinnedLayers").add(layer.getName()),
          "Cancel token was cancelled while generating skinned layers."
        );
      }

      yield new TiledMapSkinnedLayer(this.loggerBreadcrumbs, layer, this.tileSize, this.tiledTileset);
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

  getTiledTileset(): TiledTileset {
    return this.tiledTileset;
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

    if (!this.getTiledTileset().isEqual(other.getTiledTileset())) {
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
