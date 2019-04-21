// @flow

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
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledTilesetLoader } from "../interfaces/TiledTilesetLoader";
import type { TiledMapParser as TiledMapParserInterface } from "../interfaces/TiledMapParser";

export default class TiledMapParser implements TiledMapParserInterface {
  +content: string;
  +domParser: DOMParser;
  +mapFilename: string;
  +tiledTilesetLoader: TiledTilesetLoader;

  constructor(
    mapFilename: string,
    content: string,
    tiledTilesetLoader: TiledTilesetLoader
  ) {
    this.content = content;
    this.mapFilename = mapFilename;
    this.domParser = new DOMParser();
    this.tiledTilesetLoader = tiledTilesetLoader;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapInterface> {
    if (cancelToken.isCancelled()) {
      throw new Cancelled("Cancel token was cancelled before parsing began.");
    }

    // xml

    const doc: Document = this.domParser.parseFromString(
      this.content,
      "application/xml"
    );
    const documentElement = doc.documentElement;

    if (!documentElement || xml.isParseError(doc)) {
      throw xml.extractParseError(doc);
    }

    // tileset

    const tilesetElement = documentElement.querySelector("tileset");

    if (!tilesetElement) {
      throw new TiledMapException("Tileset data is missing in map document.");
    }

    const tilesetFilename = xml.getStringAttribute(tilesetElement, "source");
    const tiledTileset = await this.tiledTilesetLoader.load(
      cancelToken,
      // tileset URL is relative to map mapFilename
      new TiledRelativeFilename(this.mapFilename, tilesetFilename).asString()
    );

    const layerElements = documentElement.querySelectorAll("layer");

    if (layerElements.length < 1) {
      throw new TiledMapException("No layers found in map document.");
    }

    const mapSize = new ElementSize<"tile">(
      xml.getNumberAttribute(documentElement, "width"),
      xml.getNumberAttribute(documentElement, "height")
    );
    const tileSize = new ElementSize<"px">(
      xml.getNumberAttribute(documentElement, "tilewidth"),
      xml.getNumberAttribute(documentElement, "tileheight")
    );

    const tiledMap = new TiledMap(mapSize, tileSize, tiledTileset);

    // layers

    for (let layerElement of layerElements.values()) {
      if (cancelToken.isCancelled()) {
        throw new Cancelled("Cancel token was cancelled while parsing layers.");
      }

      const tiledMapLayerParser = new TiledMapLayerParser(
        layerElement,
        mapSize
      );
      const tiledMapLayer = await tiledMapLayerParser.parse(cancelToken);

      tiledMap.addLayer(tiledMapLayer);
    }

    // objects

    const objectElements = documentElement.querySelectorAll("object");

    for (let objectElement of objectElements.values()) {
      const tiledMapObjectElementChecker = new TiledMapObjectElementChecker(
        objectElement
      );
      // ellipse or rectangle
      if (
        tiledMapObjectElementChecker.isEllipse() ||
        tiledMapObjectElementChecker.isRectangle()
      ) {
        const tiledMapObjectParser = new TiledMapBlockObjectParser(
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
