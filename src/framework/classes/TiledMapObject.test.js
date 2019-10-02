// @flow

import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import ElementSize from "./ElementSize";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledCustomProperties from "./TiledCustomProperties";
import TiledMapObject from "./TiledMapObject";

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  const tiledMapObject1 = new TiledMapObject(
    loggerBreadcrumbs,
    "test",
    new ElementPosition(0, 0, 0),
    new ElementRotation(0, 0, 0),
    new ElementSize(0, 0, 0),
    new TiledCustomProperties(loggerBreadcrumbs)
  );

  const tiledMapObject2 = new TiledMapObject(
    loggerBreadcrumbs,
    "test",
    new ElementPosition(0, 0, 0),
    new ElementRotation(0, 0, 0),
    new ElementSize(0, 0, 0),
    new TiledCustomProperties(loggerBreadcrumbs)
  );

  expect(tiledMapObject1.isEqual(tiledMapObject2)).toBe(true);
});
