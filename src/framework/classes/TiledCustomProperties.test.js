// @flow

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledCustomProperties from "./TiledCustomProperties";
import TiledCustomProperty from "./TiledCustomProperty";

it("checks if custom property is present", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  const tiledCustomProperties = new TiledCustomProperties(loggerBreadcrumbs);
  const tiledCustomProperty1 = new TiledCustomProperty(loggerBreadcrumbs, "foo", "string", "bar");

  expect(tiledCustomProperties.hasProperty(tiledCustomProperty1)).toBe(false);

  tiledCustomProperties.addProperty(tiledCustomProperty1);

  const tiledCustomProperty2 = new TiledCustomProperty(loggerBreadcrumbs, "foo", "string", "bar");

  expect(tiledCustomProperties.hasProperty(tiledCustomProperty2)).toBe(true);
});
