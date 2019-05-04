// @flow

import ElementRotation from "./ElementRotation";
import ElementRotationUnserializer from "./ElementRotationUnserializer";

it("is comparable with other element rotations", function() {
  const elementRotation1 = new ElementRotation(10, 10, 5);
  const elementRotation2 = new ElementRotation(10, 10, 5);

  expect(elementRotation1.isEqual(elementRotation2)).toBe(true);
});

it("is serializable as JSON", function() {
  const elementRotation = new ElementRotation(10, 10, 5);
  const serialized = elementRotation.asJson();
  const unserializer = new ElementRotationUnserializer();
  const unserialized = unserializer.fromJson(serialized);

  expect(elementRotation.isEqual(unserialized)).toBe(true);
});
