// @flow

import Cancelled from "./Exception/Cancelled";
import TiledMapObjectCollection from "./TiledMapObjectCollection";
import TiledMapObjectElementChecker from "./TiledMapObjectElementChecker";
import TiledMapObjectParser from "./TiledMapObjectParser";
import { default as XMLDocumentException } from "./Exception/XMLDocument";

import type { CancelToken } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapObjectCollection as TiledMapObjectCollectionInterface } from "../interfaces/TiledMapObjectCollection";
import type { TiledMapObjectCollectionParser as TiledMapObjectCollectionParserInterface } from "../interfaces/TiledMapObjectCollectionParser";

export default class TiledMapObjectCollectionParser implements TiledMapObjectCollectionParserInterface {
  +documentElement: Document;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, documentElement: Document) {
    this.documentElement = documentElement;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapObjectCollectionInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse");

    if (cancelToken.isCancelled()) {
      throw new Cancelled(breadcrumbs, "Cancel token has been cancelled before parsing map objects.");
    }

    const objectElements = this.documentElement.getElementsByTagName("object");
    const tiledMapObjectCollection = new TiledMapObjectCollection(breadcrumbs.add("TiledMapObjectCollection"));

    for (let i = 0; i < objectElements.length; i += 1) {
      const objectElement = objectElements.item(i);

      if (!objectElement) {
        throw new XMLDocumentException(breadcrumbs.addVariable(String(i)), "Object element is missing.");
      }

      const tiledMapObjectElementChecker = new TiledMapObjectElementChecker(objectElement);
      const tiledMapObjectParser = new TiledMapObjectParser(breadcrumbs.add("TiledMapObjectParser"));

      if (tiledMapObjectElementChecker.isEllipse()) {
        tiledMapObjectCollection.addEllipseObject(await tiledMapObjectParser.createEllipseObject());
      }
      console.log(
        tiledMapObjectElementChecker.isEllipse(),
        tiledMapObjectElementChecker.isRectangle(),
        tiledMapObjectElementChecker.isPolygon()
      );
    }

    return tiledMapObjectCollection;
  }
}
