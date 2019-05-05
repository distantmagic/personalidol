// @flow

import ElementSize from "./ElementSize";
import ElementSizeUnserializer from "./ElementSizeUnserializer";
import TiledMap from "./TiledMap";
import TiledMapEllipseObjectUnserializer from "./TiledMapEllipseObjectUnserializer";
import TiledMapLayerUnserializer from "./TiledMapLayerUnserializer";
import TiledMapRectangleObjectUnserializer from "./TiledMapRectangleObjectUnserializer";
import TiledTileset from "./TiledTileset";
import TiledTilesetUnserializer from "./TiledTilesetUnserializer";

import type { ElementSizeUnserializer as ElementSizeUnserializerInterface } from "../interfaces/ElementSizeUnserializer";
import type { JsonUnserializable } from "../interfaces/JsonUnserializable";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledMapEllipseObjectUnserializer as TiledMapEllipseObjectUnserializerInterface } from "../interfaces/TiledMapEllipseObjectUnserializer";
import type { TiledMapLayerUnserializer as TiledMapLayerUnserializerInterface } from "../interfaces/TiledMapLayerUnserializer";
import type { TiledMapRectangleObjectUnserializer as TiledMapRectangleObjectUnserializerInterface } from "../interfaces/TiledMapRectangleObjectUnserializer";
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";
import type { TiledMapUnserializer as TiledMapUnserializerInterface } from "../interfaces/TiledMapUnserializer";
import type { TiledTilesetUnserializer as TiledTilesetUnserializerInterface } from "../interfaces/TiledTilesetUnserializer";

export default class TiledMapUnserializer
  implements TiledMapUnserializerInterface {
  +elementSizeUnserializerPx: ElementSizeUnserializerInterface<"px">;
  +elementSizeUnserializerTile: ElementSizeUnserializerInterface<"tile">;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledMapEllipseObjectUnserializer: TiledMapEllipseObjectUnserializerInterface;
  +tiledMapLayerUnserializer: TiledMapLayerUnserializerInterface;
  +tiledMapRectangleObjectUnserializer: TiledMapRectangleObjectUnserializerInterface;
  +tiledTilesetUnserializer: TiledTilesetUnserializerInterface;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.elementSizeUnserializerPx = new ElementSizeUnserializer();
    this.elementSizeUnserializerTile = new ElementSizeUnserializer();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledMapEllipseObjectUnserializer = new TiledMapEllipseObjectUnserializer();
    this.tiledMapLayerUnserializer = new TiledMapLayerUnserializer();
    this.tiledMapRectangleObjectUnserializer = new TiledMapRectangleObjectUnserializer();
    this.tiledTilesetUnserializer = new TiledTilesetUnserializer(
      loggerBreadcrumbs
    );
  }

  fromJson(serialized: string): TiledMapInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: TiledMapSerializedObject) {
    const tiledMap = new TiledMap(
      this.loggerBreadcrumbs,
      this.elementSizeUnserializerTile.fromObject(parsed.mapSize),
      this.elementSizeUnserializerPx.fromObject(parsed.tileSize),
      this.tiledTilesetUnserializer.fromObject(parsed.tiledTileset)
    );

    for (let layer of parsed.layers) {
      tiledMap.addLayer(this.tiledMapLayerUnserializer.fromObject(layer));
    }

    for (let ellipseObject of parsed.ellipseObjects) {
      tiledMap.addEllipseObject(
        this.tiledMapEllipseObjectUnserializer.fromObject(ellipseObject)
      );
    }

    for (let rectangleObject of parsed.rectangleObjects) {
      tiledMap.addRectangleObject(
        this.tiledMapRectangleObjectUnserializer.fromObject(rectangleObject)
      );
    }

    return tiledMap;
  }
}
