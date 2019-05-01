// @flow

import * as xml from "../helpers/xml";
import Exception from "./Exception";
import TiledMapPolygonObject from "./TiledMapPolygonObject";
import TiledMapPolygonPointsParser from "./TiledMapPolygonPointsParser";
import TiledMapPositionedObjectParser from "./TiledMapPositionedObjectParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapPolygonObject as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapPolygonObject";
import type { TiledMapPolygonObjectParser as TiledMapPolygonObjectParserInterface } from "../interfaces/TiledMapPolygonObjectParser";

export default class TiledMapPolygonObjectParser
  implements TiledMapPolygonObjectParserInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapFilename: string;
  +objectElement: HTMLElement;
  +tileSize: ElementSize<"px">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    mapFilename: string,
    objectElement: HTMLElement,
    tileSize: ElementSize<"px">
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapFilename = mapFilename;
    this.objectElement = objectElement;
    this.tileSize = tileSize;
  }

  async parse(
    cancelToken: CancelToken
  ): Promise<TiledMapPolygonObjectInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse");
    const objectName = xml.getStringAttribute(
      breadcrumbs,
      this.objectElement,
      "name"
    );
    const breadcrumbsObjectName = breadcrumbs.addVariable(objectName);

    const polygonElement = this.objectElement.getElementsByTagName("polygon").item(0);

    if (!polygonElement) {
      throw new Exception(breadcrumbs, "Polygon points element is not defined");
    }

    const tiledMapPositionedObjectParser = new TiledMapPositionedObjectParser(
      breadcrumbsObjectName.add("TiledMapPositionedObjectParser"),
      this.mapFilename,
      objectName,
      this.objectElement,
      this.tileSize
    );
    const tiledMapPolygonPointsParser = new TiledMapPolygonPointsParser(
      breadcrumbsObjectName.add("TiledMapPolygonPointsParser"),
      xml.getStringAttribute(breadcrumbsObjectName, polygonElement, "points"),
      this.tileSize
    );

    const objectDepthElement = xml.getElementWithAttributes(
      breadcrumbsObjectName,
      this.objectElement,
      "property",
      {
        name: "depth",
        type: "int"
      }
    );

    if (!objectDepthElement) {
      throw new Exception(
        breadcrumbsObjectName,
        "Object depth is not specified."
      );
    }

    return new TiledMapPolygonObject(
      await tiledMapPositionedObjectParser.parse(cancelToken),
      await tiledMapPolygonPointsParser.parse(cancelToken),
      xml.getNumberAttribute(
        breadcrumbsObjectName,
        objectDepthElement,
        "value"
      ) / this.tileSize.getWidth()
    );
  }
}
