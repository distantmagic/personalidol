// @flow

import * as xml from "../helpers/xml";
import ElementSize from "./ElementSize";
import TiledTile from "./TiledTile";
import TiledTileImage from "./TiledTileImage";

import type { TiledTile as TiledTileInterface } from "../interfaces/TiledTile";

export default class TiledTileParser {
  +tileElement: HTMLElement;

  constructor(tileElement: HTMLElement) {
    this.tileElement = tileElement;
  }

  async parse(): Promise<TiledTileInterface> {
    const imageElement = this.tileElement.querySelector("image");

    if (!imageElement) {
      throw new Error("Tile is missing image data");
    }

    const tiledImage = new TiledTileImage(
      xml.getStringAttribute(imageElement, "source"),
      new ElementSize<"px">(
        xml.getNumberAttribute(imageElement, "width"),
        xml.getNumberAttribute(imageElement, "height")
      )
    );

    return new TiledTile(
      xml.getStringAttribute(this.tileElement, "id"),
      tiledImage
    );
  }
}
