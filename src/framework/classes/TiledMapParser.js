// @flow

import { DOMParser } from "xmldom";

import * as xml from "../helpers/xml";
import Canceled from "./Exception/Canceled";
import ElementSize from "./ElementSize";
import TiledMap from "./TiledMap";
import TiledMapLayerParser from "./TiledMapLayerParser";
import TiledMapObjectLayerParser from "./TiledMapObjectLayerParser";
import TiledTilesetOffsetCollectionParser from "./TiledTilesetOffsetCollectionParser";
import { default as TiledMapException } from "./Exception/Tiled/Map";
import { default as XMLDocumentException } from "./Exception/XMLDocument";

import type { CancelToken } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledTilesetLoader } from "../interfaces/TiledTilesetLoader";
import type { TiledMapParser as TiledMapParserInterface } from "../interfaces/TiledMapParser";

export default class TiledMapParser implements TiledMapParserInterface {
  +content: string;
  +domParser: DOMParser;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapFilename: string;
  +tiledTilesetLoader: TiledTilesetLoader;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    mapFilename: string,
    content: string,
    tiledTilesetLoader: TiledTilesetLoader
  ) {
    this.content = content;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapFilename = mapFilename;
    this.domParser = new DOMParser();
    this.tiledTilesetLoader = tiledTilesetLoader;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse").addVariable(this.mapFilename);

    if (cancelToken.isCanceled()) {
      throw new Canceled(breadcrumbs, "Cancel token was canceled before parsing began.");
    }

    // xml

    const doc: Document = this.domParser.parseFromString(this.content, "application/xml");
    const documentElement: ?HTMLElement = doc.documentElement;

    if (!documentElement || xml.isParseError(doc)) {
      throw xml.extractParseError(breadcrumbs, doc);
    }

    // tilesets

    const tiledTilesetOffsetCollectionParser = new TiledTilesetOffsetCollectionParser(
      breadcrumbs.add("TiledTilesetOffsetCollectionParser"),
      documentElement,
      this.mapFilename,
      this.tiledTilesetLoader
    );
    const tiledTilesetOffsetCollection = await tiledTilesetOffsetCollectionParser.parse(cancelToken);

    // objects layer

    const tileSize = new ElementSize<"px">(
      xml.getNumberAttribute(breadcrumbs, documentElement, "tilewidth"),
      xml.getNumberAttribute(breadcrumbs, documentElement, "tileheight")
    );
    const tiledMapObjectLayerParser = new TiledMapObjectLayerParser(
      breadcrumbs.add("TiledMapObjectLayerParser"),
      documentElement,
      tileSize
    );
    const tiledMapObjectLayer = await tiledMapObjectLayerParser.parse(cancelToken);

    // map itself

    const mapSize = new ElementSize<"tile">(
      xml.getNumberAttribute(breadcrumbs, documentElement, "width"),
      xml.getNumberAttribute(breadcrumbs, documentElement, "height")
    );

    const tiledMap = new TiledMap(
      breadcrumbs.add("TiledMap"),
      mapSize,
      tileSize,
      tiledTilesetOffsetCollection,
      tiledMapObjectLayer
    );

    // layers

    const layerElements = documentElement.getElementsByTagName("layer");

    if (layerElements.length < 1) {
      throw new TiledMapException(breadcrumbs, "No layers found in map document.");
    }

    for (let i = 0; i < layerElements.length; i += 1) {
      const layerElement = layerElements.item(i);

      if (!layerElement) {
        throw new XMLDocumentException(breadcrumbs.addVariable(String(i)), "Layer element is missing.");
      }

      if (cancelToken.isCanceled()) {
        throw new Canceled(breadcrumbs, "Cancel token was canceled while parsing layers.");
      }

      const tiledMapLayerParser = new TiledMapLayerParser(breadcrumbs, layerElement, mapSize);
      const tiledMapLayer = await tiledMapLayerParser.parse(cancelToken);

      tiledMap.addLayer(tiledMapLayer);
    }

    return tiledMap;
  }
}
