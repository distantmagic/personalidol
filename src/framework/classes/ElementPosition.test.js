// @flow

import ElementPosition from "./ElementPosition";

it("calculates distance to other element position", function() {
  const elementPosition1 = new ElementPosition(10, 10, 5);
  const elementPosition2 = new ElementPosition(10, 20, 5);

  const e1toe2Distance = elementPosition1.distanceTo(elementPosition2);
  const e2toe1Distance = elementPosition2.distanceTo(elementPosition1);

  expect(e1toe2Distance).toBe(e2toe1Distance);
  expect(e1toe2Distance).toBe(10);
});

it("checks if point is on line between other points", function() {
  const elementPosition1 = new ElementPosition(10, 10, 0);
  const elementPosition2 = new ElementPosition(20, 20, 0);
  const elementPosition3 = new ElementPosition(20, 20, 0);

  expect(elementPosition3.isOnLineBetween(elementPosition1, elementPosition2)).toBe(true);
});

it("is comparable with other element positions", function() {
  const elementPosition1 = new ElementPosition(10, 10, 5);
  const elementPosition2 = new ElementPosition(10, 10, 4);

  expect(elementPosition1.isEqual(elementPosition2)).toBe(false);
});
