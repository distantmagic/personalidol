// @flow

import * as xml from "../helpers/xml";
import ElementSize from "./ElementSize";
import TiledMap from "./TiledMap";
import TiledMapLayerParser from "./TiledMapLayerParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { TiledTilesetLoader } from "../interfaces/TiledTilesetLoader";
import type { TiledMapParser as TiledMapParserInterface } from "../interfaces/TiledMapParser";

export default class TiledMapParser implements TiledMapParserInterface {
  +filename: string;
  +content: string;
  +domParser: DOMParser;
  +tiledTilesetLoader: TiledTilesetLoader;

  constructor(
    filename: string,
    content: string,
    tiledTilesetLoader: TiledTilesetLoader
  ) {
    this.content = content;
    this.filename = filename;
    this.domParser = new DOMParser();
    this.tiledTilesetLoader = tiledTilesetLoader;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapInterface> {
    const doc: Document = this.domParser.parseFromString(
      this.content,
      "application/xml"
    );
    const documentElement = doc.documentElement;

    if (!documentElement || xml.isParseError(doc)) {
      throw xml.extractParseError(doc);
    }

    const tilesetElement = documentElement.querySelector("tileset");

    if (!tilesetElement) {
      throw new Error("Tileset data is missing in map document.");
    }

    const mapSize = new ElementSize(
      xml.getNumberAttribute(documentElement, "width"),
      xml.getNumberAttribute(documentElement, "height")
    );

    const tilesetFilename = xml.getStringAttribute(tilesetElement, "source");
    const tileset = await this.tiledTilesetLoader.load(
      cancelToken,
      tilesetFilename
    );

    // console.log(tileset);

    const layerElements = documentElement.querySelectorAll("layer");

    if (layerElements.length < 1) {
      throw new Error("No layers found in map document.");
    }

    const tiledMap = new TiledMap();

    for (let layerElement of layerElements.values()) {
      const tiledMapLayerParser = new TiledMapLayerParser(
        layerElement,
        mapSize
      );
      const tiledMapLayer = await tiledMapLayerParser.parse(cancelToken);

      tiledMap.addLayer(tiledMapLayer);
    }

    return tiledMap;
  }
}
