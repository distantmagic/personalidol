// @flow

import * as fixtures from "../../fixtures";
import assert from "../helpers/assert";
import CancelToken from "./CancelToken";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledMapObjectLayerParser from "./TiledMapObjectLayerParser";

it("parses object collection", async function() {
  const mapDocument = await fixtures.xmlFile("map-fixture-01.tmx");
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const mapHTMLElement = assert<HTMLElement>(loggerBreadcrumbs, mapDocument.documentElement);
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const tiledMapObjectCollectionParser = new TiledMapObjectLayerParser(loggerBreadcrumbs, mapHTMLElement);
  const tiledMapObjectCollection = await tiledMapObjectCollectionParser.parse(cancelToken);

  const ellipseObjects = tiledMapObjectCollection.getEllipseObjects();

  expect(ellipseObjects.asArray()).toHaveLength(1);
  expect(
    ellipseObjects
      .item(0)
      .getElementPosition()
      .isEqual(new ElementPosition<"tile">(512, 1664, 0))
  ).toBe(true);
  expect(
    ellipseObjects
      .item(0)
      .getElementRotation()
      .isEqual(new ElementRotation<"radians">(0, 0, 0))
  ).toBe(true);

  const polygonObjects = tiledMapObjectCollection.getPolygonObjects();

  expect(polygonObjects.asArray()).toHaveLength(1);
  expect(
    polygonObjects
      .item(0)
      .getElementPosition()
      .isEqual(new ElementPosition<"tile">(1664, 2048, 0))
  ).toBe(true);
  expect(
    polygonObjects
      .item(0)
      .getElementRotation()
      .isEqual(new ElementRotation<"radians">(0, 0, 0))
  ).toBe(true);

  const rectangleObjects = tiledMapObjectCollection.getRectangleObjects();

  expect(rectangleObjects.asArray()).toHaveLength(2);
  expect(
    rectangleObjects
      .item(0)
      .getElementPosition()
      .isEqual(new ElementPosition<"tile">(1024, 128, 0))
  ).toBe(true);
  expect(
    rectangleObjects
      .item(0)
      .getElementRotation()
      .isEqualWithPrecision(new ElementRotation<"radians">(0, 0, 0.785), -3)
  ).toBe(true);

  expect(
    rectangleObjects
      .item(1)
      .getElementPosition()
      .isEqual(new ElementPosition<"tile">(1664, 256, 0))
  ).toBe(true);
  expect(
    rectangleObjects
      .item(1)
      .getElementRotation()
      .isEqual(new ElementRotation<"radians">(0, 0, 0))
  ).toBe(true);
});
