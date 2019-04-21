// @flow

import * as xml from "../helpers/xml";
import ElementSize from "./ElementSize";
import Exception from "./Exception";
import TiledMapBlockObject from "./TiledMapBlockObject";
import TiledMapPositionedObjectParser from "./TiledMapPositionedObjectParser";
import TiledRelativeFilename from "./TiledRelativeFilename";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapBlockObject as TiledMapBlockObjectInterface } from "../interfaces/TiledMapBlockObject";
import type { TiledMapBlockObjectParser as TiledMapBlockObjectParserInterface } from "../interfaces/TiledMapBlockObjectParser";

export default class TiledMapBlockObjectParser
  implements TiledMapBlockObjectParserInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapFilename: string;
  +objectElement: HTMLElement;
  +tileSize: ElementSizeInterface<"px">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    mapFilename: string,
    objectElement: HTMLElement,
    tileSize: ElementSizeInterface<"px">
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapFilename = mapFilename;
    this.objectElement = objectElement;
    this.tileSize = tileSize;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapBlockObjectInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse");
    const tileHeightPixels = this.tileSize.getHeight();
    const tileWidthPixels = this.tileSize.getWidth();

    if (tileHeightPixels !== tileWidthPixels) {
      throw new Exception(
        breadcrumbs,
        "Non-square tiles are not supported with 3D objects."
      );
    }

    const objectName = xml.getStringAttribute(
      breadcrumbs,
      this.objectElement,
      "name"
    );
    const breadcrumbsObjectName = breadcrumbs.addVariable(objectName);

    const objectDepthElement = this.objectElement.querySelector(
      "property[name=depth][type=int]"
    );

    if (!objectDepthElement) {
      throw new Exception(
        breadcrumbsObjectName,
        "Object depth is not specified."
      );
    }

    const objectDepthPixels = xml.getNumberAttribute(
      breadcrumbsObjectName,
      objectDepthElement,
      "value"
    );
    const objectHeightPixels = xml.getNumberAttribute(
      breadcrumbsObjectName,
      this.objectElement,
      "height"
    );
    const objectWidthPixels = xml.getNumberAttribute(
      breadcrumbsObjectName,
      this.objectElement,
      "width"
    );

    const tiledMapPositionedObjectParser = new TiledMapPositionedObjectParser(
      breadcrumbsObjectName.add("TiledMapPositionedObjectParser"),
      this.mapFilename,
      objectName,
      this.objectElement,
      this.tileSize
    );

    const objectSourceElement = this.objectElement.querySelector(
      "property[name=source]"
    );

    return new TiledMapBlockObject(
      await tiledMapPositionedObjectParser.parse(cancelToken),
      new ElementSize<"tile">(
        objectWidthPixels / tileWidthPixels,
        objectHeightPixels / tileHeightPixels,
        objectDepthPixels / tileHeightPixels
      ),
      objectSourceElement
        ? new TiledRelativeFilename(
            this.mapFilename,
            xml.getStringAttribute(
              breadcrumbsObjectName,
              objectSourceElement,
              "value"
            )
          ).asString()
        : null
    );
  }
}
