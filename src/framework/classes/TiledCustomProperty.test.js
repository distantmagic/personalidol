// @flow

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledCustomProperty from "./TiledCustomProperty";
import TiledCustomPropertyUnserializer from "./TiledCustomPropertyUnserializer";

it("is serializable as JSON", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  const tiledCustomProperty = new TiledCustomProperty(
    loggerBreadcrumbs,
    "foo",
    "string",
    "bar"
  );
  const serialized = tiledCustomProperty.asJson();

  const unserializer = new TiledCustomPropertyUnserializer(loggerBreadcrumbs);
  const unserialized = unserializer.fromJson(serialized);

  expect(tiledCustomProperty.isEqual(unserialized)).toBe(true);
});
