// @flow

import * as fixtures from "../../fixtures";
import assert from "../helpers/assert";
import CancelToken from "./CancelToken";
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

  expect(ellipseObjects).toHaveLength(1);

  const polygonObjects = tiledMapObjectCollection.getPolygonObjects();

  expect(polygonObjects).toHaveLength(1);

  const rectangleObjects = tiledMapObjectCollection.getRectangleObjects();

  expect(rectangleObjects).toHaveLength(2);
});
