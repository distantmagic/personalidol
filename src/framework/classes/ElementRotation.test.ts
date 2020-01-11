// @flow strict

import ElementRotation from "./ElementRotation";

test("is comparable with other element rotations", function() {
  const elementRotation1 = new ElementRotation(10, 10, 5);
  const elementRotation2 = new ElementRotation(10, 10, 5);

  expect(elementRotation1.isEqual(elementRotation2)).toBe(true);
});

test("is comparable with other element rotations with precision", function() {
  const elementRotation1 = new ElementRotation(10.005, 10.005, 5);
  const elementRotation2 = new ElementRotation(10.01, 10.01, 5);

  expect(elementRotation1.isEqualWithPrecision(elementRotation2, 2)).toBe(true);
});
