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

function getElementPosition(
  breadcrumbs: LoggerBreadcrumbs,
  element: HTMLElement,
  tileSize: ElementSizeInterface<"px">
): ElementPositionInterface<"tile"> {
  return new ElementPosition<"tile">(
    xml.getNumberAttribute(breadcrumbs, element, "x") / tileSize.getWidth(),
    xml.getNumberAttribute(breadcrumbs, element, "y") / tileSize.getWidth(),
    xml.getNumberAttribute(breadcrumbs, element, "z", 0) / tileSize.getWidth()
  );
}

function getElementRotation(breadcrumbs: LoggerBreadcrumbs, element: HTMLElement): ElementRotationInterface<"radians"> {
  const rotation = angle.deg2radians(xml.getNumberAttribute(breadcrumbs, element, "rotation", 0));

  return new ElementRotation<"radians">(0, 0, rotation);
}

function getElementCustomProperties(
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

function getElementDepthPx(
  breadcrumbs: LoggerBreadcrumbs,
  element: HTMLElement,
  tiledCustomProperties: TiledCustomProperties
): number {
  if (!tiledCustomProperties.hasPropertyByName("depth")) {
    return 0;
  }

  const depthProperty = tiledCustomProperties.getPropertyByName("depth");

  switch (depthProperty.getType()) {
    case "float":
      return parseFloat(depthProperty.getValue());
    case "int":
      return parseInt(depthProperty.getValue(), 10);
    default:
      throw new XMLDocumentException(
        breadcrumbs.add("depthProperty").add("getType"),
        "Element depth property must be either 'float' or 'int'."
      );
  }
}

function getElementDepth(
  breadcrumbs: LoggerBreadcrumbs,
  element: HTMLElement,
  tileSize: ElementSizeInterface<"px">,
  tiledCustomProperties: TiledCustomProperties
): number {
  return getElementDepthPx(breadcrumbs, element, tiledCustomProperties) / tileSize.getWidth();
}

function getRectangleElementSize(
  breadcrumbs: LoggerBreadcrumbs,
  element: HTMLElement,
  tileSize: ElementSizeInterface<"px">,
  tiledCustomProperties: TiledCustomProperties
): ElementSizeInterface<"tile"> {
  return new ElementSize<"tile">(
    xml.getNumberAttribute(breadcrumbs, element, "width") / tileSize.getWidth(),
    xml.getNumberAttribute(breadcrumbs, element, "height") / tileSize.getHeight(),
    getElementDepth(breadcrumbs, element, tileSize, tiledCustomProperties)
  );
}

export default class TiledMapObjectParser implements TiledMapObjectParserInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tileSize: ElementSizeInterface<"px">;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, tileSize: ElementSizeInterface<"px">) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tileSize = tileSize;
  }

  async createEllipseObject(cancelToken: CancelToken, element: HTMLElement): Promise<TiledMapEllipseObjectInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("createEllipseObject");
    const elementCustomProperties = await getElementCustomProperties(breadcrumbs, cancelToken, element);

    return new TiledMapEllipseObject(
      breadcrumbs,
      xml.getStringAttribute(breadcrumbs, element, "name"),
      getElementPosition(breadcrumbs, element, this.tileSize),
      getElementRotation(breadcrumbs, element),
      getRectangleElementSize(breadcrumbs, element, this.tileSize, elementCustomProperties),
      elementCustomProperties
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

    const elementCustomProperties = await getElementCustomProperties(breadcrumbs, cancelToken, element);
    const polygonElement = assert<HTMLElement>(breadcrumbs, polygonElements.item(0));
    const polygonPointsString: string = xml.getStringAttribute(breadcrumbs, polygonElement, "points");
    const tiledMapPolygonPointsParser = new TiledMapPolygonPointsParser(
      breadcrumbs,
      polygonPointsString,
      this.tileSize
    );
    const tiledMapPolygonPoints = await tiledMapPolygonPointsParser.parse(cancelToken);
    const polygonDepth = getElementDepth(breadcrumbs, element, this.tileSize, elementCustomProperties);
    const polygonPosition = getElementPosition(breadcrumbs, element, this.tileSize);
    const polygonBoundingBox = tiledMapPolygonPoints.offsetCollection(polygonPosition).getElementBoundingBox();
    const polygonBoundingBoxSize = polygonBoundingBox.getElementSize();

    return new TiledMapPolygonObject(
      breadcrumbs,
      xml.getStringAttribute(breadcrumbs, element, "name"),
      polygonBoundingBox.getElementPosition(),
      getElementRotation(breadcrumbs, element),
      // polygon points are 2D, so third component can be discarded
      new ElementSize<"tile">(polygonBoundingBoxSize.getWidth(), polygonBoundingBoxSize.getHeight(), polygonDepth),
      elementCustomProperties,
      tiledMapPolygonPoints
    );
  }

  async createRectangleObject(
    cancelToken: CancelToken,
    element: HTMLElement
  ): Promise<TiledMapRectangleObjectInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("createRectangleObject");
    const elementCustomProperties = await getElementCustomProperties(breadcrumbs, cancelToken, element);

    return new TiledMapRectangleObject(
      breadcrumbs,
      xml.getStringAttribute(breadcrumbs, element, "name"),
      getElementPosition(breadcrumbs, element, this.tileSize),
      getElementRotation(breadcrumbs, element),
      getRectangleElementSize(breadcrumbs, element, this.tileSize, elementCustomProperties),
      elementCustomProperties
    );
  }
}
