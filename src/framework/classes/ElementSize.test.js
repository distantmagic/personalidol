// @flow

import ElementSize from "./ElementSize";

it("calculates base area", function() {
  const elementSize = new ElementSize(8, 9);

  expect(elementSize.getBaseArea()).toBe(72);
});

it("is comparable with other element sizes", function() {
  const elementSize1 = new ElementSize(10, 10);
  const elementSize2 = new ElementSize(10, 10);

  expect(elementSize1.isEqual(elementSize2)).toBe(true);
});
