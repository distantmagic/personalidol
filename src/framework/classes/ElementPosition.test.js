// @flow

import ElementPosition from "./ElementPosition";
import ElementPositionUnserializer from "./ElementPositionUnserializer";

it("is comparable with other element positions", function() {
  const elementPosition1 = new ElementPosition(10, 10, 5);
  const elementPosition2 = new ElementPosition(10, 10, 4);

  expect(elementPosition1.isEqual(elementPosition2)).toBe(false);
});

it("is serializable as JSON", function() {
  const elementPosition = new ElementPosition(10, 10, 5);
  const serialized = elementPosition.asJson();
  const unserializer = new ElementPositionUnserializer();
  const unserialized = unserializer.fromJson(serialized);

  expect(elementPosition.isEqual(unserialized)).toBe(true);
});
