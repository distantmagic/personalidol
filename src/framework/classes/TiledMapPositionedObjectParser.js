// @flow

import * as xml from "../helpers/xml";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import TiledMapPositionedObject from "./TiledMapPositionedObject";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapPositionedObject as TiledMapPositionedObjectInterface } from "../interfaces/TiledMapPositionedObject";
import type { TiledMapPositionedObjectParser as TiledMapPositionedObjectParserInterface } from "../interfaces/TiledMapPositionedObjectParser";

export default class TiledMapPositionedObjectParser implements TiledMapPositionedObjectParserInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapFilename: string;
  +objectName: string;
  +objectElement: HTMLElement;
  +tileSize: ElementSizeInterface<"px">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    mapFilename: string,
    objectName: string,
    objectElement: HTMLElement,
    tileSize: ElementSizeInterface<"px">
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapFilename = mapFilename;
    this.objectName = objectName;
    this.objectElement = objectElement;
    this.tileSize = tileSize;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapPositionedObjectInterface> {
    const breadcrumbsObjectName = this.loggerBreadcrumbs.add("parse");

    const objectPositionXPixels = xml.getNumberAttribute(breadcrumbsObjectName, this.objectElement, "x");
    const objectPositionYPixels = xml.getNumberAttribute(breadcrumbsObjectName, this.objectElement, "y");
    const objectRotationYDegrees = xml.getNumberAttribute(breadcrumbsObjectName, this.objectElement, "rotation", 0);

    const tileHeightPixels = this.tileSize.getHeight();
    const tileWidthPixels = this.tileSize.getWidth();

    return new TiledMapPositionedObject(
      this.objectName,
      new ElementPosition<"tile">(objectPositionXPixels / tileWidthPixels, objectPositionYPixels / tileHeightPixels),
      new ElementRotation<"radians">(0, 0, (-1 * objectRotationYDegrees * Math.PI) / 180)
    );
  }
}
