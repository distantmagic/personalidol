// @flow

import ElementSize from "./ElementSize";
import TiledMap from "./TiledMap";
import TiledTileset from "./TiledTileset";

import type { JsonUnserializable } from "../interfaces/JsonUnserializable";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapUnserializer as TiledMapUnserializerInterface } from "../interfaces/TiledMapUnserializer";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";

export default class TiledMapUnserializer
  implements TiledMapUnserializerInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  fromJson(serialized: string): TiledMapInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: TiledMapSerializedObject) {
    return new TiledMap(
      this.loggerBreadcrumbs,
      new ElementSize<"tile">(10, 10),
      new ElementSize<"px">(10, 10),
      new TiledTileset(this.loggerBreadcrumbs, 1, new ElementSize<"px">(10, 10))
    );
  }
}
