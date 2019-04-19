// @flow

import * as xml from "../helpers/xml";
import Cancelled from "./Exception/Cancelled";
import ElementSize from "./ElementSize";
import TiledTile from "./TiledTile";
import TiledTileImage from "./TiledTileImage";
import { default as TiledTileException } from "./Exception/Tiled/Tile";

import type { CancelToken } from "../interfaces/CancelToken";
import type { TiledTile as TiledTileInterface } from "../interfaces/TiledTile";
import type { TiledTileParser as TiledTileParserInterface } from "../interfaces/TiledTileParser";

export default class TiledTileParser implements TiledTileParserInterface {
  +tileElement: HTMLElement;

  constructor(tileElement: HTMLElement) {
    this.tileElement = tileElement;
  }

  async parse(cancelToken: CancelToken): Promise<TiledTileInterface> {
    if (cancelToken.isCancelled()) {
      throw new Cancelled(
        "Cancel token was cancelled before parsing map tile."
      );
    }

    const imageElement = this.tileElement.querySelector("image");

    if (!imageElement) {
      throw new TiledTileException("Tile is missing image data");
    }

    const tiledImage = new TiledTileImage(
      xml.getStringAttribute(imageElement, "source"),
      new ElementSize<"px">(
        xml.getNumberAttribute(imageElement, "width"),
        xml.getNumberAttribute(imageElement, "height")
      )
    );

    return new TiledTile(
      xml.getNumberAttribute(this.tileElement, "id"),
      tiledImage
    );
  }
}
