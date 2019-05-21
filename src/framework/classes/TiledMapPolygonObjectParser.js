// @flow

import * as xml from "../helpers/xml";
import assert from "../helpers/assert";
import Exception from "./Exception";
import TiledCustomPropertiesParser from "./TiledCustomPropertiesParser";
import TiledMapPolygonObject from "./TiledMapPolygonObject";
import TiledMapPolygonPointsParser from "./TiledMapPolygonPointsParser";
import TiledMapPositionedObjectParser from "./TiledMapPositionedObjectParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapPolygonObject as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapPolygonObject";
import type { TiledMapPolygonObjectParser as TiledMapPolygonObjectParserInterface } from "../interfaces/TiledMapPolygonObjectParser";

export default class TiledMapPolygonObjectParser implements TiledMapPolygonObjectParserInterface {
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

  async parse(cancelToken: CancelToken): Promise<TiledMapPolygonObjectInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse");
    const objectName = xml.getStringAttribute(breadcrumbs, this.objectElement, "name");
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

    const tiledCustomPropertiesParser = new TiledCustomPropertiesParser(
      breadcrumbs,
      assert<HTMLElement>(breadcrumbs, this.objectElement.getElementsByTagName("properties").item(0))
    );
    const tiledCustomProperties = await tiledCustomPropertiesParser.parse(cancelToken);
    const objectDepthProperty = tiledCustomProperties.getPropertyByName("depth");
    const objectDepthPixels = parseInt(objectDepthProperty.getValue(), 10);

    return new TiledMapPolygonObject(
      await tiledMapPositionedObjectParser.parse(cancelToken),
      await tiledMapPolygonPointsParser.parse(cancelToken),
      objectDepthPixels / this.tileSize.getWidth()
    );
  }
}
