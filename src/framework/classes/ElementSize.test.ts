import ElementSize from "src/framework/classes/ElementSize";

import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

test("calculates base area", function() {
  const elementSize = new ElementSize(ElementPositionUnit.Px, 8, 9);

  expect(elementSize.getBaseArea()).toBe(72);
});

test("is comparable with other element sizes", function() {
  const elementSize1 = new ElementSize(ElementPositionUnit.Px, 10, 10);
  const elementSize2 = new ElementSize(ElementPositionUnit.Px, 10, 10);

  expect(elementSize1.isEqual(elementSize2)).toBe(true);
});

test("is comparable with other element sizes with precision", function() {
  const elementSize1 = new ElementSize(ElementPositionUnit.Px, 10.005, 10);
  const elementSize2 = new ElementSize(ElementPositionUnit.Px, 10.01, 10);

  expect(elementSize1.isEqualWithPrecision(elementSize2, 2)).toBe(true);
});
