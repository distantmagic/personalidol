// @flow

import ElementSize from "./ElementSize";
import TiledMap from "./TiledMap";
import TiledTileset from "./TiledTileset";

import type { JsonUnserializable } from "../interfaces/JsonUnserializable";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";

export default class TiledMapSerializer
  implements JsonUnserializable<TiledMapInterface> {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +serialized: string;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, serialized: string) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.serialized = serialized;
  }

  fromJson(): TiledMapInterface {
    return new TiledMap(
      this.loggerBreadcrumbs,
      new ElementSize<"tile">(10, 10),
      new ElementSize<"px">(10, 10),
      new TiledTileset(this.loggerBreadcrumbs, 1, new ElementSize<"px">(10, 10))
    );
  }
}
