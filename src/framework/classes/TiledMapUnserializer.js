// @flow

import ElementSize from "./ElementSize";
import ElementSizeUnserializer from "./ElementSizeUnserializer";
import TiledMapLayerUnserializer from "./TiledMapLayerUnserializer";
import TiledMap from "./TiledMap";
import TiledTileset from "./TiledTileset";
import TiledTilesetUnserializer from "./TiledTilesetUnserializer";

import type { ElementSizeUnserializer as ElementSizeUnserializerInterface } from "../interfaces/ElementSizeUnserializer";
import type { JsonUnserializable } from "../interfaces/JsonUnserializable";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledMapLayerUnserializer as TiledMapLayerUnserializerInterface } from "../interfaces/TiledMapLayerUnserializer";
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";
import type { TiledMapUnserializer as TiledMapUnserializerInterface } from "../interfaces/TiledMapUnserializer";
import type { TiledTilesetUnserializer as TiledTilesetUnserializerInterface } from "../interfaces/TiledTilesetUnserializer";

export default class TiledMapUnserializer
  implements TiledMapUnserializerInterface {
  +elementSizeUnserializerPx: ElementSizeUnserializerInterface<"px">;
  +elementSizeUnserializerTile: ElementSizeUnserializerInterface<"tile">;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledTilesetUnserializer: TiledTilesetUnserializerInterface;
  +tiledMapLayerUnserializer: TiledMapLayerUnserializerInterface;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.elementSizeUnserializerPx = new ElementSizeUnserializer();
    this.elementSizeUnserializerTile = new ElementSizeUnserializer();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledMapLayerUnserializer = new TiledMapLayerUnserializer();
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

    return tiledMap;
  }
}
