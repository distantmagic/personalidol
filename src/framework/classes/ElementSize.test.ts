import ElementSize from "src/framework/classes/ElementSize";

test("calculates base area", function() {
  const elementSize = new ElementSize("px", 8, 9);

  expect(elementSize.getBaseArea()).toBe(72);
});

test("is comparable with other element sizes", function() {
  const elementSize1 = new ElementSize("px", 10, 10);
  const elementSize2 = new ElementSize("px", 10, 10);

  expect(elementSize1.isEqual(elementSize2)).toBe(true);
});

test("is comparable with other element sizes with precision", function() {
  const elementSize1 = new ElementSize("px", 10.005, 10);
  const elementSize2 = new ElementSize("px", 10.01, 10);

  expect(elementSize1.isEqualWithPrecision(elementSize2, 2)).toBe(true);
});
