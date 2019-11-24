// @flow

import ElementPosition from "./ElementPosition";

test("calculates distance to other element position", function() {
  const elementPosition1 = new ElementPosition(10, 10, 5);
  const elementPosition2 = new ElementPosition(10, 20, 5);

  const e1toe2Distance = elementPosition1.distanceTo(elementPosition2);
  const e2toe1Distance = elementPosition2.distanceTo(elementPosition1);

  expect(e1toe2Distance).toBe(e2toe1Distance);
  expect(e1toe2Distance).toBe(10);
});

test("checks if point is on line between other points", function() {
  const elementPosition1 = new ElementPosition(10, 10, 0);
  const elementPosition2 = new ElementPosition(20, 20, 0);
  const elementPosition3 = new ElementPosition(20, 20, 0);

  expect(elementPosition3.isOnLineBetween(elementPosition1, elementPosition2)).toBe(true);
});

test("is comparable with other element positions", function() {
  const elementPosition1 = new ElementPosition(10, 10, 5);
  const elementPosition2 = new ElementPosition(10, 10, 4);

  expect(elementPosition1.isEqual(elementPosition2)).toBe(false);
});

test("is comparable with other element positions with precision", function() {
  const elementPosition1 = new ElementPosition(10.005, 10.005, 5.005);
  const elementPosition2 = new ElementPosition(10.01, 10.01, 5.01);

  expect(elementPosition1.isEqualWithPrecision(elementPosition2, 2)).toBe(true);
});

test("can be offsetted by other element position and stays immutable", function() {
  const elementPosition = new ElementPosition(1, 2, 4);
  const offsetted = elementPosition.offset(new ElementPosition(8, 16, 32));

  expect(elementPosition.getX()).toBe(1);
  expect(elementPosition.getY()).toBe(2);
  expect(elementPosition.getZ()).toBe(4);

  expect(offsetted.getX()).toBe(9);
  expect(offsetted.getY()).toBe(18);
  expect(offsetted.getZ()).toBe(36);
});
