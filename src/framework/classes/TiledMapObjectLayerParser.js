// @flow

import Cancelled from "./Exception/Cancelled";
import TiledMapObjectElementChecker from "./TiledMapObjectElementChecker";
import TiledMapObjectLayer from "./TiledMapObjectLayer";
import TiledMapObjectParser from "./TiledMapObjectParser";
import { default as TiledException } from "./Exception/Tiled";
import { default as XMLDocumentException } from "./Exception/XMLDocument";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapObjectLayer as TiledMapObjectLayerInterface } from "../interfaces/TiledMapObjectLayer";
import type { TiledMapObjectLayerParser as TiledMapObjectLayerParserInterface } from "../interfaces/TiledMapObjectLayerParser";

export default class TiledMapObjectLayerParser implements TiledMapObjectLayerParserInterface {
  +documentElement: HTMLElement;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tileSize: ElementSize<"px">;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, documentElement: HTMLElement, tileSize: ElementSize<"px">) {
    this.documentElement = documentElement;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tileSize = tileSize;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapObjectLayerInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse");

    if (cancelToken.isCancelled()) {
      throw new Cancelled(breadcrumbs, "Cancel token has been cancelled before parsing map objects.");
    }

    const objectElements = this.documentElement.getElementsByTagName("object");
    const tiledMapObjectLayer = new TiledMapObjectLayer(breadcrumbs.add("TiledMapObjectLayer"));

    for (let i = 0; i < objectElements.length; i += 1) {
      const objectElement = objectElements.item(i);

      if (!objectElement) {
        throw new XMLDocumentException(breadcrumbs.addVariable(String(i)), "Object element is missing.");
      }

      const tiledMapObjectElementChecker = new TiledMapObjectElementChecker(objectElement);
      const tiledMapObjectParser = new TiledMapObjectParser(breadcrumbs.add("TiledMapObjectParser"), this.tileSize);

      if (tiledMapObjectElementChecker.isEllipse()) {
        tiledMapObjectLayer.addEllipseObject(await tiledMapObjectParser.createEllipseObject(cancelToken, objectElement));
      } else if (tiledMapObjectElementChecker.isRectangle()) {
        tiledMapObjectLayer.addRectangleObject(await tiledMapObjectParser.createRectangleObject(cancelToken, objectElement));
      } else if (tiledMapObjectElementChecker.isPolygon()) {
        tiledMapObjectLayer.addPolygonObject(await tiledMapObjectParser.createPolygonObject(cancelToken, objectElement));
      } else {
        throw new TiledException(breadcrumbs, "Unknown map element type.");
      }
    }

    return tiledMapObjectLayer;
  }
}
