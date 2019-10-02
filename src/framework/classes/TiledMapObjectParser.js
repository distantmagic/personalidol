// @flow

import * as angle from "../helpers/angle";
import * as xml from "../helpers/xml";
import assert from "../helpers/assert";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import ElementSize from "./ElementSize";
import TiledCustomPropertiesParser from "./TiledCustomPropertiesParser";
import TiledMapPolygonPointsParser from "./TiledMapPolygonPointsParser";
import XMLDocumentException from "./Exception/XMLDocument";
import { default as TiledMapEllipseObject } from "./TiledMapObject/Ellipse";
import { default as TiledMapPolygonObject } from "./TiledMapObject/Polygon";
import { default as TiledMapRectangleObject } from "./TiledMapObject/Rectangle";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { ElementRotation as ElementRotationInterface } from "../interfaces/ElementRotation";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { Ellipse as TiledMapEllipseObjectInterface } from "../interfaces/TiledMapObject/Ellipse";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Polygon as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapObject/Polygon";
import type { Rectangle as TiledMapRectangleObjectInterface } from "../interfaces/TiledMapObject/Rectangle";
import type { TiledCustomProperties } from "../interfaces/TiledCustomProperties";
import type { TiledMapObjectParser as TiledMapObjectParserInterface } from "../interfaces/TiledMapObjectParser";

export default class TiledMapObjectParser implements TiledMapObjectParserInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tileSize: ElementSizeInterface<"px">;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, tileSize: ElementSizeInterface<"px">) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tileSize = tileSize;
  }

  async createEllipseObject(cancelToken: CancelToken, element: HTMLElement): Promise<TiledMapEllipseObjectInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("createEllipseObject");

    return new TiledMapEllipseObject(
      breadcrumbs,
      xml.getStringAttribute(breadcrumbs, element, "name"),
      this.getElementPosition(breadcrumbs, element),
      this.getElementRotation(breadcrumbs, element),
      this.getRectangleElementSize(breadcrumbs, element),
      await this.getElementCustomProperties(breadcrumbs, cancelToken, element)
    );
  }

  async createPolygonObject(cancelToken: CancelToken, element: HTMLElement): Promise<TiledMapPolygonObjectInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("createPolygonObject");
    const polygonElements = element.getElementsByTagName("polygon");

    if (1 !== polygonElements.length) {
      throw new XMLDocumentException(
        breadcrumbs,
        "There should be exactly 1 polygon tag inside polygon object definition."
      );
    }

    const polygonElement = assert<HTMLElement>(breadcrumbs, polygonElements.item(0));
    const polygonPointsString: string = xml.getStringAttribute(breadcrumbs, polygonElement, "points");
    const tiledMapPolygonPointsParser = new TiledMapPolygonPointsParser(
      breadcrumbs,
      polygonPointsString,
      this.tileSize
    );
    const tiledMapPolygonPoints = await tiledMapPolygonPointsParser.parse(cancelToken);

    console.log(tiledMapPolygonPoints);

    return new TiledMapPolygonObject(
      breadcrumbs,
      xml.getStringAttribute(breadcrumbs, element, "name"),
      this.getElementPosition(breadcrumbs, element),
      this.getElementRotation(breadcrumbs, element),
      new ElementSize<"tile">(0, 0, 0),
      await this.getElementCustomProperties(breadcrumbs, cancelToken, element),
      tiledMapPolygonPoints
    );
  }

  async createRectangleObject(
    cancelToken: CancelToken,
    element: HTMLElement
  ): Promise<TiledMapRectangleObjectInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("createRectangleObject");

    return new TiledMapRectangleObject(
      breadcrumbs,
      xml.getStringAttribute(breadcrumbs, element, "name"),
      this.getElementPosition(breadcrumbs, element),
      this.getElementRotation(breadcrumbs, element),
      this.getRectangleElementSize(breadcrumbs, element),
      await this.getElementCustomProperties(breadcrumbs, cancelToken, element)
    );
  }

  getElementPosition(breadcrumbs: LoggerBreadcrumbs, element: HTMLElement): ElementPositionInterface<"tile"> {
    return new ElementPosition<"tile">(
      xml.getNumberAttribute(breadcrumbs, element, "x"),
      xml.getNumberAttribute(breadcrumbs, element, "y"),
      xml.getNumberAttribute(breadcrumbs, element, "z", 0)
    );
  }

  getElementRotation(breadcrumbs: LoggerBreadcrumbs, element: HTMLElement): ElementRotationInterface<"radians"> {
    const rotation = angle.deg2radians(xml.getNumberAttribute(breadcrumbs, element, "rotation", 0));

    return new ElementRotation<"radians">(0, 0, rotation);
  }

  getElementCustomProperties(
    breadcrumbs: LoggerBreadcrumbs,
    cancelToken: CancelToken,
    element: HTMLElement
  ): Promise<TiledCustomProperties> {
    const tiledCustomPropertiesParser = new TiledCustomPropertiesParser(
      breadcrumbs.add("TiledCustomPropertiesParser"),
      element
    );

    return tiledCustomPropertiesParser.parse(cancelToken);
  }

  getRectangleElementSize(breadcrumbs: LoggerBreadcrumbs, element: HTMLElement): ElementSizeInterface<"tile"> {
    return new ElementSize<"tile">(
      xml.getNumberAttribute(breadcrumbs, element, "width"),
      xml.getNumberAttribute(breadcrumbs, element, "height"),
      0
    );
  }
}
