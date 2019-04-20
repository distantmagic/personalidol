// @flow

import * as xml from "../helpers/xml";
import ElementSize from "./ElementSize";
import TiledTileParser from "./TiledTileParser";
import TiledTileset from "./TiledTileset";
import { default as TiledTilesetException } from "./Exception/Tiled/Tileset";

import type { CancelToken } from "../interfaces/CancelToken";
import type { TiledTileset as TiledTilesetInterface } from "../interfaces/TiledTileset";
import type { TiledTilesetParser as TiledTilesetParserInterface } from "../interfaces/TiledTilesetParser";

export default class TiledTilesetParser implements TiledTilesetParserInterface {
  +content: string;
  +tilesetPath: string;
  +domParser: DOMParser;

  constructor(tilesetPath: string, content: string) {
    this.content = content;
    this.tilesetPath = tilesetPath;
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

    // const grid: ?HTMLElement = doc.querySelector("grid");

    // if (!grid) {
    //   throw new TiledTilesetException(
    //     `Tileset file is issing grid metadata: "${this.tilesetPath}"`
    //   );
    // }

    const tiles: NodeList<HTMLElement> = doc.querySelectorAll("tile");

    // console.log(grid.attributes.getNamedItem("orientation").value);
    // console.log(grid.attributes.getNamedItem("height").value);
    // console.log(grid.attributes.getNamedItem("width").value);
    if (!tiles) {
      throw new TiledTilesetException(
        `Tileset tiles data is missing: "${this.tilesetPath}"`
      );
    }

    const expectedTileCount = xml.getNumberAttribute(
      documentElement,
      "tilecount"
    );

    if (tiles.length !== expectedTileCount) {
      throw new TiledTilesetException(
        `Inconsistent tileset data: expected tile count does not match actual tiles number: "${
          this.tilesetPath
        }"`
      );
    }

    const tiledTileset = new TiledTileset(
      expectedTileCount,
      new ElementSize<"px">(
        xml.getNumberAttribute(documentElement, "tilewidth"),
        xml.getNumberAttribute(documentElement, "tileheight")
      )
    );

    const tiledTilePromises = [];
    for (let tileElement of tiles.values()) {
      const tileParser = new TiledTileParser(this.tilesetPath, tileElement);

      tiledTilePromises.push(tileParser.parse(cancelToken));
    }

    for (let tiledTile of await Promise.all(tiledTilePromises)) {
      tiledTileset.add(tiledTile);
    }

    return tiledTileset;
  }
}
