// @flow

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledCustomProperty from "./TiledCustomProperty";

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  const tiledCustomProperty1 = new TiledCustomProperty(loggerBreadcrumbs, "foo", "string", "bar");
  const tiledCustomProperty2 = new TiledCustomProperty(loggerBreadcrumbs, "foo", "string", "bar");

  expect(tiledCustomProperty1.isEqual(tiledCustomProperty2)).toBe(true);
});
