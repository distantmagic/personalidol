// @flow

import ElementPosition from "./ElementPosition";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledPath from "./TiledPath";

it("holds information about walkable path", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);
});

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  const tiledPath1 = new TiledPath(loggerBreadcrumbs);
  tiledPath1.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath1.addStep(new ElementPosition<"tile">(1, 1));

  const tiledPath2 = new TiledPath(loggerBreadcrumbs);
  tiledPath2.addStep(new ElementPosition<"tile">(1, 1));
  tiledPath2.addStep(new ElementPosition<"tile">(0, 0));

  expect(tiledPath1.isEqual(tiledPath2)).toBe(false);
});
