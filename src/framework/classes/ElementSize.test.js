// @flow

import ElementSize from "./ElementSize";

it("is comparable with other element sizes", function() {
  const elementSize1 = new ElementSize(10, 10);
  const elementSize2 = new ElementSize(10, 10);

  expect(elementSize1.isEqual(elementSize2)).toBe(true);
});

it("is serializable as JSON", function() {
  const elementSize = new ElementSize(10, 20);
  const serialized = elementSize.asJson();
  let result;

  expect(function() {
    result = JSON.parse(serialized);
  }).not.toThrow();

  expect(result).toEqual({
    depth: 0,
    height: 20,
    width: 10
  });
});
