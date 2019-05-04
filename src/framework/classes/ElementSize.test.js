// @flow

import ElementSize from "./ElementSize";
import ElementSizeUnserializer from "./ElementSizeUnserializer";

it("is comparable with other element sizes", function() {
  const elementSize1 = new ElementSize(10, 10);
  const elementSize2 = new ElementSize(10, 10);

  expect(elementSize1.isEqual(elementSize2)).toBe(true);
});

it("is serializable as JSON", function() {
  const elementSize = new ElementSize(10, 20);
  const serialized = elementSize.asJson();
  const unserializer = new ElementSizeUnserializer();
  const unserialized = unserializer.fromJson(serialized);

  expect(elementSize.isEqual(unserialized)).toBe(true);
});
