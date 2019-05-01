// @flow

import { DOMParser } from "xmldom";

import * as xml from "../helpers/xml";
import Cancelled from "./Exception/Cancelled";
import ElementSize from "./ElementSize";
import TiledMap from "./TiledMap";
import TiledMapBlockObjectParser from "./TiledMapBlockObjectParser";
import TiledMapEllipseObject from "./TiledMapEllipseObject";
import TiledMapLayerParser from "./TiledMapLayerParser";
import TiledMapObjectElementChecker from "./TiledMapObjectElementChecker";
import TiledMapPolygonObjectParser from "./TiledMapPolygonObjectParser";
import TiledMapRectangleObject from "./TiledMapRectangleObject";
import TiledRelativeFilename from "./TiledRelativeFilename";
import { default as TiledMapException } from "./Exception/Tiled/Map";

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
    const breadcrumbs = this.loggerBreadcrumbs
      .add("parse")
      .addVariable(this.mapFilename);

    if (cancelToken.isCancelled()) {
      throw new Cancelled(
        breadcrumbs,
        "Cancel token was cancelled before parsing began."
      );
    }

    // xml

    const doc: Document = this.domParser.parseFromString(
      this.content,
      "application/xml"
    );
    const documentElement = doc.documentElement;

    if (!documentElement || xml.isParseError(doc)) {
      throw xml.extractParseError(breadcrumbs, doc);
    }

    // tileset

    const tilesetElement = documentElement.getElementsByTagName("tileset").item(0);

    if (!tilesetElement) {
      throw new TiledMapException(
        breadcrumbs,
        "Tileset data is missing in map document."
      );
    }

    const tilesetFilename = xml.getStringAttribute(
      breadcrumbs,
      tilesetElement,
      "source"
    );
    const tiledTileset = await this.tiledTilesetLoader.load(
      cancelToken,
      // tileset URL is relative to map mapFilename
      new TiledRelativeFilename(this.mapFilename, tilesetFilename).asString()
    );

    const layerElements = documentElement.getElementsByTagName("layer");

    if (layerElements.length < 1) {
      throw new TiledMapException(
        breadcrumbs,
        "No layers found in map document."
      );
    }

    const mapSize = new ElementSize<"tile">(
      xml.getNumberAttribute(breadcrumbs, documentElement, "width"),
      xml.getNumberAttribute(breadcrumbs, documentElement, "height")
    );
    const tileSize = new ElementSize<"px">(
      xml.getNumberAttribute(breadcrumbs, documentElement, "tilewidth"),
      xml.getNumberAttribute(breadcrumbs, documentElement, "tileheight")
    );

    const tiledMap = new TiledMap(
      breadcrumbs.add("TiledMap"),
      mapSize,
      tileSize,
      tiledTileset
    );

    // layers

    for (
      let i = 0;
      i < layerElements.length;
      i += 1
    ) {
      const layerElement = layerElements.item(i);

      if (!layerElement) {
        continue;
      }

      if (cancelToken.isCancelled()) {
        throw new Cancelled(
          breadcrumbs,
          "Cancel token was cancelled while parsing layers."
        );
      }

      const tiledMapLayerParser = new TiledMapLayerParser(
        breadcrumbs,
        layerElement,
        mapSize
      );
      const tiledMapLayer = await tiledMapLayerParser.parse(cancelToken);

      tiledMap.addLayer(tiledMapLayer);
    }

    // objects

    const objectElements = documentElement.getElementsByTagName("object");

    for (
      let i = 0;
      i < objectElements.length;
      i += 1
    ) {
      const objectElement = objectElements.item(i);

      if (!objectElement) {
        continue;
      }

      const tiledMapObjectElementChecker = new TiledMapObjectElementChecker(
        objectElement
      );
      // ellipse or rectangle
      if (
        tiledMapObjectElementChecker.isEllipse() ||
        tiledMapObjectElementChecker.isRectangle()
      ) {
        const tiledMapObjectParser = new TiledMapBlockObjectParser(
          breadcrumbs.add("TiledMapBlockObjectParser"),
          this.mapFilename,
          objectElement,
          tileSize
        );
        const tiledMapBlockObject = await tiledMapObjectParser.parse(
          cancelToken
        );

        if (tiledMapObjectElementChecker.isEllipse()) {
          tiledMap.addEllipseObject(
            new TiledMapEllipseObject(tiledMapBlockObject)
          );
        } else {
          tiledMap.addRectangleObject(
            new TiledMapRectangleObject(tiledMapBlockObject)
          );
        }
        // polygon
      } else {
        const tiledMapPolygonObjectParser = new TiledMapPolygonObjectParser(
          breadcrumbs.add("TiledMapPolygonObjectParser"),
          this.mapFilename,
          objectElement,
          tileSize
        );
        const tiledMapPolygonObject = await tiledMapPolygonObjectParser.parse(
          cancelToken
        );

        tiledMap.addPolygonObject(tiledMapPolygonObject);
      }
    }

    return tiledMap;
  }
}
