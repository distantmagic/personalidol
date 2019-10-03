// @flow

import * as fixtures from "../../fixtures";
import assert from "../helpers/assert";
import CancelToken from "./CancelToken";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import ElementSize from "./ElementSize";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledMapObjectLayerParser from "./TiledMapObjectLayerParser";

it("parses object collection", async function() {
  const mapDocument = await fixtures.xmlFile("map-fixture-01.tmx");
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const mapHTMLElement = assert<HTMLElement>(loggerBreadcrumbs, mapDocument.documentElement);
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const tiledMapObjectCollectionParser = new TiledMapObjectLayerParser(
    loggerBreadcrumbs,
    mapHTMLElement,
    new ElementSize<"px">(128, 128)
  );
  const tiledMapObjectCollection = await tiledMapObjectCollectionParser.parse(cancelToken);

  const ellipseObjects = tiledMapObjectCollection.getEllipseObjects();

  expect(ellipseObjects.asArray()).toHaveLength(1);
  expect(
    ellipseObjects
      .item(0)
      .getElementPosition()
      .isEqual(new ElementPosition<"tile">(4, 13, 0))
  ).toBe(true);
  expect(
    ellipseObjects
      .item(0)
      .getElementRotation()
      .isEqual(new ElementRotation<"radians">(0, 0, 0))
  ).toBe(true);
  expect(
    ellipseObjects
      .item(0)
      .getElementSize()
      .isEqual(new ElementSize<"tile">(5, 5, 0.125))
  ).toBe(true);
  expect(ellipseObjects.item(0).hasSource()).toBe(false);

  const polygonObjects = tiledMapObjectCollection.getPolygonObjects();

  expect(polygonObjects.asArray()).toHaveLength(1);

  // although polygon starting point is placed at (13, 16), the actual points
  // bounding box starts at (13, 14) because one of the points is (7, -2)
  expect(
    polygonObjects
      .item(0)
      .getElementPosition()
      .isEqual(new ElementPosition<"tile">(13, 14, 0))
  ).toBe(true);
  expect(
    polygonObjects
      .item(0)
      .getElementRotation()
      .isEqual(new ElementRotation<"radians">(0, 0, 0))
  ).toBe(true);
  expect(
    polygonObjects
      .item(0)
      .getElementSize()
      .isEqual(new ElementSize<"tile">(7, 10, 0.125))
  ).toBe(true);
  expect(polygonObjects.item(0).hasSource()).toBe(false);

  const rectangleObjects = tiledMapObjectCollection.getRectangleObjects();

  expect(rectangleObjects.asArray()).toHaveLength(2);
  expect(
    rectangleObjects
      .item(0)
      .getElementPosition()
      .isEqual(new ElementPosition<"tile">(8, 1, 0))
  ).toBe(true);
  expect(
    rectangleObjects
      .item(0)
      .getElementRotation()
      .isEqualWithPrecision(new ElementRotation<"radians">(0, 0, 0.785), -3)
  ).toBe(true);
  expect(
    rectangleObjects
      .item(0)
      .getElementSize()
      .isEqual(new ElementSize<"tile">(5, 2, 0.25))
  ).toBe(true);
  expect(rectangleObjects.item(0).hasSource()).toBe(false);

  expect(
    rectangleObjects
      .item(1)
      .getElementPosition()
      .isEqual(new ElementPosition<"tile">(13, 2, 0))
  ).toBe(true);
  expect(
    rectangleObjects
      .item(1)
      .getElementRotation()
      .isEqual(new ElementRotation<"radians">(0, 0, 0))
  ).toBe(true);
  expect(
    rectangleObjects
      .item(1)
      .getElementSize()
      .isEqual(new ElementSize<"tile">(9, 2, 0.25))
  ).toBe(true);
  expect(rectangleObjects.item(1).hasSource()).toBe(true);
  expect(rectangleObjects.item(1).getSource()).toBe("foo-model.fbx");
});
