// @flow

import * as xml from "../helpers/xml";
import TiledRelativeFilename from "./TiledRelativeFilename";
import TiledTilesetOffset from "./TiledTilesetOffset";
import TiledTilesetOffsetCollection from "./TiledTilesetOffsetCollection";
import { default as TiledMapException } from "./Exception/Tiled/Map";
import { default as XMLDocumentException } from "./Exception/XMLDocument";

import type { CancelToken } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledTilesetLoader } from "../interfaces/TiledTilesetLoader";
import type { TiledTilesetOffsetCollection as TiledTilesetOffsetCollectionInterface } from "../interfaces/TiledTilesetOffsetCollection";
import type { TiledTilesetOffsetCollectionParser as TiledTilesetOffsetCollectionParserInterface } from "../interfaces/TiledTilesetOffsetCollectionParser";

export default class TiledTilesetOffsetCollectionParser implements TiledTilesetOffsetCollectionParserInterface {
  +documentElement: HTMLElement;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapFilename: string;
  +tiledTilesetLoader: TiledTilesetLoader;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    documentElement: HTMLElement,
    mapFilename: string,
    tiledTilesetLoader: TiledTilesetLoader
  ) {
    this.documentElement = documentElement;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapFilename = mapFilename;
    this.tiledTilesetLoader = tiledTilesetLoader;
  }

  async parse(cancelToken: CancelToken): Promise<TiledTilesetOffsetCollectionInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse");
    const tilesetElements = this.documentElement.getElementsByTagName("tileset");

    if (tilesetElements.length < 1) {
      throw new TiledMapException(breadcrumbs, "Tilesets data is missing in map document.");
    }

    const tiledTilesetOffsetCollection = new TiledTilesetOffsetCollection(
      breadcrumbs.add("TiledTilesetOffsetCollection")
    );

    for (let i = 0; i < tilesetElements.length; i += 1) {
      const tilesetElement = tilesetElements.item(i);

      if (!tilesetElement) {
        throw new XMLDocumentException(breadcrumbs.addVariable(String(i)), "Layer element is missing.");
      }

      const tilesetFilename = xml.getStringAttribute(breadcrumbs, tilesetElement, "source");
      const tiledTileset = await this.tiledTilesetLoader.load(
        cancelToken,
        tilesetElement,
        // tileset URL is relative to map mapFilename
        new TiledRelativeFilename(this.mapFilename, tilesetFilename).asString()
      );
      const tiledTilesetOffset = new TiledTilesetOffset(
        xml.getNumberAttribute(breadcrumbs, tilesetElement, "firstgid"),
        tiledTileset
      );

      tiledTilesetOffsetCollection.addTiledTilesetOffset(tiledTilesetOffset);
    }

    return tiledTilesetOffsetCollection;
  }
}
