// @flow

import ElementSizeUnserializer from "./ElementSizeUnserializer";
import TiledTileUnserializer from "./TiledTileUnserializer";
import TiledTileset from "./TiledTileset";

import type { ElementSizeUnserializer as ElementSizeUnserializerInterface } from "../interfaces/ElementSizeUnserializer";
import type { TiledTileUnserializer as TiledTileUnserializerInterface } from "../interfaces/TiledTileUnserializer";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledTileset as TiledTilesetInterface } from "../interfaces/TiledTileset";
import type { TiledTilesetUnserializer as TiledTilesetUnserializerInterface } from "../interfaces/TiledTilesetUnserializer";
import type { TiledTilesetSerializedObject } from "../types/TiledTilesetSerializedObject";

export default class TiledTilesetUnserializer implements TiledTilesetUnserializerInterface {
  +elementSizeUnserializer: ElementSizeUnserializerInterface<"px">;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledTileUnserializer: TiledTileUnserializerInterface;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.elementSizeUnserializer = new ElementSizeUnserializer();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledTileUnserializer = new TiledTileUnserializer();
  }

  fromJson(serialized: string): TiledTilesetInterface {
    const parsed = JSON.parse(serialized);

    return this.fromObject(parsed);
  }

  fromObject(parsed: TiledTilesetSerializedObject): TiledTilesetInterface {
    const tiledTileset = new TiledTileset(
      this.loggerBreadcrumbs,
      parsed.expectedTileCount,
      this.elementSizeUnserializer.fromObject(parsed.tileSize)
    );

    for (let tile of parsed.tiles) {
      tiledTileset.add(this.tiledTileUnserializer.fromObject(tile));
    }

    return tiledTileset;
  }
}
