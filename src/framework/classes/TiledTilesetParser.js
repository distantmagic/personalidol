// @flow

import { DOMParser } from "xmldom";

import * as xml from "../helpers/xml";
import ElementSize from "./ElementSize";
import TiledTileParser from "./TiledTileParser";
import TiledTileset from "./TiledTileset";
import { default as TiledTilesetException } from "./Exception/Tiled/Tileset";
import { default as XMLDocumentException } from "./Exception/XMLDocument";

import type { CancelToken } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledTileset as TiledTilesetInterface } from "../interfaces/TiledTileset";
import type { TiledTilesetParser as TiledTilesetParserInterface } from "../interfaces/TiledTilesetParser";

export default class TiledTilesetParser implements TiledTilesetParserInterface {
  +content: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tilesetElement: HTMLElement;
  +tilesetPath: string;
  +domParser: DOMParser;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, tilesetElement: HTMLElement, tilesetPath: string, content: string) {
    this.content = content;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tilesetElement = tilesetElement;
    this.tilesetPath = tilesetPath;
    this.domParser = new DOMParser();
  }

  async parse(cancelToken: CancelToken): Promise<TiledTilesetInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse").add(this.tilesetPath);
    const doc: Document = this.domParser.parseFromString(this.content, "application/xml");
    const documentElement = doc.documentElement;

    if (!documentElement || xml.isParseError(doc)) {
      throw xml.extractParseError(breadcrumbs, doc);
    }

    const grid = doc.getElementsByTagName("grid").item(0);

    if (!grid) {
      throw new TiledTilesetException(breadcrumbs, `Tileset file is missing grid metadata: "${this.tilesetPath}"`);
    }

    const tiles: HTMLCollection<HTMLElement> = doc.getElementsByTagName("tile");

    if (!tiles) {
      throw new TiledTilesetException(breadcrumbs, `Tileset tiles data is missing: "${this.tilesetPath}"`);
    }

    const expectedTileCount = xml.getNumberAttribute(breadcrumbs, documentElement, "tilecount");

    if (tiles.length !== expectedTileCount) {
      throw new TiledTilesetException(
        breadcrumbs,
        `Inconsistent tileset data: expected tile count does not match actual tiles number: "${this.tilesetPath}"`
      );
    }

    const tiledTileset = new TiledTileset(
      breadcrumbs.add("TiledTileset"),
      // xml.getNumberAttribute(breadcrumbs, this.tilesetElement, "firstgid"),
      expectedTileCount,
      new ElementSize<"px">(
        xml.getNumberAttribute(breadcrumbs, documentElement, "tilewidth"),
        xml.getNumberAttribute(breadcrumbs, documentElement, "tileheight")
      )
    );

    const tiledTilePromises = [];
    for (let i = 0; i < tiles.length; i += 1) {
      const tileElement = tiles.item(i);

      if (!tileElement) {
        throw new XMLDocumentException(breadcrumbs.addVariable(String(i)), "Tile element is missing.");
      }

      const tileParser = new TiledTileParser(breadcrumbs.add("TiledTileParser"), this.tilesetPath, tileElement);

      tiledTilePromises.push(tileParser.parse(cancelToken));
    }

    let tiledTile;

    for (tiledTile of await Promise.all(tiledTilePromises)) {
      tiledTileset.add(tiledTile);
    }

    return tiledTileset;
  }
}
