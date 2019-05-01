// @flow

import * as xml from "../helpers/xml";
import Cancelled from "./Exception/Cancelled";
import ElementSize from "./ElementSize";
import TiledRelativeFilename from "./TiledRelativeFilename";
import TiledTile from "./TiledTile";
import TiledTileImage from "./TiledTileImage";
import { default as TiledTileException } from "./Exception/Tiled/Tile";

import type { CancelToken } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledTile as TiledTileInterface } from "../interfaces/TiledTile";
import type { TiledTileParser as TiledTileParserInterface } from "../interfaces/TiledTileParser";

export default class TiledTileParser implements TiledTileParserInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tileElement: HTMLElement;
  +tilesetPath: string;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    tilesetPath: string,
    tileElement: HTMLElement
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tileElement = tileElement;
    this.tilesetPath = tilesetPath;
  }

  async parse(cancelToken: CancelToken): Promise<TiledTileInterface> {
    const breadcrumbs = this.loggerBreadcrumbs
      .add("parse")
      .add(this.tilesetPath);

    if (cancelToken.isCancelled()) {
      throw new Cancelled(
        breadcrumbs,
        "Cancel token was cancelled before parsing map tile."
      );
    }

    const imageElement = this.tileElement.getElementsByTagName("image").item(0);

    if (!imageElement) {
      throw new TiledTileException(breadcrumbs, "Tile is missing image data");
    }

    const tiledImage = new TiledTileImage(
      new TiledRelativeFilename(
        this.tilesetPath,
        xml.getStringAttribute(breadcrumbs, imageElement, "source")
      ).asString(),
      new ElementSize<"px">(
        xml.getNumberAttribute(breadcrumbs, imageElement, "width"),
        xml.getNumberAttribute(breadcrumbs, imageElement, "height")
      )
    );

    return new TiledTile(
      xml.getNumberAttribute(breadcrumbs, this.tileElement, "id"),
      tiledImage
    );
  }
}
