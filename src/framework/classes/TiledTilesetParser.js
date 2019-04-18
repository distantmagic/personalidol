// @flow

import * as xml from "../helpers/xml";
import ElementSize from "./ElementSize";
import TiledTile from "./TiledTile";
import TiledTileImage from "./TiledTileImage";
import TiledTileParser from "./TiledTileParser";
import TiledTileset from "./TiledTileset";

import type { CancelToken } from "../interfaces/CancelToken";
import type { TiledTile as TiledTileInterface } from "../interfaces/TiledTile";
import type { TiledTileset as TiledTilesetInterface } from "../interfaces/TiledTileset";
import type { TiledTilesetParser as TiledTilesetParserInterface } from "../interfaces/TiledTilesetParser";

export default class TiledTilesetParser implements TiledTilesetParserInterface {
  +content: string;
  +domParser: DOMParser;

  constructor(content: string) {
    this.content = content;
    this.domParser = new DOMParser();
  }

  async parse(cancelToken: CancelToken): Promise<TiledTilesetInterface> {
    const doc: Document = this.domParser.parseFromString(
      this.content,
      "application/xml"
    );
    const documentElement = doc.documentElement;

    if (!documentElement || xml.isParseError(doc)) {
      throw xml.extractParseError(doc);
    }

    const grid: ?HTMLElement = doc.querySelector("grid");

    if (!grid) {
      throw new Error("Tileset file is issing grid metadata.");
    }

    const tiles: NodeList<HTMLElement> = doc.querySelectorAll("tile");

    // console.log(grid.attributes.getNamedItem("orientation").value);
    // console.log(grid.attributes.getNamedItem("height").value);
    // console.log(grid.attributes.getNamedItem("width").value);
    if (!tiles) {
      throw new Error("Tileset tiles data is missing.");
    }

    const expectedTileCount = xml.getNumberAttribute(
      documentElement,
      "tilecount"
    );

    if (tiles.length !== expectedTileCount) {
      throw new Error(
        "Inconsistent tileset data: expected tile count does not match actual tiles number."
      );
    }

    const tiledTileset = new TiledTileset(
      expectedTileCount,
      new ElementSize(
        xml.getNumberAttribute(documentElement, "tilewidth"),
        xml.getNumberAttribute(documentElement, "tileheight")
      )
    );

    const tiledTilePromises = [];
    for (let tileElement of tiles.values()) {
      const tileParser = new TiledTileParser(tileElement);

      tiledTilePromises.push(tileParser.parse());
    }

    for (let tiledTile of await Promise.all(tiledTilePromises)) {
      tiledTileset.add(tiledTile);
    }

    return tiledTileset;
  }
}
