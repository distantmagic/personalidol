// @flow

import ElementPosition from "./ElementPosition";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledPath from "./TiledPath";
import TiledPathEasing from "./TiledPathEasing";

it("smoothens movements", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);

  tiledPath.addStep(new ElementPosition<"tile">(0, 0));

  const correctStep = new ElementPosition<"tile">(0, 1);
  tiledPath.addStep(correctStep);

  tiledPath.addStep(new ElementPosition<"tile">(1, 1));
  tiledPath.addStep(new ElementPosition<"tile">(2, 1));
  tiledPath.addStep(new ElementPosition<"tile">(2, 2));

  const tiledPathEasing = new TiledPathEasing(tiledPath);
  const elementPosition = tiledPathEasing.getElementPositionAtTime(1, 1);

  expect(elementPosition.isEqual(correctStep)).toBe(true);
});
