// @flow

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledCustomProperties from "./TiledCustomProperties";
import TiledCustomPropertiesUnserializer from "./TiledCustomPropertiesUnserializer";
import TiledCustomProperty from "./TiledCustomProperty";

it("is serializable as JSON", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  const tiledCustomProperties = new TiledCustomProperties(loggerBreadcrumbs);

  tiledCustomProperties.addProperty(new TiledCustomProperty(loggerBreadcrumbs, "foo", "string", "bar"));

  const serialized = tiledCustomProperties.asJson();

  const unserializer = new TiledCustomPropertiesUnserializer(loggerBreadcrumbs);
  const unserialized = unserializer.fromJson(serialized);

  expect(tiledCustomProperties.isEqual(unserialized)).toBe(true);
});
